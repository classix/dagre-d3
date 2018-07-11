var addTextLabel = require("./add-text-label"),
    addHtmlLabel = require("./add-html-label"),
    addSVGLabel  = require("./add-svg-label"),
    optionsMod = require("./../options"),
    util = require("./../util");

module.exports = addLabel;

function addLabel(root, node, location) {
  var label = node.label;
  var labelSvg = root.append("g");

  var applyStyleFnc = function () {
    
    var labelSelector = labelSvg.select(function () { return this.parentNode; });
    var parentOfLabel = labelSelector.select(function () { return this.parentNode; });
    util.applyStyle(labelSelector, node.labelStyle); 
    if (node.labelHoverStyle) {
      util.changeStyleOnHover(labelSelector, node.labelStyle, node.labelHoverStyle, parentOfLabel, "nodeLabel"); 
    }
  };

  // Allow the label to be a string, a function that returns a DOM element, or
  // a DOM element itself.
  if (node.labelType === "svg") {
    addSVGLabel(labelSvg, node);
  } else if (node.labelType === "texticon") {
    addTextLabel(labelSvg, node, applyStyleFnc, true);
  } else if (typeof label !== "string" || node.labelType === "html") {
    addHtmlLabel(labelSvg, node);
  } else {
    addTextLabel(labelSvg, node, applyStyleFnc);
  }

  var labelBBox = labelSvg.node().getBBox();
  var y;
  switch(location) {
    case "top":
      y = (-node.height / 2);
      break;
    case "bottom":
      y = (node.height / 2) - labelBBox.height;
      break;
    default:
      y = (-labelBBox.height / 2);
  }
  if (location !== "edge" || optionsMod.getOptions().horizontalLabels) {
    labelSvg.attr("transform", "translate(" + (-labelBBox.width / 2) + "," + y + ")");
  } else {
    labelSvg.attr("transform", "translate(0," + y + ")");
  }

  return labelSvg;
}
