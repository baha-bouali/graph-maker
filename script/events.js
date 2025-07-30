import {updateGraph} from "./update.js"

export function setupEvents(nodes, links, svg, simulation) {
  const nodeInput = document.getElementById("node-id");
  const addNodeBtn = document.getElementById("add-node");

  const sourceInput = document.getElementById("edge-source");
  const targetInput = document.getElementById("edge-target");
  const addEdgeBtn = document.getElementById("add-edge");

  addNodeBtn.addEventListener("click", () => {
    const id = +nodeInput.value;
    if (!nodes.some(n => n.id === id)) {
      nodes.push({ id });
      updateGraph(svg, simulation, nodes, links);
    }
  });

  addEdgeBtn.addEventListener("click", () => {
    const source = +sourceInput.value;
    const target = +targetInput.value;
    if (nodes.some(n => n.id === source) && nodes.some(n => n.id === target)) {
      links.push({ source, target });
      updateGraph(svg, simulation, nodes, links);
    }
  });
}
