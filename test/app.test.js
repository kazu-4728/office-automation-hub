import test from 'node:test'
import assert from 'node:assert'
import app from '../dist/_worker.js'

test('GET / should return 200', async () => {
  const res = await app.request('/');
  assert.strictEqual(res.status, 200);
});
