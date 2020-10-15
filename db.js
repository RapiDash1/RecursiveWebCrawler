const redis = require("redis");
const {config} = require("./config");
const client = redis.createClient({host: config.redisHost});
 
client.on("error", function(error) {
  console.error(error);
});

client.on('connect', function() {
    console.log('Connected to Redis');
});


/**
  * @desc Set key value pair to Database
*/
function setKeyValueToDb(key, value) {
  client.set(key, value);
}


/**
  * @desc Print every Url's info that is stored in the Database
*/
async function printUrlInfo(displayUrlInfo) {
  client.keys('*', function (err, keys) {
    if (err) return console.log(err);
    keys.forEach(key => {
      client.get(key, function (error, value) {
        if (error) return displayUrlInfo(error);
        let urlInfo = {};
        urlInfo[key] = value;
        displayUrlInfo(urlInfo);
      });
    })
  }); 
}

module.exports = {setKeyValueToDb, printUrlInfo};