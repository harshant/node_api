# NODE API  
This repository contains the api sturcture of the most basic REST api without using any dependencies!
It uses nodejs core library for all its functionalities.

### Getting Started
Just install nodejs , If you are on Linux (debian) run the following commands
``` $ sudo apt-get install -y nodejs ```

``` $nodejs index.js ```

### Methods accepted and URI
Methods Accepted : GET, POST, PUT, DELETE
Basically it has two handlers : users , token

Parameters Accepted : firstName, lastName, password, phone(should be unique), tosAgreement;


### Example usage
Registering new user
> curl -i -d '{"firstName":"John","lastName":"Cina","password":"thisISaPassword","phone":"5632789654","tosAgreement":true}' http://localhost:3000/users 


### License
This project is licensed under the MIT License 


* This api currently doesnot support any database