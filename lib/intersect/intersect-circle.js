var intersectEllipse = require("./intersect-ellipse");

module.exports = intersectCircle;

function intersectCircle(node, rx, point, dir) {
  return intersectEllipse(node, rx, rx, point, dir);
}
