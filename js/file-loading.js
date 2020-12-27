var fullData
(function($) {
  "use strict"; // Start of use strict
  
  // Takeout file loading
  var fileToLoad = ""
  $(document).on('change', '.btn-file :file', function(e) {
    fileToLoad = e.target.files[0];
    var label = $(this).parents('.input-group').find(':text')
    
    if(!fileToLoad) {label.val(""); return}
    label.val(fileToLoad.name)
    $(this).parents('.input-group').find('+ .alert').hide()
  });
  
  $(document).on('click', '.btn-takeout-import', function(e) {
    var errorOccured = false
    
    let datasetName = $('#datasetName').val()
    if(!datasetName) {
      errorOccured = true
      $('#datasetName + .alert').show()
    }
    
    if(!fileToLoad) {
      errorOccured = true
      $('#takeout-file-selector + .alert').html("Select a file").show()
    }
    
    if(errorOccured) return
    try {
      var reader = new FileReader();
      reader.onload = function(e) {parseFile(e.target.result)};
      reader.readAsText(fileToLoad);
    }
    catch(e) {
      $('#takeout-file-selector + .alert').html("Couldn't load file").show()
      console.error(e)
    }
  });
  
  $(document).on('change keyup paste', '#datasetName', function(e) {
    $(this).find('+ .alert').hide()
  });
  $('#datasetName + .alert').hide()
  $('#takeout-file-selector + .alert').hide()

  function parseFile(contents) {
    try {
      fullData = JSON.parse(contents)
      console.log(fullData);
      
      fileToLoad = ""
      $("#takeout-file-selector").find(':text').val("")
      $("#datasetName").val("")
      $('#importDatasetModal').modal('hide')
    }
    catch(e) {
      $('#takeout-file-selector + .alert').html("Invalid file").show()
      console.error(e)
    }
  }
})(jQuery); // End of use strict
