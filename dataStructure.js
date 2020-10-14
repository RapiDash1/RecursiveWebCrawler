function linkInfo() {
    this.count = 1;
    this.params = new Set();
}

function displayUrlInfo(keys) {
    console.log(keys);
}

function serializeUrlInfo(urlInfo) {
    return JSON.stringify({
        client: urlInfo.client, 
        params: [...urlInfo.params]
    });
}

module.exports = {linkInfo, displayUrlInfo, serializeUrlInfo};