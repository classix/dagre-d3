"use strict";

var intersectRect = require("./intersect/intersect-rect"),
    intersectEllipse = require("./intersect/intersect-ellipse"),
    intersectCircle = require("./intersect/intersect-circle"),
    intersectDiamond = require("./intersect/intersect-diamond");

module.exports = {
  rect: rect,
  ellipse: ellipse,
  circle: circle,
  diamond: diamond
};

function rect(parent, bbox, node, dir) {
  var shapeSvg = parent.insert("rect", ":first-child")
        .attr("rx", node.rx)
        .attr("ry", node.ry)
        .attr("x", -bbox.width / 2)
        .attr("y", -bbox.height / 2)
        .attr("width", bbox.width)
        .attr("height", bbox.height);

  switch (dir) {
    case "LR":
      node.expandButtonX = bbox.width / 2;
      node.expandButtonY = 0;
      break;
    case "RL":
      node.expandButtonX = -bbox.width / 2;
      node.expandButtonY = 0;
      break;
    case "TB":
      node.expandButtonX = 0;
      node.expandButtonY = bbox.height / 2;
      break;
    case "BT":
      node.expandButtonX = 0;
      node.expandButtonY = -bbox.height / 2;
      break;
  }

  node.intersect = function(point, dir) {
    return intersectRect(node, point, dir);
  };

  return shapeSvg;
}

function ellipse(parent, bbox, node, dir) {
  var rx = bbox.width / 2,
      ry = bbox.height / 2,
      shapeSvg = parent.insert("ellipse", ":first-child")
        .attr("x", -bbox.width / 2)
        .attr("y", -bbox.height / 2)
        .attr("rx", rx)
        .attr("ry", ry);

  switch (dir) {
    case "LR":
      node.expandButtonX = rx;
      node.expandButtonY = 0;
      break;
    case "RL":
      node.expandButtonX = -rx;
      node.expandButtonY = 0;
      break;
    case "TB":
      node.expandButtonX = 0;
      node.expandButtonY = ry;
      break;
    case "BT":
      node.expandButtonX = 0;
      node.expandButtonY = -ry;
      break;
  }

  node.intersect = function(point, dir) {
    return intersectEllipse(node, rx, ry, point, dir);
  };

  return shapeSvg;
}

function circle(parent, bbox, node, dir) {
  var r = Math.max(bbox.width, bbox.height) / 2,
      shapeSvg = parent.insert("circle", ":first-child")
        .attr("x", -bbox.width / 2)
        .attr("y", -bbox.height / 2)
        .attr("r", r);

  switch (dir) {
    case "LR":
      node.expandButtonX = r;
      node.expandButtonY = 0;
      break;
    case "RL":
      node.expandButtonX = -r;
      node.expandButtonY = 0;
      break;
    case "TB":
      node.expandButtonX = 0;
      node.expandButtonY = r;
      break;
    case "BT":
      node.expandButtonX = 0;
      node.expandButtonY = -r;
      break;
  }

  node.intersect = function(point, dir) {
    return intersectCircle(node, r, point, dir);
  };

  return shapeSvg;
}

// Circumscribe an ellipse for the bounding box with a diamond shape. I derived
// the function to calculate the diamond shape from:
// http://mathforum.org/kb/message.jspa?messageID=3750236
function diamond(parent, bbox, node, dir) {
  var w = (bbox.width * Math.SQRT2) / 2,
      h = (bbox.height * Math.SQRT2) / 2,
      points = [
        { x:  0, y: -h },
        { x: -w, y:  0 },
        { x:  0, y:  h },
        { x:  w, y:  0 }
      ],
      shapeSvg = parent.insert("polygon", ":first-child")
        .attr("points", points.map(function(p) { return p.x + "," + p.y; }).join(" "));

  switch (dir) {
    case "LR":
      node.expandButtonX = w;
      node.expandButtonY = 0;
      break;
    case "RL":
      node.expandButtonX = -w;
      node.expandButtonY = 0;
      break;
    case "TB":
      node.expandButtonX = 0;
      node.expandButtonY = h;
      break;
    case "BT":
      node.expandButtonX = 0;
      node.expandButtonY = -h;
      break;
  }

  node.intersect = function(p, dir) {
    return intersectDiamond(node, points, p, dir);
  };

  return shapeSvg;
}
