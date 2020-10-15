/**
  * @desc Check if url belongs to base website
*/
function urlBelongsToBaseWebsite(url) {
    return url.search(/https:\/\/[a-zA-Z.]*medium.com\/.*/i) != -1
}


function printCrawlInfoToConsole(noOfCrawls) {
    if (noOfCrawls == 0) console.log("Started crawling, please sit back enjoy");
    else if (noOfCrawls%10 == 0) console.log("Crawling...... No Of websites crawled: "+noOfCrawls);
}

module.exports = {urlBelongsToBaseWebsite, printCrawlInfoToConsole};