/*
 *Create and export configuration variables
 *
 */


 //Container for all the environments
 var environments={};

 //staging (default) environment
 environments.staging={
 	'port':3000,
 	'envName':'staging'
 };

 //Production environment
 environments.production={
 	'port':5000,
 	'envName':'production'
 };

 //Determine which environment was passed as a command-line argument , default will be staging environment
 var currentEnvironment = typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():'';

 //Check that the current environment is one of the environments above ,if not , default is staging
 var environmentToExport=typeof(environments[currentEnvironment])=='object'?environments[currentEnvironment]:environments.staging;

 module.exports =environmentToExport;