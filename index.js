/*
 * Primary file of the api
 *
 */

//Dependencies
var http= require('http');
const url =require('url');
const StringDecoder =require('string_decoder').StringDecoder;


//defining server
var server= http.createServer(function(req,res){

	//parse url from req object
     var parsedUrl=url.parse(req.url,true);

	//get the path and request method
     var path =parsedUrl.pathname;
     var trimmedPath=path.replace(/^\/+|\/$/g,"");
     var method=req.method.toLowerCase();

    //Get the query string as an object
    var queryStringObject= parsedUrl.query;

    //Get the request headers
    var headers=req.headers;

    //Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer ='';
    req.on('data',function(data){
      buffer=decoder.write(data);
    });
    req.on('end',function(){
    	buffer+=decoder.end();

	//send the response according to path
	res.end("Hellow world this is my first api\n");

	//log the requested path
	console.log(" request is received with this payload",buffer);    	

    });


});

//make the server listen on port 3000
server.listen(3000,function(){
	console.log("Server is listening on port 3000");
});

