module.exports = intersectDiamond;

function intersectDiamond(node, polyPoints, point, dir) {

  var cx = node.x;
  var cy = node.y;

  var p;

  if (dir === "TB" || dir === "BT") {

    if (point.y < cy) {
      p = polyPoints[0];
    } else {
      p = polyPoints[2];
    }

  } else {
    
    if (point.x < cx) {
      p = polyPoints[1];
    } else {
      p = polyPoints[3];
    }

  }

  return {x: cx + p.x, y: cy + p.y};

}
