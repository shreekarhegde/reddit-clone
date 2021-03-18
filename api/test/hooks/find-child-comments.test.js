const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const findChildComments = require('../../src/hooks/find-child-comments');

describe('\'find-child-comments\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: findChildComments()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
