
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
			$effectsContainer = $( '.js-effects-container' ),
			// Button to open and close pictures menu
			$menuToggleBtn = $( '.js-pictures-menu-button' ),
			// Snapshot button
			$snapshotBtn = $( '.js-snapshot-button' ),
			// Pictures nav menu, block and overlay DOM elements
			$picturesNav = $( '.js-pictures-nav' ),
			$picturesBlock = $( '.js-pictures-block' ),
			$picturesOverlay = $( '.js-pictures-overlay' ),
			// Pictures message element for users who don't have any snapshots
			$picturesMessage = $( '.js-pictures-message' ),
			// Getting message container
			$messageContainer = $( '.js-message-container' );

		// Object to control user interactions with menu

		const UIControl = {
			menuOpen: false,
			userCanToggle: true,
			picturesCounter: 1,
			userCanSnapshot: true
		}

		/* Adding click listeners to button effect examples with jQuery
		 * event delegation
		 */

		$effectsContainer.on(
			'click',
			'.b-effects-example-button',
			applyFilterEffect
		);

		// Click listener for snapshot button

		$snapshotBtn.on( 'click', takeSnapshot );

		// Adding click listeners to menu buttons and overlay

		$menuToggleBtn.on( 'click', toggleMenu );
		$picturesOverlay.on( 'click', toggleMenu );

		// Creating video effects examples for each filter

		filtersList.forEach( createExampleFilter );

		// Adding slicker carousel to effects container

		$effectsContainer.slick( {
			dots: false,
			arrows: false,
			slidesToShow: 3,
			slidesToScroll: 3,
			infinite: true,
			mobileFirst: true,
			responsive: [
				{
					breakpoint: 576,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4
					}
				}, {
					breakpoint: 992,
					settings: {
						slidesToShow: 6,
						slidesToScroll: 6
					}
				}, {
					breakpoint: 1200,
					settings: 'unslick'
				}
			]
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
			createMessage(
				'An error occurred',
				`You need to have a camera in your machine and give access
				permissions for Snapcam to work. Reload the page and try again.`,
				10000
			);
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

				if ( $video.attr( 'class' ).match( /f-.*/ ) ) {

					const currentFilterClass =
						$video
							.attr( 'class' )
							.replace( /f-.*/gi, `f-${ $( this ).data( 'filter' ) }` );

					$video.attr( 'class', currentFilterClass );

				}
				else {
					$video.addClass( `f-${ $( this ).data( 'filter' ) }` );
				}

			}

		}

		// Function that will handle toggling the pictures menu

		function toggleMenu() {

			/* Only act if user can toggle, and if so disable control until end
			 * of transition
			 */

			if ( UIControl.userCanToggle ) {

				if ( !UIControl.menuOpen ) {

					$picturesNav.removeClass( 'b-pictures-nav--hidden' );
					$picturesNav.css( 'animation', 'slideMenuIn .4s ease forwards' );
					$picturesOverlay.removeClass( 'b-pictures-nav__overlay--hidden' );
					$picturesOverlay.css( 'animation', 'fadeIn .4s ease forwards' );
					$menuToggleBtn.addClass( 'b-pictures-menu-button--close-padded' );
					/* We need to reference the element directly or else
					 * Font Awesome won't update on the fly.
					 */
					$( '.js-pictures-menu-btn-icon' ).addClass( 'fa-times' );
					$( '.js-pictures-menu-btn-icon' ).removeClass( 'fa-images' );

				}
				else {

					$picturesNav.css( 'animation', 'slideMenuOut .4s ease forwards' );
					$picturesOverlay.css( 'animation', 'fadeOut .4s ease forwards' );
					$menuToggleBtn
						.removeClass( 'b-pictures-menu-button--close-padded' );
					$( '.js-pictures-menu-btn-icon' ).addClass( 'fa-images' );
					$( '.js-pictures-menu-btn-icon' ).removeClass( 'fa-times' );

					// Timeout to hide elements

					window.setTimeout( function hideMenuElements() {
						$picturesNav.addClass( 'b-pictures-nav--hidden' );
						$picturesOverlay.addClass( 'b-pictures-nav__overlay--hidden' );
					}, 410 );

				}

				// Updating UI control object

				UIControl.userCanToggle = false;
				UIControl.menuOpen = !UIControl.menuOpen;

				// Timeout to allow user to toggle menu again

				window.setTimeout( function returnUserControl() {
					UIControl.userCanToggle = true;
				}, 420 );

			}

		}

		// Function to take user snapshot and show it in pictures menu

		function takeSnapshot() {

			if ( UIControl.userCanSnapshot ) {

				UIControl.userCanSnapshot = false;

				// Hiding 'no snapshots' message, if not already

				if ( !$picturesMessage.hasClass( 'b-pictures-block__message--hidden' ) )
				{
					$picturesMessage.addClass( 'b-pictures-block__message--hidden' );
				}

				// Creating elements to form link block

				const $link = $( '<a>' ),
					$canvas = $( '<canvas>' ),
					$label = $( '<span>' ),
					// Getting canvas context
					ctx = $canvas.get( 0 ).getContext( '2d' );

				// Creating canvas 

				// Setting canvas width and height

				$canvas.attr( {
					'width': '200px',
					'height': '200px'
				} );

				// If the video has any effect, add it to canvas

				if ( $video.attr( 'class' ).match( /f-.+/ ) ) {

					// Getting filter class and adding it to canvas				

					$canvas.addClass(
						$video.attr( 'class' ).match( /f-.+/ )[0]
					);

				}

				// Drawing snapshot on canvas

				ctx.drawImage(
					$video.get( 0 ), // Video element to draw as an image
					0, 0, 200, 200
				);

				// Attributes and classes for link to download canvas

				$link
					.addClass( 'b-pictures-link-block' )
					.attr( {
						'href': $canvas.get( 0 ).toDataURL(),
						'download': `snapshot${ UIControl.picturesCounter++ }.png`
					} );

				// Adding classes and text to link block label

				$label
					.addClass( 'b-pictures-link-block__label' )
					.text( 'download' );

				// Appending items

				$link.append( $canvas, $label );
				$picturesBlock.prepend( $link );

				// Notifying user

				createMessage( 'Snapshot Taken!', '', 2000 );

				window.setTimeout( function returnUserControl() {
					UIControl.userCanSnapshot = true;
				}, 400 );

			}			

		}

		// Function to create message box

		function createMessage(title = 'Message Box', text = '', timeout = 0) {

			// Creating box and title

			const $messageBox = $( '<section>' ),
				$title = $( '<h2>' );

			// Adding classes to elements

			$messageBox.addClass( 'b-message-box' );
			$title.addClass( 'b-message-box__title' );

			// Adding text to title

			$title.text( title.trim() );

			// Appending items

			$messageBox.append( $title );
			$messageContainer.append( $messageBox );

			// If text string is not empty, create paragraph

			if ( text.trim() ) {

				const $paragraph = $( '<p>' );
				$paragraph.addClass( 'b-message-box__text' );
				$paragraph.text( text.trim() );

				// Appending paragraph

				$messageBox.append( $paragraph );

			}

			// Animating message box

			$messageBox.css( 'animation', 'slideMessageIn .5s ease forwards' );

			const boxTimeout = timeout >= 600 ? timeout : 600;			

			window.setTimeout( function hideMessageBox() {

				// Starting hiding animation

				$messageBox.css( 'animation', 'slideMessageOut .5s ease forwards' );

				window.setTimeout( function removeMessageBox() {
					$messageBox.remove();
				}, 500 );

			}, boxTimeout );

		}

	});

})(window, document, jQuery);
