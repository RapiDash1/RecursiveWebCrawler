const request = require("request");
const jsdom = require("jsdom");

let baseWebsite = "https://medium.com/";
let websiteMap = new Map();
let websitesToVisit = [baseWebsite];
let visited = new Set();
let maxConcurrentRequests = 5;
let concurrentRequests = 0;

/**
  * @desc Test
*/
let limitDepth = 10;

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

function makeConcurrentRequests() {
    concurrentRequests--;
    while (concurrentRequests < maxConcurrentRequests && websitesToVisit.length > 0) {
        concurrentRequests++;
        crawl();
    }
}

function makeRequest() {
    const url = websitesToVisit.pop();
    request.get(url, function(err, res, body) {
        if (err) console.error(err);
        const dom = new jsdom.JSDOM(body);
        dom.window.document.querySelectorAll("a").forEach(linkElement => {
            let link = linkElement.href;
            if (link.startsWith(baseWebsite)) {
                let splitLinkInfo = link.split("?");
                let baseLink = splitLinkInfo[0];

                if (splitLinkInfo.length > 1 && websiteMap.has(baseLink)) addParamsToLink(baseLink, splitLinkInfo[1]);
                else addLinkToWebsiteMap(baseLink);

                if (!visited.has(link)) {
                    websitesToVisit.push(link);
                    visited.add(link);
                }
            }
        });
        makeConcurrentRequests();
    });
}

let test = 0;

/**
  * @desc crawls website
*/
function crawl() {
    if (test >= limitDepth) {
        console.log(websiteMap);
        return;
    }
    
    test += 1
    if (websitesToVisit.length > 0) {
        setTimeout(makeRequest, 500);
    }
}

crawl();