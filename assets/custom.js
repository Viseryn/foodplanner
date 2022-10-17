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