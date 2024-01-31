import { useApp } from '@pixi/react'
import { makeGrid } from './grid'
import { Container } from 'pixi.js'
import Qubit from './qubit'
import { button } from './button'

// 

export default function TqecApp() {
	// Initialize the app
	let app = useApp();

	// Remove all children from the stage to avoid rendering issues
	app.stage.removeChildren();
	const gridSize = 50;
	const qubitRadius = 7;

	// Create the workspace
	const workspace = new Container();
	workspace.name = 'workspace';

	// Create the grid container
	const grid = makeGrid(app, gridSize);
    workspace.addChild(grid);

	// Add the qubits to the workspace
	for (let x = 0; x <= app.renderer.width/gridSize; x += 1) {
		for (let y = 0; y <= app.renderer.height/gridSize; y += 1) {
			// Skip every other qubit
            if ( (x+y) % 2 === 1 )
                continue;
			// Create a qubit
			const qubit = new Qubit(x*gridSize, y*gridSize, qubitRadius);
			// Name the qubit according to its position
			qubit.name = `${x}_${y}`;
			qubit.interactive = true;
			qubit.on('click', qubit.select)
			workspace.addChild(qubit);
		}
	}

    // Select the qubits that are part of a plaquette 
    let selectedQubits = [];
	const createPlaquetteButton = button('Create plaquette', 2*gridSize, 1*gridSize, 'white', 'black');
	workspace.addChild(createPlaquetteButton);

    createPlaquetteButton.on('click', (_e) => {
		// Loop on all qubits in the workspace and gather the selected ones
		workspace.children.forEach(child => {
			if (child instanceof Qubit) {
				if (child.role != 'none') {
					selectedQubits.push(child);
				}
			}
		})
		//template.createPlaquette();
		//workspace.addChild(template.container);
		// Clear the selected qubits
		const printQubitsButton = button('Print plaquette qubits', 2*gridSize, 2*gridSize, 'white', 'black');
		workspace.addChild(printQubitsButton);
	});

    //  Add workspace to the stage
    workspace.visible = true;
	app.stage.addChild(workspace);

    return;
}
