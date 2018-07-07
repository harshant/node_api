/*
 * Files for handlers
 *
 */

 //Defining the handler
var handlers={};

//Ping handler
handlers.ping=function(data,callback){
   callback(200)
};

handlers.notFound =function(data,callback){
	callback(404); //just callbak the response code 404
};
