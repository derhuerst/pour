assert =			require 'assert'





helpers =		require '../src/01-helpers.js'
inherit = helpers.inherit





describe '01-helpers', () ->



	describe 'inherit', () ->

		it 'creates an instance of a class', () ->
			Foo = {}
			Foo.a = 'one'
			Foo.b = 'two'

			f = inherit Foo
			f.b = 'three'

			assert.strictEqual Foo.a, 'one'
			assert.strictEqual Foo.b, 'two'
			assert.strictEqual f.a, 'one'
			assert.strictEqual f.b, 'three'

		it 'creates an instance of a subclass of a class', () ->
			Foo = {}
			Foo.a = 'one'
			Foo.b = 'two'
			Bar = inherit Foo
			Bar.c = 'three'

			b = inherit Bar
			b.b = 'four'

			assert.strictEqual Bar.a, 'one'
			assert.strictEqual Bar.b, 'two'
			assert.strictEqual Bar.c, 'three'
			assert.strictEqual b.a, 'one'
			assert.strictEqual b.b, 'four'
			assert.strictEqual b.c, 'three'

		it 'supports `this` in an instance of a class', () ->
			Foo = {}
			Foo.a = 'one'
			Foo.b = () -> this.a

			f = inherit Foo
			f.a = 'two'

			assert.strictEqual Foo.a, Foo.b()
			assert.strictEqual Foo.b(), 'one'
			assert.strictEqual f.a, f.b()
			assert.strictEqual f.b(), 'two'
