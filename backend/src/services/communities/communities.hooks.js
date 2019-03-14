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
    create: [],
    update: [],
    patch: [addCommunityToUser()],
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

// function addCommunityToCreator() {
//   return hook => {
//     return new Promise((resolve, reject) => {
//       if (_.get(hook, 'params.payload.userId') && _.get(hook, 'result._id')) {
//         let communityID = hook['result']['_id'];
//         console.log('communityID---->', communityID);
//         hook.app
//           .service('/users')
//           .patch({ _id: hook['params']['payload']['userId'] }, { $push: { communities: communityID } })
//           .then(res => {
//             hook['result'] = res;
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       }
//       return resolve(hook);
//     });
//   };
// }

function addCommunityToUser() {
  return hook => {
    return new Promise((resolve, reject) => {
      if (_.get(hook, 'params.payload.userId') && _.get(hook, 'result._id')) {
        let communityID = hook['result']['_id'];
        console.log('communityID: addCommunityToUser---->', communityID);
        hook.app
          .service('/users')
          .patch({ _id: hook['params']['payload']['userId'] }, { $push: { communities: communityID } })
          .then(res => {
            hook['result'] = res;
            return resolve(hook);
          })
          .catch(err => {
            console.log(err);
            return reject(err);
          });
      }
    });
  };
}
