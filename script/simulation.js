const svg = d3.select("#graph");
const width = +svg.attr("width");
const height = +svg.attr("height");


export function createSimulation(svg) {
    const nodes = [];
    const links = [];

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(100)
        .strength(0.8)
    )
    .force("charge", d3.forceManyBody()
        .strength(-500) // stronger repulsion
        .distanceMin(50) // min distance before repulsion
        .distanceMax(400) // Maximum distance for repulsion
    )
    // .force("center", d3.forceCenter(width / 2, height/2)); // we don't them to be always centered
    .force("collision", d3.forceCollide()
        .radius(25) // Node collision radius
        .strength(0.7)
    )
    .force("boundary", () => {
        nodes.forEach(node => {
            const padding = 25;
            const x = node.x;
            const y = node.y;

            // repel from left/right edges
            if (x < padding) node.vx += (padding - x) * 0.1 * 3;
            if (x > width - padding) node.vx += (width - padding - x) * 0.1 * 3;

            // repel from top/bottom edges
            if (y < padding) node.vy += (padding - y) * 0.1 * 3;
            if (y > height - padding) node.vy += (height - padding - y) * 0.1 * 3;

        });
    })
    .alphaDecay(0.01) // slower cooling for simulation
    .velocityDecay(0.4); // More fluid Movement


    return { nodes, links, simulation };
}