
// Main script for importing assets, modules, etc.

import './index.html'
import './scss/styles.scss';

// IIFE to keep global namespace clean

(function initScript(window, document, $) {

	// Actions for when script loads

	$(function main() {

		console.log( 'Script Loaded' );

	});

})(window, document, jQuery);
