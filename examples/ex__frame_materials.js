import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';

function example() {

	// make a Block to hold many Blocks
	const container = new ThreeMeshUI.Block({
		width: 3.2,
		height: 3.2,
		backgroundOpacity: 0,
		interLine:-0.05,
		contentDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		fontFamily: RobotoFontFamily,
		fontWeight: ThreeMeshUI.FontWeight.BOLD,
		fontSize: 0.25,
	});

	container.position.set( 0, 1.25, -0.8 );
	container.rotation.x = -0.55;
	scene.add( container );

	// Now, let's build different blocks, and set their material

	const fillDefault = new ThreeMeshUI.Block(FILL_BLOCK);
	const borderDefault = new ThreeMeshUI.Block(BORDER_BLOCK);
	const fullDefault = new ThreeMeshUI.Block(FULL_BLOCK);
	const defaults = new ThreeMeshUI.Block(COLUMN).add( fillDefault, borderDefault, fullDefault );

	const fillStandard = new ThreeMeshUI.Block(FILL_BLOCK);
	fillStandard.material = new FrameStandardMaterial({});
	const borderStandard = new ThreeMeshUI.Block(BORDER_BLOCK);
	borderStandard.material = new FrameStandardMaterial({});
	const fullStandard = new ThreeMeshUI.Block(FULL_BLOCK);
	fullStandard.material = new FrameStandardMaterial({});
	const standards = new ThreeMeshUI.Block(COLUMN).add( fillStandard, borderStandard, fullStandard );

	const fillPhysical = new ThreeMeshUI.Block({...FILL_BLOCK, ...PHYSICAL_OVERRIDE} );
	fillPhysical.material = new FramePhysicalMaterial(PHYSICAL_MATERIAL_OPTIONS);
	const borderPhysical = new ThreeMeshUI.Block({...BORDER_BLOCK, ...PHYSICAL_OVERRIDE});
	borderPhysical.material = new FramePhysicalMaterial(PHYSICAL_MATERIAL_OPTIONS);
	const fullPhysical = new ThreeMeshUI.Block({...FULL_BLOCK, ...PHYSICAL_OVERRIDE});
	fullPhysical.material = new FramePhysicalMaterial(PHYSICAL_MATERIAL_OPTIONS);
	const physicals = new ThreeMeshUI.Block(COLUMN).add( fillPhysical, borderPhysical, fullPhysical );


	// place all created texts in the container
	container.add( defaults, standards, physicals );

}



// Settings for blocks and materials, in order to not duplicate too much
const BACKGROUND_COLOR = new THREE.Color( 0xff9900 );
const BORDER_COLOR = new THREE.Color( 0xff9900 );
const WHITE_COLOR = new THREE.Color( 0xffffff );

const COLUMN = { width:0.45, height: 0.45, margin: 0.02, contentDirection: 'column', justifyContent: "center", backgroundOpacity: 0 };
const FILL_BLOCK = { width: 0.45, height: 0.45, margin:0.02, borderRadius:0.05,backgroundColor:BACKGROUND_COLOR, borderColor: BORDER_COLOR };
const BORDER_BLOCK = { ...FILL_BLOCK, backgroundOpacity:0, borderWidth:0.05 };
const FULL_BLOCK = { ...FILL_BLOCK, borderWidth: 0.05 };
const PHYSICAL_MATERIAL_OPTIONS = {
	color: 0xffffff,
	transmission: 1,
	opacity: 1,
	roughness: 0,
	ior: 2,
	thickness: 0.1,
	specularIntensity: 1,
	envMapIntensity: 1};
const PHYSICAL_OVERRIDE = {borderColor: WHITE_COLOR, backgroundColor: WHITE_COLOR };































/***********************************************************************************************************************
 * Above this comment, you could find the contextual setup of this example.
 * Not really related to the example itself : Creating three renderer, scene, lights, etc...
 **********************************************************************************************************************/

import { exampleAddUpdate, exampleThreeSetup } from 'three-mesh-ui/examples/_setup/ThreeSetup';
import { exampleThreePointLight, rollPointLightUpdate } from 'three-mesh-ui/examples/_setup/ThreePointLight';
import { exampleThreeCube, rollCubeUpdate } from 'three-mesh-ui/examples/_setup/ThreeCube';
import { exampleFontPreloadAll } from 'three-mesh-ui/examples/_setup/RobotoFont';
import FrameStandardMaterial from 'three-mesh-ui/examples/frame-materials/FrameStandardMaterial';
import FramePhysicalMaterial from 'three-mesh-ui/examples/frame-materials/FramePhysicalMaterial';

/* eslint-disable no-unused-vars */

// building three setup
const { scene, camera, renderer, controls, stats } = exampleThreeSetup();

// building pointLight
const {pointLightContainer, pointLight, pointLightHelper} = exampleThreePointLight(scene);
// register an update for pointLight
exampleAddUpdate( rollPointLightUpdate );

// building a cube
const cube = exampleThreeCube( scene );
// register and update for cube
exampleAddUpdate( rollCubeUpdate );

// preload fonts and run example() after
const RobotoFontFamily = exampleFontPreloadAll( example );

