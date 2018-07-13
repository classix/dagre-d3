"use strict";

var _ = require("./lodash"),
    addLabel = require("./label/add-label"),
    util = require("./util"),
    d3 = require("./d3");

module.exports = createNodes;

function createNodes(selection, g, shapes) {
  var simpleNodes = g.nodes().filter(function(v) { return !g.node(v).isHidden && !util.isSubgraph(g, v); });
  var dir = g.graph().rankdir;
  var svgNodes = selection.selectAll("g.node")
    .data(simpleNodes, function(v) { return v; })
    .classed("update", true);

  svgNodes.selectAll("*").remove();

  svgNodes.enter()
    .append("g")
      .attr("class", "node")
      .attr("tabindex", "0")
      .style("opacity", 0);

  svgNodes = selection.selectAll("g.node"); 

  svgNodes.each(function(v) {
    var node = g.node(v),
        thisGroup = d3.select(this);
    util.applyClass(thisGroup, node["class"],
      (thisGroup.classed("update") ? "update " : "") + "node");
    var labelGroup = thisGroup.append("g").attr("class", "label"),
        labelDom = addLabel(labelGroup, node),
        shape = shapes[node.shape],
        bbox = _.pick(labelDom.node().getBBox(), "width", "height");

    node.elem = this;

    if (node.id) { thisGroup.attr("id", node.id); }
    if (node.labelId) { labelGroup.attr("id", node.labelId); }

    if (_.has(node, "width")) { bbox.width = node.width; }
    if (_.has(node, "height")) { bbox.height = node.height; }

    bbox.width += node.paddingLeft + node.paddingRight;
    bbox.height += node.paddingTop + node.paddingBottom;
    labelGroup.attr("transform", "translate(" +
      ((node.paddingLeft - node.paddingRight) / 2) + "," +
      ((node.paddingTop - node.paddingBottom) / 2) + ")");

    var shapeSvg = shape(d3.select(this), bbox, node, dir);
    util.applyStyle(shapeSvg, node.style);
    if (node.hoverStyle) {
      util.changeStyleOnHover(shapeSvg, node.style, node.hoverStyle, d3.select(this), "nodeShape");
    }

    var shapeBBox = shapeSvg.node().getBBox();
    node.width = shapeBBox.width;
    node.height = shapeBBox.height;

    var self = this;

    ["upperExpandButton", "lowerExpandButton"].forEach(function (prefix) {
      if (node[prefix + "Status"] !== "alwaysHidden") {
        var expandButton = util.drawExpandButton(thisGroup, node[prefix + "X"], node[prefix + "Y"], node.expandButtonRadius, node[prefix + "Collapsed"], node.expandButtonStyle, node.expandButtonHoverStyle, prefix === "upperExpandButton");
        if (node[prefix + "Status"] === "showOnHover") {
          util.applyStyle(expandButton, "display: none;");
          util.changeStyleOnHover(expandButton, "display: none;", "display: default; cursor: pointer;", d3.select(self), prefix);
        } else {
          util.applyStyle(expandButton, "cursor: pointer;");
        }
      }
    });

  });

  var exitSelection;

  if (svgNodes.exit) {
    exitSelection = svgNodes.exit();
  } else {
    exitSelection = svgNodes.selectAll(null); // empty selection
  }

  util.applyTransition(exitSelection, g)
    .style("opacity", 0)
    .remove();

  return svgNodes;
}
