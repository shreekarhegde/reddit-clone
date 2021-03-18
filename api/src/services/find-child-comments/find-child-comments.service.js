// Initializes the `findChildComments` service on path `/comments`
const createService = require('./find-child-comments.class.js');
const hooks = require('./find-child-comments.hooks');

module.exports = function(app) {
  const paginate = app.get('paginate');

  const options = {
    paginate,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/child-comments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('child-comments');

  service.hooks(hooks);
};
