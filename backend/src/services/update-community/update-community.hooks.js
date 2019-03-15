const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [addUserToCommunity(), addCommunityToUser()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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

function addUserToCommunity() {
  return hook => {
    // console.log(hook);
    console.log('AdduserToCommunity hook', JSON.parse(JSON.stringify(hook)));
    console.log('community id: addUserToCommunity------->', hook['params']['query']['id']);
    console.log('subscriber id: addUserToCommunity------->', JSON.parse(JSON.stringify(hook['data']['subscriber'])));

    let communityID = hook['params']['query']['id'];
    let userID = JSON.parse(JSON.stringify(hook['data']['subscriber']));
    return new Promise((resolve, reject) => {
      hook.app
        .service('communities')
        .patch({ _id: communityID }, { $push: { subscribers: userID } })
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

function addCommunityToUser() {
  return hook => {
    console.log('addCommunityToUser: hook query modification:', hook);
    console.log('AdduserToCommunity hook', JSON.parse(JSON.stringify(hook)));
    console.log('subscriber id: addUserToCommunity------->', JSON.parse(JSON.stringify(hook['data']['subscriber'])));

    let communityID = hook['params']['query']['id'];
    let userID = JSON.parse(JSON.stringify(hook['data']['subscriber']));

    return new Promise((resolve, reject) => {
      hook.app
        .service('users')
        .patch({ _id: userID }, { $push: { communities: communityID } })
        .then(res => {
          return resolve(hook);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  };
}

function addPostToCommunity() {
  return hook => {
    let communityID = hook['params']['id'];
    console.log(JSON.parse(JSON.stringify(hook)));
  };
}
