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
    
    var datasetName = $('#datasetName').val()
    if(!datasetName) {
      errorOccured = true
      $('#datasetName + .alert').show()
    }
    
    if(!fileToLoad) {
      errorOccured = true
      $('#takeout-file-selector + .alert').text("Select a file").show()
    }
    
    if(errorOccured) return
    try {
      var reader = new FileReader();
      reader.onload = function(e) {parseFile(e.target.result)};
      reader.readAsText(fileToLoad);
    }
    catch(e) {
      $('#takeout-file-selector + .alert').text("Couldn't load file").show()
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
      var data = JSON.parse(contents)
      
      data = data.filter(function(v) {return v.time && v.titleUrl && v.titleUrl.indexOf("watch?v=")!=-1})
      if(data.length == 0) throw "Dataset is empty or invalid"
      
      var payload = {}
      data = data.map(function(v) {
        var ret = {
          id: v.titleUrl.slice(v.titleUrl.indexOf("watch?v=")+8),
          time: v.time
        }
        payload[ret.id] = true
        return ret
      })
      var keys = Object.keys(payload)
      
      fileToLoad = ""
      var datasetName = $("#datasetName").val()
      $("#takeout-file-selector").find(':text').val("")
      $("#datasetName").val("")
      $('#importDatasetModal').modal('hide')
      
      var onFinished = function(apiData) {
        $('#importProgressModal').modal('hide')
        setTimeout(function(){$('#importProgressModal').modal('hide')}, 1000) // Prevents softlock due to very fast responses
        data = data.filter(function(v) {return apiData[v.id]})
                   .map(function(v) {return {...apiData[v.id], ...v}})
        newDatasetImported(datasetName, data)
      }
      
      var onFailed = function(err) {
        $('#importProgressModal').modal('hide')
        setTimeout(function(){$('#importProgressModal').modal('hide')}, 1000) // Prevents softlock due to very fast responses
        
        $('#importErrorModal .error-message').text(err.code+':\n'+err.message)
        $('#importErrorModal').modal('show')
        
      }
      
      var onSegment = function(perc) {
        perc = Math.floor(perc*100)
        $('#importProgressModal .progress-bar').css('width', perc+'%').attr('aria-valuenow', perc).text(perc+'%');  
      }
      onSegment(0)
      $('#importProgressModal').modal({backdrop: 'static', keyboard: false})
      
      getDataFromAPI(Object.keys(payload), onFinished, onFailed, onSegment)
      
    }
    catch(e) {
      $('#takeout-file-selector + .alert').text("Invalid file").show()
      console.error(e)
    }
  }
})(jQuery); // End of use strict
