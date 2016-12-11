const getParameterNames = require('get-parameter-names');
const RSVP = require('rsvp');

function Module(){
   this.binds = {};
}

Module.prototype = {

    bind: function(paramName, factory){

       this.binds[paramName] = factory;
    }
}


function Container(){
   this.binds = {};
}

Container.prototype = {

   load: function(modules){


      for(var i=0; i < modules.length; i++){
         var m = modules[i];
      
         for(p in m.binds){
            this.binds[p] = m.binds[p];
         }
      }
   
   },

   get: function(callback){
   
      var factory = callback;

      this.resolve(factory)
          .then(function(injections){
               callback.apply(null, injections);
          });

   
   },

   resolve: function(factory){

      var injections = [];
      var paramNames = getParameterNames(factory);
   

      for(var i=0; i < paramNames.length; i++){
         var param = paramNames[i]; 
         var bind = this.binds[param];
         var value = null;

         if(bind != null){

             var $injections = this.resolve(bind);


             value = $injections.then(function(injections){
                return bind.apply(null, injections);
             });
                
         } 

         var promise = value != null && typeof(value.then) == 'function' ? value : this.wrapInPromise(value);

         injections.push(promise);

      }

      var injectionsPromise = RSVP.all(injections);

      return injectionsPromise
   },

   wrapInPromise: function(value){
       return new Promise(function(resolve, reject){
           resolve(value); 
       });
   }
}


exports = module.exports = {
   Module: Module,
   Container: Container
}
