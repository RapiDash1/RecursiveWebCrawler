/**
  * @desc Check if url belongs to base website
*/
function urlBelongsToBaseWebsite(url) {
    return url.search(/https:\/\/[a-zA-Z.]*medium.com\/.*/i) != -1
}

module.exports = {urlBelongsToBaseWebsite};