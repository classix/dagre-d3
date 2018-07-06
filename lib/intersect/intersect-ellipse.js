module.exports = intersectEllipse;

function intersectEllipse(node, rx, ry, point, dir) {
  

  var cx = node.x;
  var cy = node.y;

  var dx,dy;

  if (dir === "TB" || dir === "BT") {
    dx = 0;
    dy = (point.y < cy) ? -ry : ry;
  } else {
    dx = (point.x < cx) ? -rx : rx;
    dy = 0;
  }

  return {x: cx + dx, y: cy + dy};
}

