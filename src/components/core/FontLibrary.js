import FontFamily from '../../font/FontFamily';

const _fontFamilies = {};

/* eslint-disable no-unused-vars */

/**
 *
 * @param {FontFamily} fontFamily
 * @returns {Promise<unknown>}
 */
function load( fontFamily ) {

	/**
	 *
	 * @type {FontFamily[]}
	 */
	const families = [ ...arguments ];

	// Check all family are right instance
	families.forEach( f => {

		if( !(f instanceof FontFamily) ) {

			throw new Error(`FontLibrary::load() - One of the provided parameter is not a FontFamily. Instead ${typeof f} given.`);

		}

	})

	/**
	 * Check that all provided families are loaded
	 * @returns {boolean}
	 */
	const areAllLoaded = function() {

		return families.every( f => f.isReady );

	}

	// @TODO: Should handle possible rejection
	return new Promise((resolve,reject)=>{

		// Direct resolve if all loaded
		if ( areAllLoaded() ){

			resolve();

		} else {

			// Add listener on each family not ready
			for ( let i = 0; i < families.length; i++ ) {

				const family = families[ i ];
				if( !family.isReady ){

					family.addEventListener( "ready" , ()=> {

						// Resolve if all other families are loaded
						if( areAllLoaded() ) {

							resolve();

						}

					});

				}

			}

		}

	});

}

/* eslint-enable no-unused-vars */


/**
 *
 * @param name
 * @returns {FontFamily}
 */
function addFontFamily( name ) {

	if ( _fontFamilies[ name ] ) {
		console.error( `FontLibrary::addFontFamily - Font('${name}') is already registered` );
	}

	_fontFamilies[ name ] = new FontFamily( name );

	return _fontFamilies[ name ];

}

/**
 *
 * @param name
 * @returns {FontFamily}
 */
function getFontFamily( name ) {

	return _fontFamilies[ name ];

}


/**
 *
 * @param handler
 */
function setMissingCharacterHandler( handler ) {

	_missingCharacterHandler = handler;

}

//

const FontLibrary = {
	addFontFamily,
	getFontFamily,
	load,
	setMissingCharacterHandler,
	missingCharacter
};

export default FontLibrary;

/**
 *
 * @param {FontVariant} fontVariant
 * @param {string} character
 * @returns {string}
 * @private
 */
let _missingCharacterHandler = function ( fontVariant, character ) {

	console.error( `The character '${character}' is not included in the font characters set.` );

	// return a glyph has fallback
	return " ";

};

/**
 *
 * @param {FontVariant} fontVariant
 * @param {string} character
 *
 * @returns {string}
 */
function missingCharacter( fontVariant, character ) {

	// Execute the user defined handled
	return _missingCharacterHandler( fontVariant, character );

}


