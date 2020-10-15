let config = {};
config.requestWaitTime = 0; // Wait time before each request
config.maxConcurrentRequests = 5;
config.redisHost = "redis-server"; // Host name of redis server, same as mentioned in docker-compose.yml
config.baseWebsite = "https://medium.com/"; 
config.maxWebsitesToVisit = -1; // -1 to visit all websites, a non negative number to specify how many websites to visit 

module.exports = {config};