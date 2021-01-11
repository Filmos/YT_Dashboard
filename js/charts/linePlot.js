function updateLinePlot(dataInput, scaleType) {

// !!!!!!!!!!!!!!!!!!!!!!!!
// data processing

if(SELECTED_DATATYPE=="General") {
    var dataX = d3.nest()
    .key(function(v){
      var datatmp = new Date(v.time);
      datatmp.setHours(0);
      datatmp.setMinutes(0);
      datatmp.setSeconds(0);
      datatmp.setMilliseconds(0);
      return datatmp.getFullYear() + '-' + ('0' + (datatmp.getMonth()+1)).slice(-2); // + '-' + ('0' + datatmp.getDate()).slice(-2);
      //return datatmp.getFullYear() + "-" + datatmp.getMonth() + "-" + datatmp.getDay(); // + "-" + datatmp.getHours();
    })
    .rollup(v => v.length)
    .entries(dataInput); 
} else {
    var dataX = d3.nest()
    .key(function(v){
      var datatmp = new Date(v.time);
      datatmp.setHours(0);
      datatmp.setMinutes(0);
      datatmp.setSeconds(0);
      datatmp.setMilliseconds(0);
      return datatmp.getFullYear() + '-' + ('0' + (datatmp.getMonth()+1)).slice(-2); // + '-' + ('0' + datatmp.getDate()).slice(-2);
      //return datatmp.getFullYear() + "-" + datatmp.getMonth() + "-" + datatmp.getDay(); // + "-" + datatmp.getHours();
    })
    .rollup(v => d3.mean(v, function(d) { return +d[SELECTED_DATATYPE]; }))
    .entries(dataInput);
    
}

//var dataFormat = "%Y-%m-%d";
var dataFormat = "%Y-%m";

dataX = dataX.sort((a, b) => {
  var date1 = d3.timeParse(dataFormat)(a.key)
  var date2 = d3.timeParse(dataFormat)(b.key)
  return date1 - date2;
});
// !!!!!!!!!!!!!!!!!!!!!!!!
// end of data processing
console.log(dataX)





if(SELECTED_DATATYPE == "General") {
  $('#linePlotTitle').text("Videos viewed over time")
} else {
  $('#linePlotTitle').text("Viewing preferences for " +SELECTED_DATATYPE.toLowerCase()+" over time")
}

var dataProcessed = [];
for (const [key, value] of Object.entries(dataX)) {
  dataProcessed.push({x : value.key, y : value.value})
}

dataProcessed = dataProcessed.sort((a, b) =>{
  var date1 = d3.timeParse(dataFormat)(a.key)
  var date2 = d3.timeParse(dataFormat)(b.key)
  return date1 - date2;
})


console.log(dataProcessed)

var linePlotContent = document.getElementById('linePlotContent');

linePlotContent.innerHTML = '&nbsp;';
$('#linePlotContent').append('<canvas id="linePlot"><canvas>');


var grapharea = document.getElementById("linePlot");

var chart =  new Chart(grapharea, {
          type:    'line',
          data:    {
              datasets: [
                  {
                      data: dataProcessed,
                      fill: false,
                      borderColor: 'red'
                  }]
          },
          options: {
              responsive: true,
              //title:      {
              //    display: true,
              //    text:    "Chart.js Time Scale"
              //},
              legend: {
                display: false},
              scales:     {
                  xAxes: [{
                      type:       "time",
                      distribution: 'series',
                      time:       {
                          parser: "YYYY-MM-DD",
                      },
                      scaleLabel: {
                          display:     true,
                          labelString: 'Date'
                      }
                  }],
                  yAxes: [
                        {
                            type : 'logarithmic',
                      scaleLabel: {
                          display:     true,
                          labelString: 'mean'
                      },
                       ticks: {
                                min: 0
                            }
                            
                        }
                ]
              }
          }
      });














}
