let nodes = []
let links = []

function addNode(){
    const id = parseInt(document.getElementById("node-id").value);
    if (!nodes.find(n => n.id == id)){
        nodes.push({id});
        alert(`Node ${id} is added`);
    }else{
        alert(`Node ${id} already exists`);
    }
    document.getElementById("node-id").value = ""; // clears box
}

function addEdge(){
    
    const source = parseInt(document.getElementById("edge-source").value);
    const target = parseInt(document.getElementById("edge-target").value);
    
    if (!nodes.find(n => n.id == source) || !nodes.find(n => n.id == target)){
        alert("Both source and target must exist"); 
        return;
    }
    links.push({source, target});
    alert(`Edge ${source} -> ${target} is added successfully`);

    document.getElementById("edge-source").value = "";
    document.getElementById("edge-target").value = "";
}

// Reder the Graph
function drawGraph (){
    const svg = d3.select("svg");
    svg.selectAll("*").remove(); // remove old drawing

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(150).id(d => d.id)) // Add a link force.
        .force("charge", d3.forceManyBody().strength(-300)) // Repulsion force between nodes (how much nodes push each other)
        .force("center", d3.forceCenter(width/2, height/2)); // Centers the whole graph in the SVG.
    
    const link = svg.append("g")
        .attr("stroke", "#ff000")
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

    
    simulation.on("tick", ()=>{ // listen to "tick" event from the force simulation. It happens until equilibrium is reached and all nodes stopped moving
        link // sets the start (x1, y1) and end positions of the line using the current position of the source & target
            .attr("x1", d => d.source.x) 
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node // Each node is a circle and its center is updated
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label 
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    function drag(simulation){
        function dragstarted(event, d){
            if (!event.active) // If no other drag is happening
                simulation.alphaTarget(0.3).restart(); // set energy level.
            d.fx = d.x; //locks the node's position to the current one, preventing it from moving freely.
            d.fy = d.y;
        }

        function dragged(event, d){ // called while dragging 
            d.fx = event.x; // continuously update node's position to follow the mouse.
            d.fy = event.y;
        }

        function dragended(event, d){
            if (!event.active) // if no other dragging is happening
                simulation.alphaTarget(0); // cools down the simulation 
            d.fx = null; // Releases the node
            d.fy = null; // allow it to move freely again under the simulation force.
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }

}