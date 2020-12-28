function loadAPIClient() {
  gapi.client.setApiKey("AIzaSyAwPHCX3POkrRAeqqir-op4yTSgtxKyRbY");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
gapi.load('client', loadAPIClient);

var _apiData = {}
function getDataFromAPI(payload, onDelivered, onFailed, onSegment) {
  var fullPayload = payload.filter(function(id) {return !_apiData[id]})
  var onPayloadDelivered = onDelivered || function(){}
  var onPayloadFailed = onFailed || function(){}
  var onPayloadSegment = onSegment || function(){}
  
  var payloadWorkers = 0
  var segmentCount = Math.ceil(fullPayload.length/50)
  var counter = 0
  for(var i=0; i<5; i++) newPayloadWorker()
  
  
  function newPayloadWorker() {
    payloadWorkers += 1
    executeAPIRequest()
  }
  function executeAPIRequest() {
    var payload = fullPayload.slice(0, 50)
    
    if(payload.length == 0) {
      payloadWorkers -= 1
      if(payloadWorkers==0) onPayloadDelivered(_apiData) 
      return
    }
    fullPayload = fullPayload.slice(50)
  
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails,statistics,status"
      ],
      "id": [
        payload
      ]
    })
    .then(function(response) {
          response.result.items.forEach(function(vid) {
            if(!vid.id || !vid.status) return
            if(vid.status.privacyStatus != "public") return
            _apiData[vid.id] = {
              likes: vid.statistics.likeCount,
              dislikes: vid.statistics.dislikeCount,
              views: vid.statistics.viewCount,
              comments: vid.statistics.commentCount,
              thumbnail: vid.snippet.thumbnails.high.url,
              language: vid.snippet.defaultAudioLanguage,
              category: vid.snippet.categoryId,
              published: vid.snippet.publishedAt,
              duration: vid.contentDetails.duration
            }
          })
          counter+=1
          onPayloadSegment(counter/segmentCount)
          executeAPIRequest()
        },
        function(err) { 
          console.error("Execute error", err.result.error); 
          if(payloadWorkers > 0) {
            payloadWorkers = 0
            payload = []
            onPayloadFailed(err.result.error)
          }
        });
  
}


}