const request = require("request");
const jsdom = require("jsdom");
const db = require("./db");
const {linkInfo, displayUrlInfo, serializeUrlInfo} = require("./dataStructure");
const {urlBelongsToBaseWebsite} = require("./helpers");


/**
  * @desc Init
*/
let baseWebsite = "https://medium.com/";
let websiteMap = {};
let websitesToVisit = [baseWebsite];
let visited = new Set();
let maxConcurrentRequests = 5;
let concurrentRequests = 0;


/**
  * @desc limitDepth, used only for testing
*/
let limitDepth = 5;


/**
  * @desc converts substring of url to a list of parameters
*/
function getParams(webInfoString) {
    let params = [];
    let paramsInfo = webInfoString.split("&");
    paramsInfo.forEach(pInfo => {
        param = pInfo.split("=");
        params.push(param[0]);
    })
    return params;
}


/**
  * @desc Adds/Updates params to websiteMap and saves key value to database 
*/
function saveParamsToLink(link, paramsString) {
    let params = getParams(paramsString);
    websiteMap[link].references += 1;
    params.forEach(param => {
        websiteMap[link].params.add(param);
    });
    db.setKeyValueToDb(link, serializeUrlInfo(websiteMap[link]));
}


/**
  * @desc Add link to websiteMap with default value
*/
function addLinkToWebsiteMap(link) {
    websiteMap[link] = new linkInfo(); 
}


/**
  * @desc Managing concurrentRequests so that max requests possible is maxConcurrentRequests
*/
function makeConcurrentRequests() {
    concurrentRequests--;
    while (concurrentRequests < maxConcurrentRequests && websitesToVisit.length > 0) {
        concurrentRequests++;
        crawl();
    }
}


/**
  * @desc Make request to a website and get websites associated with it
*/
function makeRequest() {
    const url = websitesToVisit.pop();
    request.get(url, function(err, res, body) {
        if (err) console.error(err);
        const dom = new jsdom.JSDOM(body);
        dom.window.document.querySelectorAll("a").forEach(linkElement => {
            let link = linkElement.href;
            if (urlBelongsToBaseWebsite(link)) {
                let [baseUrl, paramsString] = [...link.split("?")];
                if ((paramsString !== undefined) && websiteMap.hasOwnProperty(baseUrl)) {
                    saveParamsToLink(baseUrl, paramsString);
                }
                else addLinkToWebsiteMap(baseUrl);
                // Dont's visit page that has already been visited
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
        db.printUrlInfo(displayUrlInfo);
        return;
    }
    
    test += 1
    if (websitesToVisit.length > 0) {
        // Timeout to reduce load on website and not get blocked
        setTimeout(makeRequest, 300);
    }
}

/**
  * @desc main
*/
crawl();