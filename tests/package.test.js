import test from 'node:test';
import assert from 'node:assert/strict';
import pkg from '../package.json' with { type: 'json' };

test('package name should be webapp', () => {
  assert.strictEqual(pkg.name, 'webapp');
});
