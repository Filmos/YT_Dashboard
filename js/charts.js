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

function prettyPowerOf10(d, rounding) {
  let num = Math.pow(10, d)-1
  if(num == 0) return 0
  let numOrder = Math.pow(10, Math.floor(Math.log10(num)-1))
  
  if(!rounding) rounding = Math.round
  return rounding(num/numOrder)*numOrder
}

initHeatMap()
initLinePlot()
initHistogram()