function newFilter(name) {
  var copy = $('#filterTemplate').clone(true)
  var datatype = DATATYPES_DEFINITIONS[name]
  let id = "filter-"+name.toLowerCase().replace(/ /g, "-")
  copy.attr('id', id)
  copy.attr('filter-by', name)
  
  copy.find('*[data-target="#TMPCollapse"]').attr("data-target", "#Collapse-"+id)
  copy.find('*[aria-controls="TMPCollapse"]').attr("aria-controls", "Collapse-"+id)
  copy.find('#TMPCollapse').attr("id", "Collapse-"+id)
  copy.find('*[aria-labelledby="TMPDropdown"]').attr("aria-labelledby", "Dropdown-"+id)
  copy.find('#TMPDropdown').attr("id", "Dropdown-"+id)
  
  copy.find('.nav-link span').text(name)
  copy.find('.nav-link i').attr("class", datatype.icon)
  
  copy.on('click', '.dropdown-item', function() {
    let filter = $(this).parentsUntil('li.nav-item').parent()
    
    let label = this.textContent
    if(label.indexOf(" ")==-1) {
      label += " "
      filter.find('.second-filter').hide()
    } else filter.find('.second-filter').show()
    
    filter.find('.dropdown-toggle').text(label.slice(0, label.indexOf(" "))+" ")
    filter.find('.input-group-text').text(label.slice(label.indexOf(" ")))
    
    let newType = $(this).attr('switch-to')
    filter.find('.first-filter-input').attr('placeholder', (newType==1?"Maximum":"Minimum")).attr('aria-label', (newType==1?"Maximum":"Minimum"))
    
    filter.attr("filter-type", newType)
    updateAllCharts()
  })
  copy.find('.dropdown-item:first-child').click()
  
  copy.on('change', 'input', function() {
    updateAllCharts()
  })
  
  copy.on('click', '.delete-button', function() {
    $(this).parentsUntil('li.nav-item').parent().remove()
    updateNewFilterMenu()
    updateAllCharts()
  })
  
  copy.insertBefore('#filterTemplate').show()
  copy.find('.collapse').collapse("show")
  updateNewFilterMenu()
}
$('#filterTemplate').hide()

function updateNewFilterMenu() {
  var menu = $('#collapseNewFilter .collapse-inner')
  menu.find('a').remove()
  let isEmpty = true
  
  for(var k in DATATYPES_DEFINITIONS) {
    if(!DATATYPES_DEFINITIONS[k].filterable) continue
    if($('.nav-item[filter-by="'+k+'"]').length) continue
    isEmpty = false
    var a = document.createElement('a')
    a.textContent = k
    a.href = "#"
    a.className = "collapse-item"
    a.setAttribute("datatype", k)
    a.onclick = function(e) {newFilter(this.getAttribute("datatype")); e.stopPropagation()}
    
    menu.append(a)
  }
  
  if(isEmpty) $('#newFilterMenu').hide()
  else $('#newFilterMenu').show()
}
updateNewFilterMenu()

function filterData(data) {
  var comparator = []
  $('.nav-item[filter-by]').each(function() {
    let datatype = $(this).attr('filter-by')
    let type = $(this).attr('filter-type')
    
    if(type==0 || type==1) {
      let val = DATATYPES_DEFINITIONS[datatype].userParser($(this).find('.first-filter-input').val())
      console.log(val)
      if(isNaN(val)) return
      comparator.push("(v['"+datatype+"']"+(type==0?">":"<")+val+")")
    }
    else {
      let val1 = DATATYPES_DEFINITIONS[datatype].userParser($(this).find('.first-filter-input').val())
      let val2 = DATATYPES_DEFINITIONS[datatype].userParser($(this).find('.second-filter-input').val())
      if(isNaN(val1) && isNaN(val2)) return
      let com = "("
      if(!isNaN(val1)) com += "v['"+datatype+"']>"+val1
      if(!isNaN(val1) && !isNaN(val2)) com += (type==2?"&&":"||")
      if(!isNaN(val2)) com += "v['"+datatype+"']<"+val2
      com += ")"
      comparator.push(com)
    }
  })
  if(comparator.length == 0) return data
  
  var func = new Function("v", "return ("+comparator.join(" && ")+")")
  return data.filter(func)
}