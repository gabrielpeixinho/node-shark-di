const getParameterNames = require('get-parameter-names');
const RSVP = require('rsvp');


function Module(){
   this.binds = {};
}

Module.prototype = {

    bind: function(paramName, factory){

       this.binds[paramName] = factory;

    },

    bindClass: function(paramName, ctor){
         
       var paramNames = getParameterNames(ctor);
       var paramList = paramNames.join();

       eval(['var f=function('+paramList+'){',
             ' return new ctor('+paramList+');', 
             '}'].join('\n')) ;

       var ctorWraperFactory = f;
       
       this.binds[paramName] = ctorWraperFactory;

    },
    getBinds(){
        return this.binds;
    }
}


function Container(){
   this.module = new Module();
}

Container.prototype = {
   getBinds: function(){
       return this.module.getBinds();
   },

   bind: function (paramName, factory) {
       this.module.bind(paramName, factory);
   },

   bindClass: function (paramName, ctor) {
       this.module.bindClass(paramName, ctor);
   },

   load: function(modules){

      for(var i=0; i < modules.length; i++){
         var module = modules[i];
         var moduleBinds = module.getBinds();

         for(p in moduleBinds){
            this.bind(p, moduleBinds[p]);
         }
      }
   
   },

   get: function(callback){
   
      var factory = callback;

      this.resolve(factory)
          .catch(function(error){
               callback.apply(null, [error]);
          });

   },

   resolve: function(factory){
      var injections = [];
      var dependencies = getParameterNames(factory);


      for(var i=0; i < dependencies.length; i++){
         var dependency = dependencies[i]; 
         var dependencyBind = this.getBinds()[dependency];
         var dependencyResolution = null;


         if(dependencyBind != null){
             dependencyResolution = this.resolve(dependencyBind);
         } 

         var dependencyResolutionIsAPromise = dependencyResolution != null 
                                              && typeof(dependencyResolution.then) == 'function';

         var dependencyResolutionPromise = dependencyResolutionIsAPromise ? 
                                           dependencyResolution : 
                                           this.wrapInPromise(dependencyResolution);

         injections.push(dependencyResolutionPromise);

      }


      var injectionsPromise = RSVP.all(injections).then(function(i){

           return factory.apply(null, i);

      });

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
   Container: Container,
   BootstrapContainer : new Container()
}
