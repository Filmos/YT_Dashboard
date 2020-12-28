var datatypesDefinitions = {
  "Total views": {
    formula: v => parseInt(v.views),
    icon: "fas fa-eye"
  },
  
  "Total likes": {
    formula: v => parseInt(v.likes),
    icon: "fas fa-thumbs-up",
    color: "success"
  },
  "Likes per thousand views": {
    formula: v => v.likes/v.views*1000,
    icon: "far fa-thumbs-up",
    color: "success"
  },
  
  "Total dislikes": {
    formula: v => parseInt(v.dislikes),
    icon: "fas fa-thumbs-down",
    color: "danger"
  },
  "Dislikes per thousand views": {
    formula: v => v.dislikes/v.views*1000,
    icon: "far fa-thumbs-down",
    color: "danger"
  },
  
  "Total comments": {
    formula: v => parseInt(v.comments),
    icon: "fas fa-comment"
  },
  "Comments per thousand views": {
    formula: v => v.comments/v.views*1000,
    icon: "far fa-comment"
  }
}

function parseDatatypes(data) {
  return data.map(v => {
    var ret = {id: v.id, thumbnail: v.thumbnail}
    for(var k in datatypesDefinitions) ret[k] = datatypesDefinitions[k].formula(v)
    return ret
  })
}

var SELECTED_DATATYPE
(function($) {
  "use strict"; // Start of use strict
  
  function tidyDatatypesDefinitions() {
    var defaultVal = {
      icon: "fas fa-asterisk",
      color: "primary"
    }
    for(var k in datatypesDefinitions) datatypesDefinitions[k] = {...defaultVal, ...datatypesDefinitions[k]}
    
  }
  tidyDatatypesDefinitions()

  function buildDatatypeMenu() {
    var menu = $('#collapseDatatypes div')
    for(var k in datatypesDefinitions) {
      var datatype = datatypesDefinitions[k]
      var a = document.createElement('a')
      a.textContent = k
      a.href = "#"
      a.className = "collapse-item"
      a.setAttribute("datatype", k)
      a.onclick = function(e) {changeDatatype(this.getAttribute("datatype"))}
      
      menu.append(a)
    }
  }
  buildDatatypeMenu()
  
  function changeDatatype(name) {
    var datatype = datatypesDefinitions[name]
    if(!datatype) return
    $("#datatypeSelector i").attr("class", datatype.icon)
    $("#datatypeSelector span").text(name)
    SELECTED_DATATYPE = name
    updateAllCharts()
  } 
  changeDatatype(Object.keys(datatypesDefinitions)[0])
  
})(jQuery); // End of use strict