var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ds021166.mlab.com:21166/virtualadvisor";
//var url = "mongodb://localhost:27017/virtualadvisor";
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
        console.log("complete");
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