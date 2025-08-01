import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800;
const height = 500;
const mindistance = 30;

const nodes = [];
const links = [];
let mouse = null;
let buildMode = false;
let connectMode = false;
let selectedNode = null;

const buildBtn = document.getElementById("toggle-build");
const connectBtn = document.getElementById("toggle-connect");

const svg = d3.select("svg")
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .on("mouseleave", mouseleft)
  .on("mousemove", mousemoved)
  .on("click", function (event) {
    if (buildMode) {
      buildClick(event);
    } else if (connectMode) {
      connectClick(event);
    }
  });

buildBtn.addEventListener("click", () => {
  buildMode = !buildMode;
  connectMode = false;
  selectedNode = null;
  buildBtn.textContent = buildMode ? "Build Mode: ON" : "Build Mode: OFF";
  buildBtn.classList.toggle("bg-green-600", buildMode);
  buildBtn.classList.toggle("bg-red-500", !buildMode);
  connectBtn.classList.remove("bg-blue-600");
  connectBtn.classList.add("bg-gray-500");
  svg.style("cursor", buildMode ? "crosshair" : "default");
});

connectBtn.addEventListener("click", () => {
  connectMode = !connectMode;
  buildMode = false;
  selectedNode = null;
  connectBtn.classList.toggle("bg-blue-600", connectMode);
  connectBtn.classList.toggle("bg-gray-500", !connectMode);
  buildBtn.classList.remove("bg-green-600");
  buildBtn.classList.add("bg-red-500");
  buildBtn.textContent = "Build Mode: OFF";
  svg.style("cursor", "default");
});

const simulation = d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-60))
  .force("link", d3.forceLink(links).distance(40))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on("tick", ticked);

const dragger = drag(simulation)
  .on("start.mouse", mouseleft)
  .on("end.mouse", mousemoved);

let link = svg.append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line");

let mouselink = svg.append("g")
  .attr("stroke", "red")
  .selectAll("line");

let node = svg.append("g")
  .selectAll("circle");

const cursor = svg.append("circle")
  .attr("display", "none")
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("r", mindistance - 5);

function ticked() {
  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("stroke", d => d === selectedNode ? "orange" : null)
    .attr("stroke-width", d => d === selectedNode ? 3 : 1);

  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  mouselink = mouselink
    .data(mouse && buildMode ? nodes.filter(n => inrange(mouse, n)) : [])
    .join("line")
    .attr("x1", mouse && mouse.x)
    .attr("y1", mouse && mouse.y)
    .attr("x2", d => d.x)
    .attr("y2", d => d.y);

  cursor
    .attr("display", mouse && buildMode ? null : "none")
    .attr("cx", mouse && mouse.x)
    .attr("cy", mouse && mouse.y);
}

function mouseleft() {
  mouse = null;
}

function mousemoved(event) {
  const [x, y] = d3.pointer(event);
  mouse = { x, y };
  simulation.alpha(0.3).restart();
}

function buildClick(event) {
  mousemoved.call(this, event);
  const newNode = { id: nodes.length, x: mouse.x, y: mouse.y };
  nodes.push(newNode);

  for (const target of nodes) {
    if (target !== newNode && inrange(newNode, target)) {
      links.push({ source: newNode, target });
    }
  }

  restart();
}

function connectClick(event) {
  const [x, y] = d3.pointer(event);
  const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 10);

  if (!clickedNode) {
    selectedNode = null;
    restart();
    return;
  }

  if (!selectedNode) {
    selectedNode = clickedNode;
  } else if (selectedNode !== clickedNode) {
    links.push({ source: selectedNode, target: clickedNode });
    selectedNode = null;
  }

  restart();
}

function inrange(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) <= mindistance;
}

function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function restart() {
  link = link
    .data(links)
    .join("line");

  node = node
    .data(nodes)
    .join(
      enter => enter.append("circle")
        .attr("r", 5)
        .attr("fill", "#3498db")
        .call(dragger),
      update => update,
      exit => exit.remove()
    );

  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

// Optional: start with 1 node
buildClick({ clientX: width / 2, clientY: height / 2 });
