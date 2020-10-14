const redis = require("redis");
const client = redis.createClient({host: "172.17.0.5"});
 
client.on("error", function(error) {
  console.error(error);
});

client.on('connect', function() {
    console.log('Connected to Redis');
});

function setKeyValueToDb(key, value) {
  client.set(key, value);
}

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