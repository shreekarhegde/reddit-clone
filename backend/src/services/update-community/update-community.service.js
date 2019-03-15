// Initializes the `update-community` service on path `/update-community`
const createService = require('./update-community.class.js');
const hooks = require('./update-community.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/update-community', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('update-community');

  service.hooks(hooks);
};
