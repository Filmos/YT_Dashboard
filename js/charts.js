var FULL_DATA
function updateAllCharts() {
  if(!SELECTED_DATATYPE || !FULL_DATA) return
  // Tutaj powinien być kod od rysowania i aktualizowania wykresów
  var parsedData = filterData(FULL_DATA)
  updateMmmChart(parsedData)
  updateLinePlot(parsedData)
  updateHeatMap(parsedData)
   
    
}

initHeatMap()
