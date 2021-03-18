const assert = require('assert');
const app = require('../../src/app');

describe('\'update-community\' service', () => {
  it('registered the service', () => {
    const service = app.service('update-community');

    assert.ok(service, 'Registered the service');
  });
});
