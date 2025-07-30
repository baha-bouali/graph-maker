const svg = d3.select("#graph");
const width = +svg.attr("width");
const height = +svg.attr("height");


export function createSimulation(svg) {
    const nodes = [];
    const links = [];

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height/2));

    return { nodes, links, simulation };
}