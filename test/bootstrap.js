const assert = require('assert');
const container = require('../index').BootstrapContainer;
const container2 = require('../index').BootstrapContainer;

describe('shark-di bootstrap tests', function() {

    it('ensure bootstrap container is singleton', function() {
        
        assert.equal(container2, container);

    });

    it('ensure bootstrap container is working', function(done) {
        
        function shuriken(){
             return 'shuriken';
        }

        function ninja(weapon){
            this.toString = function(){
                return 'ninja equiped with ' + weapon;
            }

        }

        container.bind('weapon', shuriken);
        container.bindClass('warrior', ninja)
        container.get(function(err, warrior){

              try {
                  if(err) throw err;

                  assert.equal(warrior.toString(), 'ninja equiped with shuriken');
                  done();
              } catch (error) {
                  done(error);
              }

        });

    });
});