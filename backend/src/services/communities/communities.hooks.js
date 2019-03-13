const { authenticate } = require('@feathersjs/authentication').hooks;
const _ = require('lodash');
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addCreatorToCommunity()],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function addCreatorToCommunity() {
  return hook => {
    return new Promise((resolve, reject) => {
      if (_.get(hook, 'params.payload.userId') && _.get(hook, 'result._id')) {
        let communityID = hook['result']['_id'];
        hook.app
          .service('/users')
          .patch({ _id: hook['params']['payload']['userId'] }, { $push: { communities: communityID } })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
      return resolve(hook);
    });
  };
}
