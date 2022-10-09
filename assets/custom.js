// Changes the button label of a FileType form field to the file's name
$('.file-input').on('change', function(event) {
    var inputFile = event.currentTarget;
    $(inputFile).parent()
        .find('.file-label')
        .find('.label-content')
        .html(inputFile.files[0].name);
});