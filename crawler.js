const request = require("request");
const jsdom = require("jsdom");

let websiteMap = new Map();
let websitedToVisit = ["https://medium.com/"];

function linkInfo() {
    this.count = 1;
    this.params = new Set();
}

function getParams(webInfoString) {
    let params = [];
    let paramsInfo = webInfoString.split("&");
    paramsInfo.forEach(pInfo => {
        param = pInfo.split("=");
        params.push(param[0]);
    })
    return params;
}

function addParamsToLink(link, paramsString) {
    let params = getParams(paramsString);
    websiteMap.get(link).count += 1;
    params.forEach(param => {
        websiteMap.get(link).params.add(param);
    });
}

function addLinkToWebsiteMap(link) {
    websiteMap.set(link, new linkInfo()); 
}
/**
  * @desc crawls website
*/
function crawl() {
    if (websitedToVisit.length > 0) {
        const url = websitedToVisit.pop();
        request.get(url, function(drr, res, body) {
            const dom = new jsdom.JSDOM(body);
            dom.window.document.querySelectorAll("a").forEach(linkElement => {
                let link = linkElement.href;
                let splitLinkInfo = link.split("?");
                let baseLink = splitLinkInfo[0];
                if (websiteMap.has(baseLink)) addParamsToLink(baseLink, splitLinkInfo[1]);
                else addLinkToWebsiteMap(baseLink);
            });
            console.log(websiteMap);
        });
    }
}

crawl();