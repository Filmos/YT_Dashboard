var FULL_DATA
function updateAllCharts() {
  if(!SELECTED_DATATYPE || !FULL_DATA) return
  // Tutaj powinien być kod od rysowania i aktualizowania wykresów
  $("#dataPreview").html(JSON.stringify(FULL_DATA[0]))
  console.log(FULL_DATA)
}