var DATATYPES_DEFINITIONS = {
  "General": {
    icon: "fas fa-chart-area",
    filterable: false,
    suffixName: "videos viewed"
  },
  
  "Times viewed": {
    preFormula: (v, state) => {state[v.id] = (state[v.id]||0)+1; return state},
    formula: (v, state) => state[v.id],
    icon: "fas fa-redo-alt",
    selectable: false
  },
  "Total views": {
    formula: v => parseInt(v.views),
    icon: "fas fa-eye"
  },
  
  "Total likes": {
    formula: v => parseInt(v.likes),
    icon: "fas fa-thumbs-up"
  },
  "Likes per thousand views": {
    formula: v => v.likes/v.views*1000,
    icon: "far fa-thumbs-up"
  },
  
  "Total dislikes": {
    formula: v => parseInt(v.dislikes),
    icon: "fas fa-thumbs-down"
  },
  "Dislikes per thousand views": {
    formula: v => v.dislikes/v.views*1000,
    icon: "far fa-thumbs-down"
  },
  
  "Like to dislike ratio": {
    formula: v => {
      if(v.likes == v.dislikes) return 0.5
      return (v.likes)/(Math.max(1, v.likes*1+v.dislikes*1))*10
    },
    icon: "fas fa-star-half-alt"
  },
  
  "Total comments": {
    formula: v => parseInt(v.comments),
    icon: "fas fa-comment"
  },
  "Comments per thousand views": {
    formula: v => v.comments/v.views*1000,
    icon: "far fa-comment"
  },
  
  "Duration": {
    formula: v => moment.duration(v.duration, moment.ISO_8601).asSeconds(),
    userParser: v => {
      if(parseInt(v) == v) return parseInt(v)
      
      if(v.split(":").length==2) return moment.duration("0:"+v).asSeconds()
      if(/H|M|S/i.test(v) && !/PT/i.test(v)) return moment.duration("PT"+v.toUpperCase().replace(/ /g,"")).asSeconds()
      
      let ret = moment.duration(v).asSeconds()
      if(ret != 0) return ret
    },
    format: v => {
      let ret = moment.utc(v*1000).format("mm:ss")
      if(v>=3600) ret = moment.utc(v*1000).format("HH:") + ret
      if(v>=86400) ret = Math.floor(v/86400) +"D "+ ret
      return ret
    },
    suffixName: "",
    icon: "far fa-clock"
  }
}

function parseDatatypes(data) {
  var states = {}
  return data.map(v => {
    for(var k in DATATYPES_DEFINITIONS) {
      if(!DATATYPES_DEFINITIONS[k].preFormula) continue
      states[k] = DATATYPES_DEFINITIONS[k].preFormula(v, states[k]||{})
    }
    return v
  }).map(v => {
    var ret = {id: v.id, thumbnail: v.thumbnail, time: Date.parse(v.time)}
    for(var k in DATATYPES_DEFINITIONS) {
      if(!DATATYPES_DEFINITIONS[k].formula) continue
      ret[k] = DATATYPES_DEFINITIONS[k].formula(v, states[k])
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
      formula: false,
      icon: "fas fa-asterisk",
      color: "primary",
      format: num => {
        let n = (parseFloat(num)||0)
        if(n>999) n = Math.round(n)
        return n.toLocaleString()
      },
      userParser: parseInt,
      filterable: true,
      selectable: true
    }
    for(var k in DATATYPES_DEFINITIONS) DATATYPES_DEFINITIONS[k] = {suffixName: k.toLowerCase(), ...defaultVal, ...DATATYPES_DEFINITIONS[k]}
    
  }
  tidyDATATYPES_DEFINITIONS()

  function buildDatatypeMenu() {
    var menu = $('#collapseDatatypes .collapse-inner')
    for(var k in DATATYPES_DEFINITIONS) {
      if(!DATATYPES_DEFINITIONS[k].selectable) continue
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