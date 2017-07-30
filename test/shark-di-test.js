
const assert = require('assert');
const RSVP = require('rsvp');
const Promise = RSVP.Promise;
const di = require('../index');
const Module = di.Module;
const Container = di.Container;



describe('shark-di tests', function(){


   this.timeout(100);

   it('should resolve bind factory', function(done){
   


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


      container.get(function(err, game){
      
          try{
             assert.equal(100, game());
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   });


   it('should resolve bind factory with two parameters', function(done){
   

      var mainModule = new Module();
      var objectA = {info: 'objectA'};
      var objectB = {info: 'objectB'};

      mainModule.bind('a', function(){ return  objectA; });
      mainModule.bind('b', function(){ return  objectB; });
   
      var container = new Container();

      container.load([mainModule]);

      container.get(function(err, a, b){
      
          try{
             assert.equal(a, objectA);
             assert.equal(b, objectB);
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   });

   it('should resolve bind factory with three parameters', function(done){
   

      var mainModule = new Module();
      var objectA = {info: 'objectA'};
      var objectB = {info: 'objectB'};
      var objectC = {info: 'objectC'};

      mainModule.bind('a', function(){ return  objectA; });
      mainModule.bind('b', function(){ return  objectB; });
      mainModule.bind('c', function(){ return  objectC; });
   
      var container = new Container();

      container.load([mainModule]);

      container.get(function(err, a, b, c){
      
          try{
             assert.equal(a, objectA);
             assert.equal(b, objectB);
             assert.equal(c, objectC);
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   });

   it('should resolve many dependencies level', function(done){
   

      var mainModule = new Module();

      mainModule.bind('a', function(b){ return  b * 10; });
      mainModule.bind('b', function(c){ return  c * 2; });
      mainModule.bind('c', function(){ return  5; });
      mainModule.bind('x', function(a, b, c){ return  a + b + c; });
   
      var container = new Container();

      container.load([mainModule]);

      container.get(function(err, a, x){
      
          try{
             assert.equal(a, 100);
             assert.equal(x, 115);
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   });

   it('should resolve promise based factory', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){

          var dice = function(){
             return 10; 
          }

          return new Promise(function(resolve, reject){
              resolve(dice);
          });
          
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }

      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
          try{
             assert.equal(100, game());
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   })



   it('should fill "err" parameter when factory throws an exception.', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){
         throw new Error('Error at creating dice.');
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
         try{
          assert.ok(err);
          assert.ok(err instanceof Error);
          assert.equal(err.message, 'Error at creating dice.');
          done();
         }
         catch(ex){
            done(ex);
         }

      });


   });


   it('should fill "err" parameter when promise reject.', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){
         return new Promise(function(resolve, reject){
              reject(new Error('Error at creating dice.'));
         });
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
         try{
          assert.ok(err);
          assert.ok(err instanceof Error);
          assert.equal(err.message, 'Error at creating dice.');
          done();
         
         }
         catch(ex){
            done(ex);
         }

      });


   });


   it('should resolve bind to a class (constructor)', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){

          var dice = function(){
             return 10; 
          }

          return dice;
          
      });

      var gameClass = function(dice){
      
          this.dice = dice;
          this.play = function(){
              return this.dice()*10; 
          };

      };

      mainModule.bindClass('game', gameClass);
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
          try{
             assert.equal(100, game.play());
             assert.ok(game instanceof gameClass);
             assert.ok(game.constructor === gameClass);
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   })

});


