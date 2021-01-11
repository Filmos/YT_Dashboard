var linePlotChart
function initLinePlot() {
  linePlotChart = new Chart($('#linePlot'), {
            type: 'line',
            data: {
                datasets: [{
                    data: [],
                    fill: false,
                    borderColor: '#ff6961'
                }]
            },
            options: {
                responsive: true,
                legend: {display: false},
                scales: {
                    xAxes: [{
                        type: "time",
                        distribution: 'series',
                        time: {
                            parser: "YYYY-MM-DD",
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date',
                            fontColor: '#ff6961'
                        },
                        ticks: {
                            fontColor: '#ff6961'
                        } 
                    }],
                    yAxes: [{
                        type : 'logarithmic',
                        scaleLabel: {
                            display: true,
                            fontColor: '#ff6961'
                        },
                        ticks: {
                            fontColor: '#ff6961', 
                            callback: function(v, i, allV) {
                              if(!DATATYPES_DEFINITIONS) return
                              let rem = Math.floor((1+Math.log10(v))%1*100)
                              if(v!==0 && (rem==95 || rem==84 || rem==69 || rem==47)) return
                              return DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(v)
                            }
                        }  
                  }]
              },
              tooltips: {
                // Disable the on-canvas tooltip
                enabled: false,

                custom: function(tooltipModel) {
                    // Tooltip Element
                    var tooltipEl = d3.select('#chartjs-tooltip')

                    // Create element on first render
                    if (tooltipEl.empty()) {
                        tooltipEl = createThemedTooltip(d3.select("body"))
                          .attr("id", 'chartjs-tooltip')
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style('opacity', 0)
                        return
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var title = (tooltipModel.title || [])[0]
                        var value = tooltipModel.body[0].lines[0]
                        
                        let dat = DATATYPES_DEFINITIONS[SELECTED_DATATYPE]
                        tooltipEl.select(".tooltip-value").text(dat.format(value))
                        tooltipEl.select(".tooltip-sub-value").text(" "+dat.suffixName)
                        
                        if(SELECTED_DATATYPE == "General") {
                          tooltipEl.select(".tooltip-title").text("Value for "+title)
                        } else {
                          tooltipEl.select(".tooltip-title").text("Median for "+title)
                        }
                    }

                    // `this` will be the overall tooltip
                    var position = this._chart.canvas.getBoundingClientRect()
                    var tooltipSize = tooltipEl.node().getBoundingClientRect()

                    // Display, position, and set styles for font
                    tooltipEl.style('opacity', 1)
                    tooltipEl.style('position', 'absolute')
                    tooltipEl.style('left', position.left + window.pageXOffset + tooltipModel.caretX + 'px')
                    tooltipEl.style('top', position.top + window.pageYOffset + tooltipModel.caretY - tooltipSize.height + 'px')
                }
            }
            }
        });
}

function updateLinePlot(dataInput, scaleType) {

// Data processing
var dataX = d3.nest()
  .key(function(v){
    var datatmp = new Date(v.time)
    datatmp.setHours(0)
    datatmp.setMinutes(0)
    datatmp.setSeconds(0)
    datatmp.setMilliseconds(0)
    return datatmp.getFullYear() + '-' + ('0' + (datatmp.getMonth()+1)).slice(-2)
  })

if(SELECTED_DATATYPE=="General") dataX = dataX.rollup(v => v.length)
else dataX = dataX.rollup(v => d3.mean(v, function(d) { return +d[SELECTED_DATATYPE]; }))

dataX = dataX.entries(dataInput)

var dataFormat = "%Y-%m";

// Data restructuring
var dataProcessed = [];
for (const [key, value] of Object.entries(dataX)) {
  dataProcessed.push({x : value.key, y : value.value})
}

dataProcessed = dataProcessed.sort((a, b) =>{
  var date1 = d3.timeParse(dataFormat)(a.x)
  var date2 = d3.timeParse(dataFormat)(b.x)
  return date1 - date2;
})


// Update plot title
if(SELECTED_DATATYPE == "General") {
  $('#linePlotTitle').text("Videos viewed over time")
} else {
  $('#linePlotTitle').text("Viewing preferences over time")
}


// Update plot
linePlotChart.data.datasets[0].data = dataProcessed
linePlotChart.options.scales.yAxes[0].scaleLabel.labelString = SELECTED_DATATYPE=="General"?"Viewed videos":SELECTED_DATATYPE
linePlotChart.update()

}
