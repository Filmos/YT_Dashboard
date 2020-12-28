currentlyOpenDataset = ""
function newDatasetImported(name, data) {
  console.log("Saving dataset to memory: "+name)
  localStorage.setItem(name, JSON.stringify(data))
  currentlyOpenDataset = name
  loadDatasetFromArray(data)
  updateDatasetMenu()
}

function loadDatasetFromArray(data) {
  data = parseDatatypes(data)
  FULL_DATA = data
  updateAllCharts()
}

function loadDatasetFromMemory(name) {
  console.log("Loading dataset: "+name)
  currentlyOpenDataset = name
  try {
    var data = JSON.parse(localStorage.getItem(name))
    loadDatasetFromArray(data)
  }
  catch(e) {
    console.error("Couldn't load dataset from memory", e)
  }
}

var datasetFlaggedForDeletion = ""
function removeDatasetFromMemoryModal(name) {
  datasetFlaggedForDeletion = name
  $('#confirmDeletionName').text(name)
  $('#confirmDeletionModal').modal('show')
}

function removeDatasetFromMemory(name) {
  console.log("Removing dataset: "+name)
  localStorage.removeItem(name)
  updateDatasetMenu()
  if(currentlyOpenDataset == name) {
    if(Object.keys(localStorage)) loadDatasetFromMemory(Object.keys(localStorage)[0])
    else {
      currentlyOpenDataset = ""
      loadDatasetFromArray([])
    }
  }
}

function updateDatasetMenu() {
  var menu = $('#collapseDatasets div')
  menu.find('a').remove()
  
  for(var datasetName of Object.keys(localStorage)) {
    var a = document.createElement('a')
    a.textContent = datasetName
    a.href = "#"
    a.className = "collapse-item"
    a.setAttribute("dataset", datasetName)
    a.onclick = function(e) {loadDatasetFromMemory(this.getAttribute("dataset"))}
    
    var button = document.createElement('button')
    button.className = "close"
    button.style.fontSize = "1.1rem"
    button.onclick = function(e) {removeDatasetFromMemoryModal(this.parentNode.getAttribute("dataset")); e.stopPropagation()}
    
    var icon = document.createElement('icon')
    icon.className = "fas fa-trash text-danger"
    
    button.appendChild(icon)
    a.appendChild(button)
    menu.append(a)
  }
  
  
}

updateDatasetMenu()
if(Object.keys(localStorage)[0]) loadDatasetFromMemory(Object.keys(localStorage)[0])

$(document).on('click', '.btn-confirm-deletion', function(e) {
  removeDatasetFromMemory(datasetFlaggedForDeletion)
})
