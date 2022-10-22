
var $ = require('jquery');
global.$ = global.jQuery = $;

// Changes the button label of a FileType form field to the file's name
$('.file-input').on('change', function(event) {
    var inputFile = event.currentTarget;
    $(inputFile).parent()
        .find('.file-label')
        .find('.label-content')
        .html(inputFile.files[0].name);
});

// Makes the image select button invisible if toggle is active.
// Used in RecipeController::edit().
$('#recipe_image_remove').on('change', function() {
    if (this.checked) {
        $('.file-label').addClass('invisible');
    } else {
        $('.file-label').removeClass('invisible');
    }
});

// Opens an alert when the submit button of a form with id #delete-form is clicked
$('#delete-form').children('button[type="submit"]').on('click', function(e) {
    e.preventDefault();
    var form = $(this).parents('form');
    swal({
        dangerMode: true,
        icon: 'error',
        title: 'Permanently delete?',
        text: 'You will not be able to recover deleted data.',
        buttons: {
            cancel: true,
            confirm: 'Delete',
        },
    }).then((confirm) => {
        if (confirm) form.trigger('submit');
    });
});

// Load Sidebar
window.loadSidebar = function(activeView) {
    // Remove "active" from all other sidebar items
    $('.sidebar-item').removeClass("bg-blue-100");
    $('.sidebar-item').children('.material-symbols-rounded').removeClass('text-gray-900').addClass('text-gray-500');

    // Make sure this is executed after *every*
    // "active" has been removed and DOM is loaded.
    setTimeout(() => {
        $('#sidebar-' + activeView).addClass('bg-blue-100');
        $('#sidebar-' + activeView).children('.material-symbols-rounded').removeClass('text-gray-500').addClass('text-gray-900');
    }, 0);
};
