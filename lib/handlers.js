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

//User-get
//Requiredd data:phone
//Optional data:none
//@TODO only let an authenticated user access their object ,Don't let them access anyone else
handlers._users.get = function(data,callback){
	//Check that the phone number is valid
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		//Lookup the user
		_data.read('users',phone,function(err,data){
			if(!err && data){
				//Remove the hashed password from the user object before returning it to the requester
				delete data.hashedPassword;
				callback(200,data);
			}else{
			callback(404);
		}
	});
	}else{
		callback(400,{'Error':'Missing rquired field'});
	}
};

//Users - put
//Required data : phone
//Optional data: firstName, lastName, password,(at least one must be present)
//@TODO ONly let authenticate user to update theri own data, Don't let the unauthenticate user update their data.
handlers._users.put = function (data ,callback){
	//Check for the required fields
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length>0? data.payload.firstName.trim() : false; 
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length>0? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length==10? data.payload.phone.trim() : false;  
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length>0? data.payload.password.trim() : false; 

	//Error if the phone is invalid
	if(phone){
		//Error if nothing is sent to update
		if (firstName||lastName||password){
			//Lookup the user
			_data.read('users',phone,function(err,userData){
				if(!err && userData){
					//Update the fiekds necessary
					if(firstName){
						userData.firstName=firstName;
					}
					if(lastName){
						userData.lastName=lastName;
					}
					if(password){
						userData.hashedPassword=helpers.hash(password);
					}
					//Store the new updates
					_data.update('users',phone,userData,function(err){
						if(!err){
							callback(200);
						}else{
							console.log(err);
							callback(500,{'Error':'Could not update the user'});
						}
					});
				}else{
					callback(400,{'Error':'could not found the user with required phonenumber'});
				}
			});
		}
	}
};

//User-delete
//Required field:phone
//@TODO Cleanup any other data file associated with this user
handlers._users.delete = function(data,callback){
	//Check that the phone number is valid
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		//Lookup the user
		_data.read('users',phone,function(err,data){
			if(!err && data){
				_data.delete('users',phone,function(err){
					if(!err){
						callback(200);
					}else{
						callback(500,{'Erro':'Could not delete the specified user'});
					}
				});
			}else{
			callback(404,{'Error':'Could not find ther specified user'});
		}
	});
	}else{
		callback(400,{'Error':'Missing rquired field'});
	}
};

//Tokens
handlers.tokens = function(data,callback){
	var accepatableMethods = ['post','get','put','delete'];
	if(accepatableMethods.indexOf(data.method)>-1){
		handlers._tokens[data.method](data,callback);
	}else{
		callback(405);
	}
}

//Containers for all the Tokens methods
handlers._tokens={};

//Tokens - post
//Requied data: phone ,password
//Optional data:none
handlers._tokens.post=function(data,callback){
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length ==10 ? data.payload.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false ;
	if(phone && password){
		//Lookup the user who matches that phone number
		_data.read('users',phone,function(err,userData){
			if(!err && userData){
				//Hash the sent password and compare it with the user object saved in the users file
				var hashedPassword = helpers.hash(password);
				if(hashedPassword == userData.hashedPassword){
					//If valid ,create a new token with a random number and set an expieation date 1 hr ahead of the time of creation
					var tokenId = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 *60;
					var tokenObject = {
						'phone' : phone,
						'id' : tokenID,
						'expires' : expires
					};

					//Store the token
					_data.create('tokens',tokenId,tokenObject,function(err){
						if(!err && tokenObject){
							callback(200,tokenObject);
						}else{
							callback(400,{'Error':'Authenication token could not be created'});
						}
					})
				}else{
					callback(400,{'Error':'Password did not match the specified user\'s stored password'});
				}
			}else{
				callback(400,{'Error':'Could not find the specified user'});
			}
		});
	} else{
		callback(400,{'Error':'Mi'})
	}
};

//Ping handler
handlers.ping=function(data,callback){
   callback(200)
};

handlers.notFound =function(data,callback){
	callback(404); //just callbak the response code 404
};


//Export the module
module.exports=handlers;