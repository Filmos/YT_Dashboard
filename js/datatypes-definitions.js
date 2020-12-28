var DATATYPES_DEFINITIONS = {
  "Total views": {
    formula: v => parseInt(v.views),
    icon: "fas fa-eye"
  },
  
  "Total likes": {
    formula: v => parseInt((v.likes||0)),
    icon: "fas fa-thumbs-up",
    color: "success"
  },
  "Likes per thousand views": {
    formula: v => (v.likes||0)/v.views*1000,
    icon: "far fa-thumbs-up",
    color: "success"
  },
  
  "Total dislikes": {
    formula: v => parseInt((v.dislikes||0)),
    icon: "fas fa-thumbs-down",
    color: "danger"
  },
  "Dislikes per thousand views": {
    formula: v => (v.dislikes||0)/v.views*1000,
    icon: "far fa-thumbs-down",
    color: "danger"
  },
  
  "Total comments": {
    formula: v => parseInt((v.comments||0)),
    icon: "fas fa-comment"
  },
  "Comments per thousand views": {
    formula: v => (v.comments||0)/v.views*1000,
    icon: "far fa-comment"
  }
}

function parseDatatypes(data) {
  return data.map(v => {
    var ret = {id: v.id, thumbnail: v.thumbnail, time: Date.parse(v.time)}
    for(var k in DATATYPES_DEFINITIONS) {
      ret[k] = DATATYPES_DEFINITIONS[k].formula(v)
      if(isNaN(ret[k])) {
        console.warn("NaN in "+k, v)
        ret[k] = 0
      }
    }
    return ret
  })
}

var SELECTED_DATATYPE
(function($) {
  "use strict"; // Start of use strict
  
  function tidyDATATYPES_DEFINITIONS() {
    var defaultVal = {
      icon: "fas fa-asterisk",
      color: "primary",
      format: num => {
        return num.toLocaleString()
      }
    }
    for(var k in DATATYPES_DEFINITIONS) DATATYPES_DEFINITIONS[k] = {...defaultVal, ...DATATYPES_DEFINITIONS[k]}
    
  }
  tidyDATATYPES_DEFINITIONS()

  function buildDatatypeMenu() {
    var menu = $('#collapseDatatypes div')
    for(var k in DATATYPES_DEFINITIONS) {
      var datatype = DATATYPES_DEFINITIONS[k]
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
    var datatype = DATATYPES_DEFINITIONS[name]
    if(!datatype) return
    $("#datatypeSelector i").attr("class", datatype.icon)
    $("#datatypeSelector span").text(name)
    SELECTED_DATATYPE = name
    updateAllCharts()
  } 
  changeDatatype(Object.keys(DATATYPES_DEFINITIONS)[0])
  
})(jQuery); // End of use strict