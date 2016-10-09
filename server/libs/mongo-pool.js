/**
* Local server
* mongod --dbpath /Users/exit/EXITFolder/work/github/virtualAdvisor_old/server/data
**/

/**
* Remote Server
* $ mongo ds021166.mlab.com:21166/virtualadvisor -u VA -p Stevens@VA.776
**/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ds021166.mlab.com:21166/virtualadvisor"; //remote
//var url = "mongodb://localhost:27017/virtualadvisor"; //local



function MongoPool(){}
  
var p_db;
var option = {
  db:{
    numberOfRetries : 5
  },
  server: {
    auto_reconnect: true,
    poolSize : 40,
    socketOptions: {
        connectTimeoutMS: 500
    }
  },
  replSet: {},
  mongos: {}
};

function initPool(cb){
  MongoClient.connect(url, option, function(err, db) {
    if (err) throw err;

    p_db = db;
    if(cb && typeof(cb) == 'function')
        cb(p_db);
      
    p_db.authenticate( "VA", "Stevens@VA.776", function(err, res) {
      // callback
        console.log("Establish database connection successfully.");
    });
  });
  return MongoPool;
}

MongoPool.initPool = initPool;

function getInstance(cb){
  if(!p_db){
    initPool(cb)
  }
  else{
    if(cb && typeof(cb) == 'function')
      cb(p_db);
  }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;




 