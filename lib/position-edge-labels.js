"use strict";

var util = require("./util"),
    d3 = require("./d3"),
    options = require("./options"),
    _ = require("./lodash");

module.exports = positionEdgeLabels;

var distance = function (point1, point2) {
  var a = point1.x - point2.x;
  var b = point1.y - point2.y;

  return Math.sqrt( a*a + b*b );
};

var getMaxPointsIndex = function (points) {

  var maxIndex = -1;
  var maxDistance = 0;

  for (var i = 0; i < (points.length - 1); i++) {
    var d = distance(points[i], points[i + 1]);
    if (d >= maxDistance) {
      maxDistance = d;
      maxIndex = i;
    }
  }

  return maxIndex;

};

function positionEdgeLabels(selection, g) {
  var created = selection.filter(function() { return !d3.select(this).classed("update"); });

  function translate(e) {

    var edge = g.edge(e);

    if (options.getOptions().horizontalLabels) {
      return _.has(edge, "x") ? "translate(" + edge.x + "," + edge.y + ")" : ""; 
    }

    var maxIndex = getMaxPointsIndex(edge.points),
      maxPoint1 = edge.points[maxIndex],
      maxPoint2 = edge.points[maxIndex + 1],
      maxDist = distance(maxPoint1, maxPoint2),
      angle = Math.asin((maxPoint2.y - maxPoint1.y)/maxDist) * (180 / Math.PI),
      midPointFnc = function (factor, p1, p2) { 
        return {
          x: (p1 || maxPoint1).x + ((p2 || maxPoint2).x - (p1 || maxPoint1).x) * factor,
          y: (p1 || maxPoint1).y + ((p2 || maxPoint2).y - (p1 || maxPoint1).y) * factor
        }; 
      },
      x,y, sPoint;

    var drawHorizontalLabel = function () {
      angle = 0;
      sPoint = midPointFnc(0.5, edge.points[0], edge.points[edge.points.length - 1]);
      x = sPoint.x - edge.width / 2;
      y = sPoint.y;
    };

    var MIN_OFFSET = 30;

    if (90 - Math.abs(angle) < 10 ) {
      drawHorizontalLabel();
    } else {
      if (maxPoint1.x > maxPoint2.x) {
        angle = 360 - angle;
        if (maxDist - edge.width > MIN_OFFSET) {
          sPoint = midPointFnc(((maxDist - edge.width)/2 + edge.width) / maxDist);
          x = sPoint.x;
          y = sPoint.y - edge.height;
        } else {
          drawHorizontalLabel();
        }
      } else {
        if (maxDist - edge.width > MIN_OFFSET) {
          sPoint = midPointFnc(((maxDist - edge.width)/2) / maxDist);
          x = sPoint.x;
          y = sPoint.y - edge.height;
        } else {
          drawHorizontalLabel();
        }
      }
    }

    return "translate(" + x + "," + y + ") rotate (" + angle + ")";
  }

  created.attr("transform", translate);

  util.applyTransition(selection, g)
    .style("opacity", 1)
    .attr("transform", translate);
}
