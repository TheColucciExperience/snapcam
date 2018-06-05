
// Main script for importing assets, modules, etc.

import './index.html'
import './scss/styles.scss';

// IIFE to keep global namespace clean

(function initScript(window, document, $) {

	// Actions for when script loads

	$(function main() {

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

				// Getting video DOM reference to attach a source to it

				const $video = $( '.js-main-video' );
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
