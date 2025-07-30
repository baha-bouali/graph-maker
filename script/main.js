import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800;
const height = 500;
const mindistance = 30;

const nodes = [];
const links = [];
let mouse = null;

const svg = d3.select("svg")
.attr("viewBox", [-width / 2, -height / 2, width, height])
.on("mouseleave", mouseleft)
.on("mousemove", mousemoved)
.on("click", clicked);

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
    .attr("cy", d => d.y);

link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

mouselink = mouselink
    .data(mouse ? nodes.filter(n => inrange(mouse, n)) : [])
    .join("line")
    .attr("x1", mouse && mouse.x)
    .attr("y1", mouse && mouse.y)
    .attr("x2", d => d.x)
    .attr("y2", d => d.y);

cursor
    .attr("display", mouse ? null : "none")
    .attr("cx", mouse && mouse.x)
    .attr("cy", mouse && mouse.y);
}

function mouseleft() {
mouse = null;
}

function mousemoved(event) {
const [x, y] = d3.pointer(event);
mouse = {x, y};
simulation.alpha(0.3).restart();
}

function clicked(event) {
mousemoved.call(this, event);
spawn({ x: mouse.x, y: mouse.y });
}

function spawn(source) {
nodes.push(source);

for (const target of nodes) {
    if (target !== source && inrange(source, target)) {
    links.push({ source, target });
    }
}

link = link
    .data(links)
    .join("line");

node = node
    .data(nodes)
    .join(
    enter => enter.append("circle")
        .attr("r", 0)
        .attr("fill", "#3498db")
        .call(enter => enter.transition().attr("r", 5))
        .call(dragger),
    update => update,
    exit => exit.remove()
    );

simulation.nodes(nodes);
simulation.force("link").links(links);
simulation.alpha(1).restart();
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

// Optional: start with 1 node
spawn({ x: 0, y: 0 });