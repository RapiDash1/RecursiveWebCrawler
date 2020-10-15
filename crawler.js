const db = require("./db");
const jsdom = require("jsdom");
const request = require("request");
const {config} = require("./config");
const {urlBelongsToBaseWebsite, printCrawlInfoToConsole} = require("./helpers");
const {linkInfo, displayUrlInfo, serializeUrlInfo} = require("./dataStructure");


/**
  * @desc Init
*/
let noOfCrawls = 0;
let websiteMap = {};
let visited = new Set();
let concurrentRequests = 0;
let websitesToVisit = [config.baseWebsite];


/**
  * @desc limitNoOfCrawls, used only for testing
*/
let limitNoOfCrawls = 30;


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
    while (concurrentRequests < config.maxConcurrentRequests && websitesToVisit.length > 0) {
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

function printUrlInfoAndReturn() {
    db.printUrlInfo(displayUrlInfo);
    return;
}


/**
  * @desc crawls website
*/
function crawl() {
    if (config.maxWebsitesToVisit != -1) {
      if (noOfCrawls >= config.maxWebsitesToVisit) return printUrlInfoAndReturn();
    }
    printCrawlInfoToConsole(noOfCrawls);
    noOfCrawls += 1
    if (websitesToVisit.length == 0) return printUrlInfoAndReturn();
    setTimeout(makeRequest, config.requestWaitTime);
}


/**
  * @desc main
*/
crawl();