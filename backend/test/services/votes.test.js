const assert = require('assert');
const app = require('../../src/app');

describe('\'votes\' service', () => {
  it('registered the service', () => {
    const service = app.service('votes');

    assert.ok(service, 'Registered the service');
  });
});
