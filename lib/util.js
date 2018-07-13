var _ = require("./lodash");

// Public utility functions
module.exports = {
  isSubgraph: isSubgraph,
  edgeToId: edgeToId,
  applyStyle: applyStyle,
  applyClass: applyClass,
  applyTransition: applyTransition,
  changeStyleOnHover: changeStyleOnHover,
  drawExpandButton: drawExpandButton
};

/*
 * Returns true if the specified node in the graph is a subgraph node. A
 * subgraph node is one that contains other nodes.
 */
function isSubgraph(g, v) {
  return !!g.children(v).length;
}

function edgeToId(e) {
  return escapeId(e.v) + ":" + escapeId(e.w) + ":" + escapeId(e.name);
}

var ID_DELIM = /:/g;
function escapeId(str) {
  return str ? String(str).replace(ID_DELIM, "\\:") : "";
}

function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr("style", styleFn);
  }
}

function changeStyleOnHover(dom, normalStyle, hoverStyle, hoverElm, suffix) {
    hoverElm.on("mouseover" + "." + suffix, function() {
      dom.attr("style", hoverStyle);
    })                  
    .on("mouseout" + "." + suffix, function() {
      dom.attr("style", normalStyle);
    });
}

function applyClass(dom, classFn, otherClasses) {
  if (classFn) {
    dom
      .attr("class", classFn)
      .attr("class", otherClasses + " " + dom.attr("class"));
  }
}

function applyTransition(selection, g) {
  var graph = g.graph();

  if (_.isPlainObject(graph)) {
    var transition = graph.transition;
    if (_.isFunction(transition)) {
      return transition(selection);
    }
  }

  return selection;
}

function drawExpandButton (parent, x, y, radius, plus, normalStyle, hoverStyle, upper) {
  var g = parent.insert("g").classed(upper ? "upperExpandButton" : "lowerExpandButton", true).attr("transform", "translate(" + x + "," + y +")");

  var g2 = g.insert("g").attr("style", normalStyle);

  g2.insert("circle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("r", radius);

  g2.insert("line").attr("x1", - (radius - 2)).attr("y1", 0).attr("x2", (radius - 2)).attr("y2", 0);
  
  if (plus) {
    g2.insert("line").attr("x1", 0).attr("y1", - (radius - 2)).attr("x2", 0).attr("y2", (radius - 2));
  }

  applyStyle(g2, normalStyle);
  changeStyleOnHover(g2, normalStyle, hoverStyle, g2);

  return g;
}
