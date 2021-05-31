module.exports = function(code){
  if(Number(code) >= 400) return `<span class="error" style="font-weight: bold">${code}</span>`;
  else return `<span class="success" style="font-weight: bold">${code}</span>`;
}
