const { authenticate } = require('@feathersjs/authentication').hooks;
const _ = require('lodash');

const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [addUserToCommunity()],
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

// function addUserToCommunity() {
//   return hook => {
//     return new Promise((resolve, reject) => {
//       if (_.get(hook, 'params.query')) {
//         // console.log(hook.params);
//         let communityID = hook['data']['communityID'];
//         let userID = hook['params']['payload']['userId'];
//         // hook['params']['query'] = { $set: { communities: communityID } };  //not working
//         console.log('hook------>', hook);

//         //right way?
//         //compare with the example from this url https://github.com/feathersjs-ecosystem/feathers-mongoose/issues/165
//         hook.app
//           .service('/users')
//           .patch({ _id: userID }, { $push: { communities: communityID } })
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

function addUserToCommunity() {
  return hook => {
    // console.log(hook);
    console.log('AdduserToCommunity hook', JSON.parse(JSON.stringify(hook)));
    console.log('subscriber id: addUserToCommunity------->', hook['id']);
    console.log('community id: addUserToCommunity------->', JSON.parse(JSON.stringify(hook['data']['$push']['communities'])));

    return new Promise((resolve, reject) => {
      hook.app
        .service('communities')
        .patch({ _id: JSON.parse(JSON.stringify(hook['data']['$push']['communities'])) }, { $push: { subscribers: hook['id'] } })
        .then(res => {
          console.log('res: addUserToCommunity----->', res);
          hook['result'] = res;
          return resolve(hook);
        })
        .catch(err => {
          return reject(err);
        });
    });
  };
}
