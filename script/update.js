import {drag} from "./drag.js";

export function updateGraph(svg, simulation, nodes, links) {
    // bind links 
    const link = svg.append("g")
        .attr("stroke", "#000000")
        .selectAll("line")
        .data(links)
        .join("line");
    
    const node = svg.append("g")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 20)
        .attr("fill", "#FFFFFF")
        .call(drag(simulation));//Enable dragging nodes

    const label = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.id)
        .attr("font-size", 14)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("pointer-events", "none") // Let clicks pass through text to circle
        .style("user-select", "none");

    
    // Restart simulation with new data
    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);

    function ticked() {
        svg.selectAll("line") 
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        svg.selectAll("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        svg.selectAll("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }
}
