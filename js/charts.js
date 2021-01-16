var FULL_DATA
function updateAllCharts() {
  if(!SELECTED_DATATYPE || !FULL_DATA) return
  // Tutaj powinien być kod od rysowania i aktualizowania wykresów
  var parsedData = filterData(FULL_DATA)
  updateMmmChart(parsedData)
  updateLinePlot(parsedData)
  updateHeatMap(parsedData)
  updateHistogram(parsedData)
}

function prettyPowerOf10(d) {
  return Math.round(
          (Math.pow(10, d)-1)/Math.pow(10, Math.floor(d-1))
        )*Math.pow(10, Math.floor(d-1))
}

initHeatMap()
initLinePlot()
initHistogram()