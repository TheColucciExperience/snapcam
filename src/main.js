
// Main script for importing assets, modules, etc.

import './index.html'
import './scss/styles.scss';
import filterExample from './images/filter-example.jpg';

// IIFE to keep global namespace clean

(function initScript(window, document, $) {

	// Actions for when script loads

	$(function main() {

		// *** Synchronous code

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
			$effectsContainer = $( '.js-effects-container' )
			// Buttons to open and close pictures menu
			$menuOpenBtn = $( '.js-pictures-menu-open-btn' ),
			$menuCloseBtn = $( '.js-pictures-menu-close-btn' ),
			// Pictures nav menu and pictures overlay DOM elements
			$picturesNav = $( '.js-pictures-nav' ),
			$picturesOverlay = $( '.js-pictures-overlay' );

		/* Adding click listeners to button effect examples with jQuery
		 * event delegation
		 */

		$effectsContainer.on(
			'click',
			'.b-effects-example-button',
			applyFilterEffect
		);

		// Creating video effects examples for each filter

		filtersList.forEach( createExampleFilter );

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

			videoStreamSuccess,

			// Error callback

			videoStreamFailed

		);

		// *** Functions

		// Video stream callback functions

		function videoStreamSuccess(localMediaStream) {
			$video.attr( 'src', window.URL.createObjectURL( localMediaStream ) );
		}

		function videoStreamFailed(error) {
			// Will be updated later
			console.log( `An error occurred: ${error}` );
		}

		// Function to create example filters

		function createExampleFilter(filterName) {

			/* Creating elements to append. Here we just mimic the original DOM
			 * structure on the fly
			 */

			const $buttonContainer = $( '<button>' ),
				$buttonImg = $( '<img/>' ),
				$buttonLabel = $( '<span>' );

			// Adding attributes and classes to created elements

			$buttonContainer
				.addClass( 'b-effects-example-button' )
				.data( 'filter', filterName );


			$buttonImg.addClass( `b-effects-example-button__img f-${ filterName }` );
			$buttonImg.attr( {
				'src': filterExample,
				'alt': `Example image for filter ${ filterName }`
			} );

			$buttonLabel.addClass( `b-effects-example-button__label
															b-effects-example-button__label--inactive
															js-button-label` );
			$buttonLabel.text( filterName );

			// Appending elements

			$buttonContainer.append( $buttonImg, $buttonLabel );
			$effectsContainer.append( $buttonContainer );

		}

		// Function to apply filter effect to video element

		function applyFilterEffect() {

			// Applying filter only if clicked filter is not active

			// Regular expression to check if video has the current button filter class

			let regex = new RegExp( `f-${ $( this ).data( 'filter' ) }`, 'g' );

			if ( !$video.attr( 'class' ).match( regex ) ) {

				// Resetting effects on video and active class on button labels

				// Resetting labels and adding active class to current one

				$( '.js-button-label' )
					.removeClass( 'b-effects-example-button__label--active' );
				$( this )
					.find( '.js-button-label' )
					.addClass( 'b-effects-example-button__label--active' );

				// Resetting video effects and adding current one

				const currentFilterClass =
					$video
						.attr( 'class' )
						.replace( /f-.*/gi, `f-${ $( this ).data( 'filter' ) }` );

				$video.attr( 'class', currentFilterClass );

			}

		}

	});

})(window, document, jQuery);
