module.exports = function(method, url){
  return `<div class="requestContainer"> <div class="${method.toLowerCase()}">${method.toUpperCase()}</div> <div class="requestUrl">${url}</div> </div>`
}
