import { BackSide, BufferAttribute, FrontSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

//JSDoc related imports
/* eslint-disable no-unused-vars */
import MeshUIBaseElement from '../core/elements/MeshUIBaseElement';
/* eslint-enable no-unused-vars */

let _hiddenMaterial;

/**
 * Returns a basic plane mesh.
 */
export default class Frame extends Mesh {

	/**
	 *
	 * @param {MeshUIBaseElement} element
	 */
	constructor( element) {

		const slice = element.slice;
		const slices = {};

		if( slice ) {
			const segments = 1;

			const w = slice.width ? slice.width : 1;
			const h = slice.height ? slice.height : 1;

			if ( slice.top ) {
				if ( slice.left ) {
					const topLeftGeometry = new PlaneGeometry( slice.left, slice.top, segments, segments );
					_sliceUV( topLeftGeometry, 0, slice.left, 1 - slice.top, 1 );
					topLeftGeometry.translate( slice.left / 2, -slice.top / 2, 0 );
					slices.topLeft = topLeftGeometry;
				}

				const topGeometry = new PlaneGeometry( 1, slice.top, segments, segments );
				_sliceUV( topGeometry, slice.left, 1 - slice.right, 1 - slice.top, 1 );
				topGeometry.translate( 0, -slice.top / 2, 0 );
				slices.top = topGeometry;

				if ( slice.right ) {
					const topRightGeometry = new PlaneGeometry( slice.right, slice.top, segments, segments );
					_sliceUV( topRightGeometry, 1 - slice.right, 1, 1 - slice.top, 1 );
					topRightGeometry.translate( -slice.left / 2, -slice.top / 2, 0 );
					slices.topRight = topRightGeometry;
				}

			}

			if ( slice.left ) {
				const leftGeometry = new PlaneGeometry( slice.left, 1, segments, segments )
				_sliceUV( leftGeometry, 0, slice.left, slice.bottom, 1 - slice.top );
				leftGeometry.translate( slice.left / 2, 0, 0 );
				slices.left = leftGeometry;
			}

			const center = new PlaneGeometry( 1, 1, segments, segments );
			_sliceUV( center, slice.left, 1 - slice.right, slice.bottom, 1 - slice.top );
			slices.middle = center;

			if ( slice.right ) {
				const rightGeometry = new PlaneGeometry( slice.right, 1, segments, segments );
				_sliceUV( rightGeometry, 1 - slice.right, 1, slice.bottom, 1 - slice.top );
				rightGeometry.translate( -slice.left / 2, 0, 0 );
				slices.right = rightGeometry;
			}

			if ( slice.bottom ) {

				if ( slice.left ) {
					const bottomLeftGeometry = new PlaneGeometry( slice.left, slice.bottom, segments, segments );
					_sliceUV( bottomLeftGeometry, 0, slice.left, 0, slice.bottom );
					bottomLeftGeometry.translate( slice.left / 2, slice.bottom / 2, 0 )
					slices.bottomLeft = bottomLeftGeometry;
				}

				const bottomGeometry = new PlaneGeometry( 1, slice.bottom, segments, segments );
				_sliceUV( bottomGeometry, slice.left, 1 - slice.right, 0, slice.bottom );
				bottomGeometry.translate( 0, slice.bottom / 2, 0 )
				slices.bottom = bottomGeometry;

				if ( slice.right ) {
					const bottomRightGeometry = new PlaneGeometry( slice.right, slice.bottom, segments, segments );
					_sliceUV( bottomRightGeometry, 1 - slice.right, 1, 0, slice.bottom );
					bottomRightGeometry.translate( -slice.right / 2, slice.bottom / 2, 0 )
					slices.bottomRight = bottomRightGeometry;
				}
			}
		}

		let material = element.backgroundMaterial;
		if( slice ){
			if( !_hiddenMaterial ) _hiddenMaterial = new MeshBasicMaterial({alphaTest:1.1});
			material = _hiddenMaterial;
		}


		const geometry = new PlaneGeometry( 1, 1, element._segments.value, element._segments.value );

		// Add additional uv for borders computations by copying initial uv
		const uvB = new BufferAttribute( new Float32Array( geometry.getAttribute('uv').array ), 2);
		geometry.setAttribute('uvB', uvB ).name = 'uvB';

		super( geometry, material );
		this.name = 'UIBackgroundBox';


		if( slice ) {
			this.sliceSize = new Vector3( 1 - ( slice.left + slice.right ), 1 - ( slice.bottom + slice.top ), 1 )

			// build slice meshes
			for ( const sliceSide in slices ) {

				const slice = new Mesh( slices[ sliceSide ], element.backgroundMaterial );
				this.add( slice );
				slices[ sliceSide ] = slice;

			}

			this.updateScale = this.updateScaleSlice;

			this.slices = slices;
		}

	}

	updateScale(){}

	updateScaleSlice(){

		for ( const sliceSide in this.slices ) {
			const slice = this.slices[sliceSide];

			// Invert size to have constant
			slice.scale.set( 1/this.scale.x, 1/this.scale.y, this.scale.y )
			// slice.scale.set( this.scale.x, 1/this.scale.y, this.scale.y )

			const offset = _slicePositions[sliceSide];
			for ( const offsetAxis in offset ) {
				slice.position[offsetAxis] = this.sliceSize[offsetAxis] * this.scale[offsetAxis] * offset[offsetAxis] * slice.scale[offsetAxis];
				slice.position[offsetAxis] = this.scale[offsetAxis] * offset[offsetAxis] * slice.scale[offsetAxis];
			}

			const scale = _sliceScales[sliceSide];
			if( scale ) {
				for ( const scaleAxis in scale ) {

					slice.scale[ scaleAxis ] = (this.scale[scaleAxis]-(1-this.sliceSize[scaleAxis]))/this.scale[scaleAxis];

				}
			}
		}
	}
}

const _slicePositions = {
	topLeft: {x:-0.5,y:0.5},
	top: {y:0.5},
	topRight: {x:0.5,y:0.5},
	left: {x:-0.5},
	right: {x:0.5},
	bottomLeft: {x:-0.5,y:-0.5},
	bottom: {y:-0.5},
	bottomRight : {x:0.5,y:-0.5}
}
const _sliceScales = {
	top: {x:1},
	left: {y:1},
	right: {y:1},
	bottom: {x:1},
	middle:{x:1,y:1}
}

function _sliceUV( geometry, uMin, uMax, vMin, vMax ){

	const uLength = uMax-uMin;
	const vLength = vMax-vMin;

	const uvAttribute = geometry.attributes.uv;

	for ( let i = 0; i < uvAttribute.count; i ++ ) {

		const u = uvAttribute.getX( i );
		const v = uvAttribute.getY( i );

		uvAttribute.setXY( i, uMin + u*uLength, vMin + v*vLength );

	}

	// Add additional uv for borders computations by copying initial uv
	const uvB = new BufferAttribute( new Float32Array( geometry.getAttribute('uv').array ), 2);
	geometry.setAttribute('uvB', uvB ).name = 'uvB';

}
