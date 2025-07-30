export function drag(simulation){
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
