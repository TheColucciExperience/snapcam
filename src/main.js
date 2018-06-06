
// Main script for importing assets, modules, etc.

import './index.html'
import './scss/styles.scss';
import filterExample from './images/filter-example.jpg';

// IIFE to keep global namespace clean

(function initScript(window, document, $) {

	// Actions for when script loads

	$(function main() {

		/* Filters list to create filter examples and apply classes and
		 * necessary DOM references to elements which we need to interact with
		 */

		const filtersList = [
			'blur',
			'brightness',
			'contrast',
			'grayscale',
			'invert',
			'opacity',
			'saturate',
			'sepia'
		],
			$video = $( '.js-main-video' ),
			$effectsContainer = $( '.js-effects-container' );

		// Creating video effects examples for each filter

		filtersList.forEach( function createExampleFilter(filterName) {

			console.log(filterName);

			/* Creating elements to append. Here we just mimic the original DOM
			 * structure on the fly
			 */

			const $buttonContainer = $( '<button>' ),
				$buttonImg = $( '<img/>' ),
				$buttonLabel = $( '<span>' );

			// Adding attributes and classes to created elements

			$buttonContainer.addClass( 'b-effects-example-button' );

			$buttonImg.addClass( `b-effects-example-button__img f-${ filterName }` );
			$buttonImg.attr( {
				'src': filterExample,
				'alt': `Example image for filter ${ filterName }`
			} );

			$buttonLabel.addClass( `b-effects-example-button__label
															b-effects-example-button__label--inactive` );
			$buttonLabel.text( filterName );

			// Appending elements

			$buttonContainer.append( $buttonImg, $buttonLabel );
			$effectsContainer.append( $buttonContainer );

		} );

		// Getting user media

		navigator.getMedia = ( navigator.getUserMedia ||
		 											 navigator.webkitGetUserMedia ||
												   navigator.mozGetUserMedia ||
												   navigator.msGetUserMedia );

		// Initiating video stream request

		navigator.getMedia(

			// Media permissons

			{
				video: true,
				audio: false
			},

			// Success callback

			function loadVideoStream(localMediaStream) {							
				$video.attr( 'src', window.URL.createObjectURL( localMediaStream ) );
			},

			// Error callback

			function handleError(error) {
				// Will be updated later
				console.log( `An error occurred: ${error}` );				
			}

		);

	});

})(window, document, jQuery);
