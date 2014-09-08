# pour

*pour* is a lightweight JavaScript particle system. It can be used to simulate **particles, emitters and fields**.

*pour* is flexible because it has **no rendering code** and works **time-independent**. In addition, *pour* supports both browser- and node-based environments.

## Getting Started

Let's simulate the path of a particle being attracted by a field.

To begin, we set up an empty particle system. A *system* holds all *particles*, *emitters* and *fields* together.

```javascript
var system = new pour.System();
```

We also set up an emitter that emits particles and add it to our system.

```javascript
var emitter = new pour.Emitter({
	position: new pour.Vector(100, 100),	// the position of the emitter
	velocity: new pour.Vector(1, 0),		// the direction of the particles
	spread: 30								// 30 degrees spreading
});
system.add(emitter);
```

Everytime we call `emit`, the emitter emits a new particle.

```javascript
var particle = emitter.emit();
```

If we add the particle to the system, we can compute its path by calling `system.update()`. Because *pour* works time-independent, each call to `update` means that one atomic time period has passed. All *Particles* will then move according to their current `velocity`.

```javascript
system.add(particle);
system.update();    // one time period later..
```

By adding a *field*, we can influence all *particles* in our *system*. A positive `mass` of a *field* will attract *particles*, a negative will repulse them (once `system.update()` get called).

```javascript
field = new pour.Field({
	position: new pour.Vector(100, 50)
});
```

## Documentation

coming soon!