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
    var payload = fullPayload.slice(0, 50).map(id => "&id="+id).join("")
    
    if(payload.length == 0) {
      payloadWorkers -= 1
      if(payloadWorkers==0) onPayloadDelivered(_apiData) 
      return
    }
    fullPayload = fullPayload.slice(50)
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics%2Cstatus"+payload+"&key=AIzaSyAwPHCX3POkrRAeqqir-op4yTSgtxKyRbY", true);
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
         if(xhr.status == 200)
          parseResult(JSON.parse(xhr.response));
         else
          handleError(JSON.parse(xhr.response).error);
      }
    };
    xhr.send(null); 
    
    function parseResult(response) {
      response.items.forEach(function(vid) {
        if(!vid.id || !vid.status) return
        if(vid.status.privacyStatus != "public") return
        if(!vid.status.publicStatsViewable) return
        if(!vid.statistics.likeCount || !vid.statistics.dislikeCount || !vid.statistics.viewCount || !vid.statistics.commentCount) return
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
    }
    function handleError(err) { 
      console.error("Execute error", err); 
      if(payloadWorkers > 0) {
        payloadWorkers = 0
        fullPayload = []
        onPayloadFailed(err)
      }
    }
  
}


}