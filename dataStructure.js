/**
  * @desc Information to be stored per link
*/
function linkInfo() {
    this.references = 1;
    this.params = new Set();
}


/**
  * @desc Print Url info
*/
function displayUrlInfo(urlInfo) {
    console.log(urlInfo);
}


/**
  * @desc Serialize url info so that it can be stored in database
*/
function serializeUrlInfo(urlInfo) {
  return JSON.stringify({
    "references": urlInfo.references, 
    "params": [...urlInfo.params]
  });
}

module.exports = {linkInfo, displayUrlInfo, serializeUrlInfo};