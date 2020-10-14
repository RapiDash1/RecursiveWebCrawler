const redis = require("redis");
const client = redis.createClient({host: "172.17.0.5"});
 
client.on("error", function(error) {
  console.error(error);
});

client.on('connect', function() {
    console.log('Connected to Redis');
});