# node-shark-di
Easy to use, non-intrusive and friendly dependency-injection (DI) container for node.

## NPM Install globally

```bash
    $ npm install -g shark-di
```
## NPM Install only project

```bash
    $ npm install shark-di --save
```

## Basic Usage

You can get the complete sample here [node-shark-di-sample](https://github.com/gabrielpeixinho/node-shark-di-sample)

```javascript

    const container = require('shark-di').BootstrapContainer;

    // weapon factory
    function sword(){
        return {name: 'sword', damage: 2.5};
    }

    // warrior constructor
    function ninja(weapon) {
        this.weapon = weapon;
        this.attack = function(){
            console.log('attack using ' + this.weapon.name + ': ' + this.weapon.damage + ' damage');
        } 
    }

    container.bind('weapon', sword); 
    container.bindClass('warrior', ninja);

    container.get(function(err, warrior){

        if(err)
        console.log(err);
        else
        warrior.attack();

    });
```


## Promise based factories

Just return a [promise/A+](https://promisesaplus.com/) in your factory.

```javascript
 
    container.bind('weapon', function(){

        return promise_a_plus;

    });
```

Sample using RSVP Promise/A+ Library

```javascript
    
    const RSVP = require('rsvp');
    
    container.bind('weapon', function(){

        return new RSVP.Promise(function(resolve, reject){
             resolve({name: 'shuriken',  damage: 1.0}); 
        });

    });
 ```
