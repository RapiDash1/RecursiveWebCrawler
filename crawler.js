const request = require("request");
const jsdom = require("jsdom");
const db = require("./db");
const {linkInfo, displayUrlInfo, serializeUrlInfo} = require("./dataStructure");

let baseWebsite = "https://medium.com/";
let websiteMap = {};
let websitesToVisit = [baseWebsite];
let visited = new Set();
let maxConcurrentRequests = 5;
let concurrentRequests = 0;

/**
  * @desc Test
*/
let limitDepth = 400;

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
    websiteMap[link].count += 1;
    params.forEach(param => {
        websiteMap[link].params.add(param);
    });
}

function addLinkToWebsiteMap(link) {
    websiteMap[link] = new linkInfo(); 
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
            if (link.search(/https:\/\/[a-zA-Z.]*medium.com\/.*/i) != -1) {
                let splitLinkInfo = link.split("?");
                let baseLink = splitLinkInfo[0];
                if (splitLinkInfo.length > 1 && websiteMap.hasOwnProperty(baseLink)) {
                    addParamsToLink(baseLink, splitLinkInfo[1]);
                }
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
        console.log("Length: "+Object.keys(websiteMap).length);
        Object.keys(websiteMap).forEach(baseUrl => {
            let urlInfo = websiteMap[baseUrl];
            if (urlInfo) {
                db.setKeyValueToDb(baseUrl, serializeUrlInfo(urlInfo));
            }
        });
        db.printUrlInfo(displayUrlInfo);
        return;
    }
    
    test += 1
    if (websitesToVisit.length > 0) {
        setTimeout(makeRequest, 300);
    }
}

crawl();