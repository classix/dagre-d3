"use strict";

var _ = require("./lodash"),
    intersectNode = require("./intersect/intersect-node"),
    util = require("./util"),
    d3 = require("./d3");
module.exports = createEdgePaths;

function getArrowPath (type) {

  var normalArrowPath = "M 0 0 L 10 5 L 0 10 z";
  var veeArrowPath = "M 0 0 L 10 5 L 0 10 L 4 5 z";
  var undirectedArrowPath = "";
  
  var arrows = {
    "default": normalArrowPath,
    "normal": normalArrowPath,
    "vee": veeArrowPath,
    "undirected": undirectedArrowPath
  };

  return arrows[type];
}



function createEdgePaths(selection, g) {
  var svgPaths = selection.selectAll("g.edgePath")
    .data(g.edges(), function(e) { return util.edgeToId(e); })
    .classed("update", true);

  enter(svgPaths, g);
  exit(svgPaths, g);

  svgPaths = selection.selectAll("g.edgePath");

  util.applyTransition(svgPaths, g)
    .style("opacity", 1);

  // Save DOM element in the path group, and set ID and class
  svgPaths.each(function(e) {
    var domEdge = d3.select(this);
    var edge = g.edge(e);
    edge.elem = this;

    if (edge.id) {
      domEdge.attr("id", edge.id);
    }

    util.applyClass(domEdge, edge["class"],
      (domEdge.classed("update") ? "update " : "") + "edgePath");
  });

  svgPaths.selectAll("path.path")
    .each(function(e) {
      var edge = g.edge(e);

      var domEdge = d3.select(this).style("fill", "none");

      util.applyTransition(domEdge, g)
        .attr("d", function(e) { return calcPoints(g, e); });

      util.applyStyle(domEdge, edge.style);
    });

  svgPaths.selectAll("path.pathArrowHead")
    .each(function (e) {

      var edge = g.edge(e),
      lastPoint = edge.points[edge.points.length - 1],
      nextToLastPoint = edge.points[edge.points.length - 2],
      arrowhead = d3.select(this),
      bBox = arrowhead.node().getBBox(),
      angle;

      angle = Math.atan2(lastPoint.y - nextToLastPoint.y, lastPoint.x - nextToLastPoint.x) * 180 / Math.PI;

      arrowhead.attr("transform", "translate(" + lastPoint.x + "," + lastPoint.y + ") rotate(" + angle + ") translate(" +
      (-bBox.width) + "," + (-bBox.height / 2) + ")");
      
      util.applyStyle(arrowhead, edge.arrowheadStyle);

      if (edge.arrowheadClass) {
        arrowhead.attr("class", edge.arrowheadClass);
      }

    });

  return svgPaths;
}

function calcPoints(g, e) {
  var edge = g.edge(e),
      tail = g.node(e.v),
      head = g.node(e.w),
      points = edge.points.slice(1, edge.points.length - 1),
      dir = g.graph().rankdir;

  var firstPoint = intersectNode(tail, points[0]);
  var nextToLastPoint = points[points.length - 1];
  var lastPoint = intersectNode(head, nextToLastPoint);

  points.unshift(firstPoint);
  
  var iPoint = {x: lastPoint.x, y: nextToLastPoint.y}, length;
  var MAX_GRADIENT = 5;
  var MIN_LENGTH = 30;

  if (dir === "TB" || dir === "BT") {
    length = Math.abs(lastPoint.x - nextToLastPoint.x) ;
    if (length > MAX_GRADIENT) {
      if (length < MIN_LENGTH) {
        iPoint.y += ((nextToLastPoint.y - lastPoint.y) > 0 ? 1 : -1) * (MIN_LENGTH - length);
      }
      points.push(iPoint);
    }
  } else {
    length = Math.abs(lastPoint.y - nextToLastPoint.y);
    if (length > MAX_GRADIENT) {
      if (length < MIN_LENGTH) {
        iPoint.y += ((nextToLastPoint.y - lastPoint.y) > 0 ? 1 : -1) * (MIN_LENGTH - length);
      }
      points.push(iPoint);
    }
  }
  
  points.push(lastPoint);

  edge.points = points;
  
  return createLine(edge, points);
}

function createLine(edge, points) {
  var line = (d3.line || d3.svg.line)()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });
  
  (line.curve || line.interpolate)(edge.curve);

  return line(points);
}

function getCoords(elem) {
  var bbox = elem.getBBox(),
      matrix = elem.ownerSVGElement.getScreenCTM()
        .inverse()
        .multiply(elem.getScreenCTM())
        .translate(bbox.width / 2, bbox.height / 2);
  return { x: matrix.e, y: matrix.f };
}

function enter(svgPaths, g) {
  var svgPathsEnter = svgPaths.enter()
    .append("g")
      .attr("class", "edgePath")
      .style("opacity", 0);
  svgPathsEnter.append("path")
    .attr("class", "path")
    .attr("d", function(e) {
      var edge = g.edge(e),
          sourceElem = g.node(e.v).elem,
          points = _.range(edge.points.length).map(function() { return getCoords(sourceElem); });
      return createLine(edge, points);
    });
  svgPathsEnter.append("path")
    .attr("class", "pathArrowHead")
    .attr("d", function(e) {
      var edge = g.edge(e);
      return getArrowPath(edge.arrowhead);
    })
    .style("stroke-width", 1)
    .style("stroke-dasharray", "1,0");
}

function exit(svgPaths, g) {
  var svgPathExit = svgPaths.exit();
  util.applyTransition(svgPathExit, g)
    .style("opacity", 0)
    .remove();

  util.applyTransition(svgPathExit.select("path.path"), g)
    .attr("d", function(e) {
      var source = g.node(e.v);

      if (source) {
        var points = _.range(this.getTotalLength()).map(function() { return source; });
        return createLine({}, points);
      } else {
        return d3.select(this).attr("d");
      }
    });
}
