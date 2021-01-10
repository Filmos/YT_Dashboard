function updateMmmChart(data) {
  function updateCard(cardId, vid, title) {
    $('#'+cardId+' .MMM-title').text(title)
    
    if(!vid) {
      $('#'+cardId+' .MMM-value').text("---")
      $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/")
    } else {
      $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/"+vid.id+"?rel=0")
      
      let dat = SELECTED_DATATYPE
      if(SELECTED_DATATYPE=="General") dat = "Times viewed"
      
      $('#'+cardId+' .MMM-value').text(DATATYPES_DEFINITIONS[dat].format(vid[dat]))
      $('#'+cardId+' .MMM-sub-value').text(DATATYPES_DEFINITIONS[dat].suffixName)
    }
  }
  
  var sorted = []
  if(SELECTED_DATATYPE=="General") {
    
    var appeared = {}
    var sorted = data.sort((a, b) => {
      if(b["Times viewed"]-a["Times viewed"]!==0) return b["Times viewed"]-a["Times viewed"]
      return a.time-b.time
    }).filter(v => {
      let ret = !appeared[v.id]
      appeared[v.id] = true
      return ret
    })
    
    updateCard("MMM-Min", sorted[0], "Most viewed video")
    updateCard("MMM-Med", sorted[1], "Second most viewed video")
    updateCard("MMM-Max", sorted[2], "Third most viewed video")
    
  } else {
    
    var sorted = data.sort((a, b) => {
      if(a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]!==0) return a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]
      return b.time-a.time
    })
    
    updateCard("MMM-Min", sorted[0], "Minimum from viewed videos")
    updateCard("MMM-Med", sorted[Math.floor(sorted.length/2)], "Median from viewed videos")
    updateCard("MMM-Max", sorted[sorted.length-1], "Maximum from viewed videos")
    
  }
}