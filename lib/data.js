/* 
 * Library for storing and editing data
 *
 */



 //Dependencies
 const fs =require('fs');
 const path=require('path');

 //Container for the module (to be exported)
 var lib={};

 //Base directory of the data folder
 lib.baseDir = path.join(__dirname,'/../.data/');

 //Write data to the file
 lib.create = function(dir,file,data,callback){
 	//Open the file for writing
 	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
 		if(!err && fileDescriptor){
 			//Convert data to string
 			var stringData = JSON.stringify(data);

 			//Write to file and close it
 			fs.writeFile(fileDescriptor,stringData,function(err){
 				if(!err && fileDescriptor){
 					fs.close(fileDescriptor,function(err){
 						if(!err){
 							callback(false);
 						}else{
 							callback('Error closing new file');
 						}
 					});
 				}else{
 					callback('Error writing to new file');
 				}
 			});
 		}else{
 				callback("Could not create new file , it may already exit");
 			}
 	});
 };

//Read data fom the file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
		callback(err,data);
	});
};

//Update data inside a file
lib.update = function(dir,file,data,callback){
	//Open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			//Convert data to string 
			var stringData = JSON.stringify(data);

			//Truncate the file
			fs.truncate(fileDescriptor,function(err){
				if(!err){
					//Write to the file and close it
					fs.writeFile(fileDescriptor,stringData,function(err){
						if(!err){
							fs.close(fileDescriptor,function(err){
								if(!err){
									callback(false);
								}else{
									callback('error closing the file');0
								}
							});
						}else{
							callback('error writing to file');
						}
					});
				}else{
					callback('error truncating file');
				}
			});
		}else{
			callback('could not open the file for updating , it may not exits');
		}
	});
};

//Delete the file
lib.delete = function(dir,file,callback){
	//Unlink the file
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err){
			callback(false);
		}else{
			callback('Error deleting file');
		}
	});
};

//Export the module
module.exports = lib;

