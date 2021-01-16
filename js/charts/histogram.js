var histogramPlot

function initHistogram() {
  // Chart.defaults.global.datasets.bar.categoryPercentage = 1;
  const ctx = document.getElementById('histogram');
  histogramChart = new Chart(ctx, {
      type: 'bar',
      data: {
          datasets: [{
              data: [],
              backgroundColor: '#C34A36',
              barPercentage: 1,
              categoryPercentage: 0.92
          }]
      },
      options: {
          responsive: true,
          legend: {display: false},
          scales: {
              xAxes: [{display: false}, {
                  ticks: {
                      fontColor: '#ff6961',
                      fontSize: 14
                  },
                  scaleLabel: {
                      display: true,
                      fontColor: '#ff6961',
                      fontSize: 16
                  },
                  gridLines: {
                    offsetGridLines: false
                  }
              }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      fontColor: '#ff6961',
                      fontSize: 14
                  },
                  scaleLabel: {
                      display: true,
                      fontColor: '#ff6961',
                      fontSize: 16
                  }
              }]
        },
        tooltips: {
          // Disable the on-canvas tooltip
          enabled: false,

          custom: function(tooltipModel) {
              // Tooltip Element
              var tooltipEl = d3.select('#chartjs-histogram-tooltip')

              // Create element on first render
              if (tooltipEl.empty()) {
                  tooltipEl = createThemedTooltip(d3.select("body"))
                    .attr("id", 'chartjs-histogram-tooltip')
                    .style("transition", 'left 0.3s, top 0.3s')
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
                  tooltipEl.select(".tooltip-title").text(title+" "+dat.suffixName)
                  tooltipEl.select(".tooltip-value").text(value)
                  
                  if(SELECTED_DATATYPE == "General") {
                    tooltipEl.select(".tooltip-sub-value").text(" days")
                  } else {
                    tooltipEl.select(".tooltip-sub-value").text(" videos viewed")
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

function updateHistogram(dataInput) {

    // Data parsing
    if (SELECTED_DATATYPE == "General"){
        var data = d3.nest()
            .key(function(v){
                var datatmp = new Date(v.time) //v to jest to data input, time to data, datatmp to Data
                datatmp.setHours(0)
                datatmp.setMinutes(0)
                datatmp.setSeconds(0)
                datatmp.setMilliseconds(0)
                return datatmp.getFullYear() + '-' + ('0' + (datatmp.getMonth()+1)).slice(-2) + '-' + ('0' + (datatmp.getDate()+1)).slice(-2)
            })
        data = data.rollup(v => v.length)
        data = data.entries(dataInput)

        dataX=[]
        for (const [key, value] of Object.entries(data)) {
            dataX.push(value.value)
        }
    }else{
        var dataX = dataInput.map(v => v[SELECTED_DATATYPE]);
        dataX.sort(function(a, b){return b-a});
    }

    // Splitting into buckets
    let minVal = d3.min(dataX);
    let maxVal = d3.max(dataX);
    let minValLog = Math.log10(minVal+1);
    let maxValLog = Math.log10(maxVal+1);
    let Nbin = 15; // The number of bins

    var edges
    if(SELECTED_DATATYPE == "General") edges = d3.range(minVal,maxVal,Math.round((maxVal-minVal)/Nbin))
    else edges = d3.range(minValLog, maxValLog,(maxValLog-minValLog)/Nbin).map((v, i) => prettyPowerOf10(v, i==0?(Math.floor):(Math.round)))

    var buckets = d3.histogram()
        .domain([minVal,maxVal])
        .thresholds(edges)
        (dataX)
        .map(v => v.length)
    
    // Generating labels
    edges.push(prettyPowerOf10(maxValLog, Math.ceil))
    var bucketLabels = edges.slice(0, -1).map((v, i) => "["+DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(v, maxVal) + "; " + DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(edges[i+1], maxVal) + ")")
    var tickLabels = edges.map(v => DATATYPES_DEFINITIONS[SELECTED_DATATYPE].format(v, maxVal))
    
    
    // Update plot title
    if(SELECTED_DATATYPE == "General") {
        $('#histogramTitle').text("Histogram of daily amount of watched videos")
    } else {
        $('#histogramTitle').text("Histogram of watched videos by "+SELECTED_DATATYPE.toLowerCase())
    }
    
    // Update plot
    histogramChart.data.datasets[0].data = buckets
    histogramChart.options.scales.xAxes[0].labels = bucketLabels
    histogramChart.options.scales.xAxes[1].labels = tickLabels
    histogramChart.options.scales.xAxes[1].scaleLabel.labelString = SELECTED_DATATYPE=="General"?"Viewed videos":SELECTED_DATATYPE
    histogramChart.options.scales.yAxes[0].scaleLabel.labelString = SELECTED_DATATYPE=="General"?"Number of days":"Number of videos"

    histogramChart.update()

}