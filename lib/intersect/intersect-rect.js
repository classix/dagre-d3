module.exports = intersectRect;

function intersectRect(node, point, dir) {

  var x = node.x;
  var y = node.y;

  // Rectangle intersection algorithm from:
  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
  var dx = point.x - x;
  var dy = point.y - y;
  var w = node.width / 2;
  var h = node.height / 2;

  var sx, sy;
  if (dir === "TB" || dir === "BT") {
    if (dy < 0) {
      h = -h;
    }
    sx = 0;
    sy = h;

  } else {
    
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = 0;

  }

  return {x: x + sx, y: y + sy};
}
