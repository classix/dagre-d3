
module.exports = addTextLabel;

/*
 * Attaches a text label to the specified root. Handles escape sequences.
 */
function addTextLabel(root, node, applyStyleFnc, drawIcon) {

  if (drawIcon) {
    root = root.append("g");
  }

  var textNode = root.append("text");

  var iconWidth = node.iconWidth || 16;
  var iconHeight = node.iconHeight || 16;

  var lines = processEscapeSequences(node.label).split("\n");
  for (var i = 0; i < lines.length; i++) {
    textNode
      .append("tspan")
        .attr("xml:space", "preserve")
        .attr("dy", "1em")
        .attr("x", drawIcon ? (iconWidth + 6) : 1)
        .text(lines[i]);
  }

  applyStyleFnc(); // apply style before calling getBBox() to get the dimensions after apply style

  var dims = textNode.node().getBBox();

  if (drawIcon) {
    root.append("svg:image").attr("x", "0").attr("y", dims.y + (dims.height - iconHeight) / 2)
          .attr("width", iconWidth).attr("height", iconHeight)
          .attr("xlink:href", node.icon);
  }

  return drawIcon ? root : textNode;
}

function processEscapeSequences(text) {
  var newText = "",
      escaped = false,
      ch;
  for (var i = 0; i < text.length; ++i) {
    ch = text[i];
    if (escaped) {
      switch(ch) {
        case "n": newText += "\n"; break;
        default: newText += ch;
      }
      escaped = false;
    } else if (ch === "\\") {
      escaped = true;
    } else {
      newText += ch;
    }
  }
  return newText;
}
