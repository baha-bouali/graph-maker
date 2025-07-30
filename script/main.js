// main.js
import { createSimulation } from './simulation.js';
import { setupEvents } from './events.js';
import { updateGraph } from './update.js';

const svg = d3.select('svg');
const { nodes, links, simulation } = createSimulation(svg);
setupEvents(nodes, links, svg, simulation);