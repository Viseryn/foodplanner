/*************
 * custom.js *
 *************/

// Makes jQuery usable
var $ = require('jquery');
global.$ = global.jQuery = $;

// Makes the image select button invisible if toggle is active.
// Used in RecipeController::edit().
$('#recipe_image_remove').on('change', function() {
    if (this.checked) {
        $('.file-label').addClass('invisible');
    } else {
        $('.file-label').removeClass('invisible');
    }
});


/*********************
 * Utility Functions *
 *********************/
