function updateMmmChart(data) {
  function updateCard(cardId, vid) {
    if(!vid) {
      $('#'+cardId+' .MMM-value').text("---")
      $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/")
    } else if(SELECTED_DATATYPE=="General") {
      $('#'+cardId+' .MMM-value').text(DATATYPES_DEFINITIONS["Times viewed"].format(vid["Times viewed"]))
      $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/"+vid.id+"?rel=0")
    } else {
      $('#'+cardId+' .MMM-value').text(DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(vid[SELECTED_DATATYPE]))
      $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/"+vid.id+"?rel=0")
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
    
    updateCard("MMM-Min", sorted[0])
    updateCard("MMM-Med", sorted[1])
    updateCard("MMM-Max", sorted[2])
    
  } else {
    
    var sorted = data.sort((a, b) => {
      if(a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]!==0) return a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]
      return b.time-a.time
    })
    
    updateCard("MMM-Min", sorted[0])
    updateCard("MMM-Med", sorted[Math.floor(sorted.length/2)])
    updateCard("MMM-Max", sorted[sorted.length-1])
    
  }
}