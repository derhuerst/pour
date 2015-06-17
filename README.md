# pour

[![npm version](https://img.shields.io/npm/v/pour.svg)](https://www.npmjs.com/package/pour)
[![bower version](https://img.shields.io/bower/v/pour.svg)](bower.json)
[![build status](https://img.shields.io/travis/derhuerst/pour.svg)](https://travis-ci.org/derhuerst/pour)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/pour.svg)](https://david-dm.org/derhuerst/pour#info=devDependencies)

***pour* is a lightweight JavaScript particle system** able to simulate **particles, emitters and fields**. It is flexible because it has **no rendering code** and works **step-based** instead of time-based.

*pour* has a simple and straightforward API and embraces [prototypal programming](http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object), keeping it **below 4kb (minified)**. In addition, it supports both browser- and node-based environments. *pour* is licensed under the **[MIT license](LICENSE)**.



## Install

If you want to go with the **default build**, download the latest release from [the releases page](https://github.com/derhuerst/pour/releases). **The JavaScript files will be in the `dist` folder.**


## Getting Started

Let's simulate the path of a particle being attracted by a field.

To begin, we set up an empty particle system. A `System` holds all `Particle`s, `Emitter`s and `Field`s together.

```javascript
var system = pour.s();    // shorthand for `new pour.System()`
```

We also set up an `Emitter` that emits `Particle`s and add it to our `System`.

```javascript
var emitter = pour.e({    // shorthand for `new pour.Emitter(…)`
	position: new pour.Vector(250, 250),	// the position of the emitter
	velocity: new pour.Vector(1, 0),		// the direction & velocity of the particles
	spread: Math.PI / 4						// 45 degrees spread (in radians)
});
system.add(emitter);
```

Everytime we call `emit`, the `Emitter` emits a new `Particle`.

```javascript
var particle = emitter.emit();
```

If we add the `Particle` to the `System`, we can compute its path by calling `system.tick()`. Each call to `tick` simulates one atomic step. All `Particle`s will then move according to their current `velocity`.

```javascript
system.add(particle);
system.tick();    // one step further…
```

By adding a `Field`, we can influence all `Particle`s in our `System`. A positive `mass` of a `Field` will attract them, a negative will repulse them.

```javascript
field = pour.f({    // shorthand for `new pour.Field(…)`
	position: pour.v(100, 50)    // shorthand for `new pour.Vector(…)`
});
system.add(field);
system.tick();
```


## Documentation

coming soon!



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/pour/issues).
