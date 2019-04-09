/* eslint-disable no-console */
const { authenticate } = require('@feathersjs/authentication').hooks;

const processPosts = require('../../hooks/process-posts');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [filter()],
    get: [],
    create: [processPosts()],
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

function filter() {
  return hook => {
    return new Promise((resolve, reject) => {
      if (hook['params']['query']['filter'] === 'Hot') {
        let query = [
          {
            $project: {
              upvotes: 1,
              downvotes: 1,
              totalVotes: 1,
              title: 1,
              text: 1,
              upvotedBy: 1,
              downvotedBy: 1,
              userID: 1,
              communityID: 1,
              createdAt: 1,
              updatedAt: 1,
              ratio: {
                $divide: [
                  '$upvotes',
                  {
                    $hour: '$createdAt'
                  }
                ]
              }
            }
          },
          { $match: { ratio: { $gte: 5 } } },
          {
            $lookup: {
              from: 'users',
              localField: 'userID',
              foreignField: '_id',
              as: 'userID'
            }
          },
          { $unwind: '$userID' },
          {
            $lookup: {
              from: 'communities',
              localField: 'communityID',
              foreignField: '_id',
              as: 'communityID'
            }
          },
          { $unwind: '$communityID' }
        ];
        hook.app
          .service('posts')
          .Model.aggregate(query)
          .then(res => {
            console.log(res);
            hook['result'] = res;
            return resolve(hook);
          })
          .catch(err => {
            console.log(err);
            return reject(err);
          });
      } else {
        return resolve(hook);
      }
    });
  };
}
