import * as THREE from 'three';
import { RepeatWrapping, TextureLoader, Vector2 } from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import * as ThreeMeshUI from 'three-mesh-ui';
import { FontLibrary } from 'three-mesh-ui';
// import SnakeImage from './assets/spiny_bush_viper.jpg';
import SnakeImage from './assets/uv_grid.jpg';
import SmokeImage from './assets/smoke-tileable.png';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import BoundsUVBehavior from 'three-mesh-ui/examples/behaviors/geometries/BoundsUVBehavior';
import ExampleBoundsUVMaterial from 'three-mesh-ui/examples/materials/msdf/ExampleBoundsUVMaterial';
import * as FontWeight from '../src/utils/font/FontWeight';
import * as FontStyle from '../src/utils/font/FontStyle';
import ROBOTO_ADJUSTMENT from 'three-mesh-ui/examples/assets/fonts/msdf/roboto/adjustment';


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls, stats;
let outerContainer, boundingContainer;
let snakeTexture, smokeTexture;

window.addEventListener('load', preloadFonts );
window.addEventListener('resize', onWindowResize );


//
function preloadFonts() {

	FontLibrary.prepare(

		FontLibrary
			.addFontFamily("Roboto")
			.addVariant(FontWeight.NORMAL, FontStyle.NORMAL, "./assets/fonts/msdf/roboto/regular.json", "./assets/fonts/msdf/roboto/regular.png" )
			.addVariant(FontWeight.BOLD, FontStyle.ITALIC, "./assets/fonts/msdf/roboto/bold-italic.json", "./assets/fonts/msdf/roboto/bold-italic.png" )
			.addVariant(FontWeight.BOLD, FontStyle.NORMAL, "./assets/fonts/msdf/roboto/bold.json", "./assets/fonts/msdf/roboto/bold.png" )
			.addVariant(FontWeight.NORMAL, FontStyle.ITALIC, "./assets/fonts/msdf/roboto/italic.json", "./assets/fonts/msdf/roboto/italic.png" )

	).then( init );

}

function init() {

	// Adjusting font variants
	const FF = FontLibrary.getFontFamily("Roboto");

	// adjust fonts
	// @see TODO:adjustDocumentation
	FF.getVariant('700','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('700','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('400','italic').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );
	FF.getVariant('400','normal').adjustTypographicGlyphs( ROBOTO_ADJUSTMENT );


	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
	document.body.appendChild( renderer.domElement );

	stats = new Stats();
	document.body.appendChild( stats.dom );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );

	// TEXT PANEL

	makeTextPanel();

	//

	renderer.setAnimationLoop( loop );

}

//

function makeTextPanel() {

	// load images
	snakeTexture = new TextureLoader().load(SnakeImage);
	smokeTexture = new TextureLoader().load(SmokeImage, (t) => {
		t.wrapS = t.wrapT = RepeatWrapping;
		t.repeat = new Vector2( 3, 1 );
		t.isLoaded = true;
	});


	// create an orphan block
	boundingContainer = new ThreeMeshUI.Block({
		width: 0.75,
		height: 0.2,
		backgroundColor: new THREE.Color(0xff0000),
		backgroundOpacity: 0.25
	});
	scene.add( boundingContainer );
	boundingContainer.position.set( 0, 1, -2 );
	boundingContainer.rotation.x = -0.55;


	outerContainer = new ThreeMeshUI.Block({
		width: 3.2,
		height: 2.5,
		padding: 0.05,
		backgroundOpacity: 0,
		justifyContent: 'center',
		alignItems: 'center',
		contentDirection: 'column',
	});

	outerContainer.position.set( 0, 1, -1.8 );
	outerContainer.rotation.x = -0.55;
	scene.add( outerContainer );

	//
	const infoContainer = new ThreeMeshUI.Block({
		width: 1.5,
		height: 0.2,
		contentDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundSize: 'stretch',
		fontFamily: "Roboto",
		fontColor: new THREE.Color(0xffffff)
	});
	outerContainer.add( infoContainer );

	infoContainer.add( new ThreeMeshUI.Text({
		content:"BoundsUVBehavior obtains the UV from another geometry\n",
		fontWeight: '700',
	}),
		new ThreeMeshUI.Text({
			content:"This example uses a custom material to show the whole glyph box",
			fontWeight: '400',
			fontSize: 0.04
		}));

	const effectContainer = new ThreeMeshUI.Block({
		width:3,
		height: 1.15,
		contentDirection: 'row',
		backgroundOpacity: 0
	})
	outerContainer.add( effectContainer );

	effectContainer.add( buildEffectContainer('without BoundsUVBehavior', 'Texture is stretched on each glyph', null ) );
	effectContainer.add( buildEffectContainer('BoundsUVBehavior from itself', 'Texture is stretched from first to last glyph', "self" ) );
	effectContainer.add( buildEffectContainer('BoundsUVBehavior from object', 'Here UVs are computed from the red box behind', boundingContainer ) );


}

