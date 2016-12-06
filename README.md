# node-shark-di
Easy to use DI container for node.

## First: Create a shark-di module
    // my-module.js
    const di = require('shark-di');
    const Module = di.Module;


    var main = new Module();

    main.bind('db', function(){

        return function(){
             return {name: 'white shark'}; 
        };

    });

    main.bind('repository', function(db){

         return function(id){
               var data = db();
               data.id = id;
               return data;
         };
    });

    exports = module.exports = main;

## Second: Create a shark-di Container and load your Modules
    // di.js
    const Container = require('shark-di').Container;
    const mainModule = require('./my-module.js');

    var container = new Container();

    container.load([mainModule]);

    exports = module.exports = container;

## Third: Require your container
    // index.js
    const container = require('./di.js');

    container.get(function(err, repository){

        console.log(err);
        console.log(repository(0));

    });
