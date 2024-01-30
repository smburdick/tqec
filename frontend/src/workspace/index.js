import axios from 'axios';
import { useApp } from '@pixi/react';
import { Container } from 'pixi.js';
import { AdjustmentFilter } from 'pixi-filters';
import { makeGrid } from './grid';
import Qubit from './QubitClass';
import Template from './TemplateClass';
import { button } from './components/button';

// TODO: move this to a config file
const prodBackendURL = 'https://tqec-app-mvp.uc.r.appspot.com';

const testingBackendURL = {
	// Default values from Flask
	ip: '127.0.0.1',
	port: '5000',
};

export default function TQECApp() {
	// Initialize the app
	let app = useApp();
	// Remove all children from the stage to avoid rendering issues
	app.stage.removeChildren();
	const gridSize = 50;
	// Let's create the workspace
	const workspace = new Container();
	workspace.name = 'workspace';
	// Create the grid container
	const grid = makeGrid(app, gridSize);

	workspace.addChild(grid);
	workspace.selectedPlaquette = null; // Used to update filters

	workspace.updateSelectedPlaquette = (newPlaquette) => {
		if (newPlaquette === null) {
			return;
		}
		const currentPlaquette = workspace.selectedPlaquette;
		if (currentPlaquette === newPlaquette) {
			currentPlaquette.filters = null;
			workspace.removeChild(workspace.getChildByName('control_panel'));
			workspace.selectedPlaquette = null;
		} else {
			if (currentPlaquette != null) {
				currentPlaquette.filters = null;
			}
			newPlaquette.filters = [new AdjustmentFilter({ contrast: 0.5 })];
			workspace.removeChild('control_panel');
			workspace.addChild(newPlaquette.controlPanel);
			workspace.selectedPlaquette = newPlaquette;
		}
	};

	workspace.removePlaquette = (plaquette) => {
		if (plaquette === null) {
			return;
		}
		if (workspace.selectedPlaquette === plaquette) {
			workspace.selectedPlaquette = null;
		}
		// Remove control panel if it is visible
		const currentControlPanel = workspace.getChildByName('control_panel');
		if (currentControlPanel === plaquette.controlPanel) {
			workspace.removeChild(currentControlPanel);
		}
		workspace.removeChild(plaquette);
		plaquette.destroy({ children: true });
	};

	// Add the qubits to the workspace
	for (let x = 0; x <= app.renderer.width; x += gridSize) {
		for (let y = 0; y <= app.renderer.height; y += gridSize) {
			// Skip every other qubit
			if (x % (gridSize * 2) === 0 && y % (gridSize * 2) === 0) continue;
			if (x % (gridSize * 2) === gridSize && y % (gridSize * 2) === gridSize)
				continue;
			// Create a qubit
			const qubit = new Qubit(x, y, 5, gridSize);
			// Name the qubit according to its position
			qubit.name = `${x}_${y}`;
			workspace.addChild(qubit);
		}
	}
	// Give the qubit its neighbors
	for (const q in workspace.children) {
		if (workspace.children[q].isQubit === true) {
			workspace.children[q].setNeighbors();
		}
	}

	let selectedQubits = [];
	const plaquetteButton = button('Create plaquette', 100, 120);
	const template = new Template(
		selectedQubits,
		workspace,
		plaquetteButton,
		app
	);

	plaquetteButton.on('click', (_e) => {
		// Create the plaquettes and tile
		template.createPlaquette();
		workspace.addChild(template.container);
		// Clear the selected qubits
		selectedQubits = [];
	});
	plaquetteButton.visible = false;

	// workspace.addChild(plaquetteButton);
	workspace.addChild(template.container);

	// Add download stim button
	const downloadStimButton = button(
		'Download Stim file',
		100,
		50,
		'white',
		'black'
	);
	const localTesting = !window.location.href.includes('https://'); // FIXME: this is a hack
	const stimURL = `${
		localTesting
			? `http://${testingBackendURL.ip}:${testingBackendURL.port}`
			: prodBackendURL
	}/stim`;

	downloadStimButton.on('click', async (_e) => {
		const res = await axios({
			url: stimURL,
			method: 'GET',
			responseType: 'blob',
		});
		// create file link in browser's memory
		const href = URL.createObjectURL(res.data);
		// create "a" HTML element with href to file & click
		const link = document.createElement('a');
		link.href = href;
		link.setAttribute('download', 'circuit.stim'); //or any other extension
		document.body.appendChild(link);
		link.click();
		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	});

	workspace.addChild(downloadStimButton);
	workspace.visible = true;
	// app.stage.addChild(plaquetteButton);
	app.stage.addChild(workspace);

	return;
}