function buildEffectContainer( title, subtitle, bindedTo) {
	const effectContainer = new ThreeMeshUI.Block({
		height: 1.5,
		width: 1,
		fontFamily: "Roboto",
		backgroundOpacity: 0,
		fontSize: 0.25,
		justifyContent: "center",
	});
	outerContainer.add( effectContainer );

	const titleContainer = new ThreeMeshUI.Block({
		width: 0.9,
		height: 0.15,
		justifyContent: 'center',
		interLine: -0.01
	});
	effectContainer.add( titleContainer );

	titleContainer.add( new ThreeMeshUI.Text({
		content: title+"\n",
		fontWeight: '700',
		fontColor: new THREE.Color(0xffffff),
		fontSize: 0.055
	}),
		new ThreeMeshUI.Text({
			content: subtitle,
			fontWeight: '400',
			fontColor: new THREE.Color(0xffffff),
			fontSize: 0.035
		}));


	const defaultText = new ThreeMeshUI.Text({
		content:"map",
		fontColor: new THREE.Color(0xffffff)
	});
	defaultText.material = new ExampleBoundsUVMaterial({map:snakeTexture});

	let textBlock = new ThreeMeshUI.Block({width:0.75,height:0.3, backgroundOpacity:0});
	textBlock.add( defaultText );
	effectContainer.add( textBlock );

	const alphaText = new ThreeMeshUI.Text({
		content:"alpha",
		fontColor: new THREE.Color(0xFFFFFF)
	});
	alphaText.material = new ExampleBoundsUVMaterial({alphaMap:smokeTexture});
	textBlock = new ThreeMeshUI.Block({width:0.75,height:0.3, backgroundOpacity:0});
	textBlock.add( alphaText );
	effectContainer.add( textBlock );

	const bothText = new ThreeMeshUI.Text({
		content: "Both",
		fontColor: new THREE.Color(0xffffff)
	});
	bothText.material = new ExampleBoundsUVMaterial({
		map: snakeTexture,
		alphaMap:smokeTexture
	});
	textBlock = new ThreeMeshUI.Block({width:0.75,height:0.3, backgroundOpacity:0});
	textBlock.add( bothText );
	effectContainer.add( textBlock );

	if( bindedTo ){

		if( bindedTo === "self" ) {

			new BoundsUVBehavior( defaultText, defaultText ).attach();
			new BoundsUVBehavior( alphaText, alphaText ).attach();
			new BoundsUVBehavior( bothText, bothText ).attach();

		} else {

			new BoundsUVBehavior( bindedTo, [defaultText, alphaText, bothText] ).attach()

		}

	}

	return effectContainer;
}

// handles resizing the renderer when the viewport is resized

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}



//
let speed = 0.0025;
function loop() {

	// if( smokeTexture && smokeTexture.isLoaded ) {
	//
	// 	smokeTexture.offset.y += Math.abs(speed)/2;
	//
	// }

	let height = boundingContainer.height;
	height += speed;

	if( height >= 0.6 ) {
		height = 0.6;
		speed *= -1;
	}else if( height <= 0.15 ) {
		height = 0.15;
		speed *= -1;
	}
	boundingContainer.set({height});

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );
	stats.update()
}
