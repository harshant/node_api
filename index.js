/*
 * Primary file of the api
 *
 */

//Dependencies
var http= require('http');
const url =require('url');
const StringDecoder =require('string_decoder').StringDecoder;
const config=require('./config');

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

    //data event handler
    req.on('data',function(data){
      buffer=decoder.write(data);
    });

    //end event handler
    req.on('end',function(){
    	buffer+=decoder.end();

    	//Choose the handler this request should go to ,if not found then go to notFound handler.
        var chooseHandler= typeof(router[trimmedPath])!=='undefined'?router[trimmedPath]:handlers.notFound;

        //Data object to be send to the handler
        var data={
        	'trimmedPath':trimmedPath,
        	'queryStringObject':queryStringObject,
        	'method':method,
        	'headers':headers,
        	'payload':buffer
        };

        //rout the request to the router specified in the handler
        chooseHandler(data,function(statusCode,payload){
            //use the status code called back by the handler, or default to 200
            statusCode=typeof(statusCode)=='number'?statusCode:200;
            
            //use the pyload called back by the handler , or default to an empty object
             payload=typeof(payload)?payload:{};

            //convert the payload to a string
            var payloadString =JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            //log the requested path
		    console.log(" we are sending this response ",statusCode,payload);    	


        });

    });


});

//make the server listen on port config.port
server.listen(config.port,function(){
	console.log("Server is listening on port "+config.port+" and in environment"+config.envName);
});

//Defining the handler
var handlers={};

//Sample handler
handlers.sample=function(data,callback){
   //Callback a http status code, and a payload object
   callback(406,{'name':'sample handler'});
};

handlers.notFound =function(data,callback){
	callback(404); //just callbak the response code 404
};

//Defining a request router
var router={
   'sample':handlers.sample
};
