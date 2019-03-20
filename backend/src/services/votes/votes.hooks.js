const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [vote()],
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

function vote() {
  return hook => {
    let postID = hook['params']['query']['postID'];
    let userID = hook['params']['query']['userID'];
    if (hook['params']['query']['text'] === 'upvote') {
      console.log(hook['params']);
      return new Promise((resolve, reject) => {
        hook['app']
          ['service']('/posts')
          .patch({ _id: postID }, { $inc: { upvotes: 1, totalVotes: 1 }, $addToSet: { upvotedBy: userID }, $pull: { downvotedBy: userID } })
          .then(res => {
            console.log('res: votes------------>', res);
            hook['result'] = res;
            return resolve(hook);
          })
          .catch(err => {
            return reject(err);
          });
      });
    } else if (hook['params']['query']['text'] === 'downvote') {
      console.log(hook['params']);
      return new Promise((resolve, reject) => {
        hook['app']
          ['service']('/posts')
          .patch(
            { _id: postID },
            { $inc: { downvotes: 1, totalVotes: -1 }, $addToSet: { downvotedBy: userID }, $pull: { upvotedBy: userID } }
          )
          .then(res => {
            console.log('res: votes------------>', res);
            hook['result'] = res;
            return resolve(hook);
          })
          .catch(err => {
            return reject(err);
          });
      });
    }
  };
}
