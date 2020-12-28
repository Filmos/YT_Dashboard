function updateMmmChart(data) {
  function updateCard(cardId, vid) {
    console.log(cardId, vid[SELECTED_DATATYPE])
    $('#'+cardId+' .MMM-value').text(DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(vid[SELECTED_DATATYPE]))
    $('#'+cardId+' .MMM-video').attr('src',"https://www.youtube.com/embed/"+vid.id+"?rel=0")
  }
  var sorted = data.sort((a, b) => {
    if(a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]!==0) return a[SELECTED_DATATYPE]-b[SELECTED_DATATYPE]
    return b.time-a.time
  })
  
  console.log(sorted.filter(v => isNaN(v[SELECTED_DATATYPE])))
  updateCard("MMM-Min", sorted[0])
  updateCard("MMM-Med", sorted[Math.floor(sorted.length/2)])
  updateCard("MMM-Max", sorted[sorted.length-1])
}