const getParameterNames = require('get-parameter-names');

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

      var injections = this.resolve(factory);

      callback.apply(null, injections);
   
   },

   resolve: function(factory){

      var injections = [];
      var paramNames = getParameterNames(factory);
   

      for(var i=0; i < paramNames.length; i++){
         var param = paramNames[i]; 
         var bind = this.binds[param];
         var value = null;

         if(bind != null){
             var $paramNames = getParameterNames(bind); 
             var $injections = $paramNames.length > 0 ? this.resolve(bind) : [];

             value = bind.apply(null, $injections);
         } 

         injections.push(value);

      }

      return injections;
   }
}


exports = module.exports = {
   Module: Module,
   Container: Container
}
