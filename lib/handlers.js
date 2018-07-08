/*
 * File containing Request handlers
 *
 */

 //Dependencies
 const _data = require('./data');
 const helpers = require('./helpers');

 //Defining the handler
var handlers={};

//Users
handlers.users = function(data,callback){
	var accepatableMethods = ['post','get','put','delete'];
	if(accepatableMethods.indexOf(data.method)>-1){
		handlers._users[data.method](data,callback);
	}else{
		callback(405);
	}
}
//Container for the users submethods
handlers._users = {};

//Users-post
//Required :firstName, lastName, phone, password, tosAgreement
//Optional data:none
handlers._users.post = function(data,callback){
	//Check that all required fields are filled out
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length>0? data.payload.firstName.trim() : false; 
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length>0? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length==10? data.payload.phone.trim() : false;  
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length>0? data.payload.password.trim() : false; 
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false; 

	if(firstName && lastName && phone && password && tosAgreement){
		//make sure that the user doesnot already exist
		_data.read('users',phone,function(err,data){
			if(err){
				//Hash the password
				var hashedPassword = helpers.hash(password);

				if(hashedPassword){
	  				//Create the user object
					var userObject = {
						'firstName' : firstName,
						'lastName' : lastName,
						'phone' : phone,
						'hashedPassword' : hashedPassword,
						'tosAgreement' : true
					};

					//Store the user
					_data.create('users',phone,userObject,function(err){
						if(!err){
							callback(200);
						}else{
							console.log(err);
							callback(500,{'Error':'Could not create the new user'});
						}
					});
				}else{
					callback(500,{'Error':'password cannot be hashed'});
				}
			}else{
				//user already exitst
				callback(400, {'Error':'A user with that phone number already exist'});
			}
		});
	}else{
		//Some fields are missing
		callback(400,{'Error':'All fields are not present, Please enter all the required fields'});
	}
}
//Ping handler
handlers.ping=function(data,callback){
   callback(200)
};

handlers.notFound =function(data,callback){
	callback(404); //just callbak the response code 404
};


//Export the module
module.exports=handlers;