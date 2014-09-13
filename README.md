# pour

*pour* is a lightweight JavaScript particle system able to simulate **particles, emitters and fields**. It is flexible because it has **no rendering code** and works **time-independent**. In addition, *pour* supports both browser- and node-based environments.


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

If we add the `Particle` to the `System`, we can compute its path by calling `system.tick()`. Because *pour* works time-independent, each call to `tick` means that one atomic time period has passed. All `Particle`s will then move according to their current `velocity`.

```javascript
system.add(particle);
system.tick();    // one time period later…
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