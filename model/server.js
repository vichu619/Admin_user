var MongoClient = require('mongodb').MongoClient;
const state = {db:null}


module.exports.connect = function (Done){


var url = "mongodb://127.0.0.1:27017";
const dbname='shopping'

MongoClient.connect(url, function(err, data) {
         if (err) {
        console.log("error occured")
        Done(err)
    }

    else{
        console.log("sucesss")

        state.db=data.db(dbname)
        // console.log(state.db)
        Done()
    }
   
  });



}

module.exports.get=()=>{
    return state.db
}