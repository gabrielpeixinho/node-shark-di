
const assert = require('assert');
const di = require('../index');
const Module = di.Module;
const Container = di.Container;


describe('shark-di tests', function(){


   this.timeout(100);

   it('teste basico', function(done){
   


      var mainModule = new Module();

      mainModule.bind('dice', function(){
          return  function(){ return 10; };
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(game){
      
          try{
             assert.equal(100, game());
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   })

});


