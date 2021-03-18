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
              upvoteDetails: {
                $filter: {
                  input: '$upvotedBy',
                  as: 'upVote',
                  cond: {
                    $lte: [
                      {
                        $subtract: [new Date(), '$$upVote.upvotedAt']
                      },
                      1980000
                    ]
                  }
                }
              },
              document: '$$ROOT'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ['$$ROOT', '$document']
              }
            }
          },
          { $project: { document: 0 } },
          {
            $project: {
              count: { $size: '$upvoteDetails' },
              document: '$$ROOT'
            }
          },
          {
            $sort: {
              count: -1
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ['$$ROOT', '$document']
              }
            }
          },
          {
            $project: {
              document: 0
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userID',
              foreignField: '_id',
              as: 'userID'
            }
          },
          {
            $unwind: {
              path: '$userID',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'communities',
              localField: 'communityID',
              foreignField: '_id',
              as: 'communityID'
            }
          },
          {
            $unwind: {
              path: '$communityID',
              preserveNullAndEmptyArrays: true
            }
          }
        ];
        dbOperation(hook, 'posts', query, resolve, reject);
      } else if (hook['params']['query']['filter'] === 'Controversial') {
        let query = [
          {
            $group: {
              _id: '$postID',
              count: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: '_id',
              as: 'post'
            }
          },
          { $unwind: '$post' },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: [{ count: '$count' }, '$post'] }
            }
          },
          {
            $project: {
              ratio: {
                $divide: ['$upvotes', '$count']
              },
              document: '$$ROOT'
            }
          },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: ['$$ROOT', '$document'] }
            }
          },
          {
            $project: {
              document: 0
            }
          },
          {
            $match: {
              ratio: {
                $gte: 0,
                $lt: 0.3
              },
              count: { $gt: 5 }
            }
          },
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

        dbOperation(hook, 'comments', query, resolve, reject);
      } else {
        return resolve(hook);
      }
    });
  };
}

function dbOperation(hook, service, query, resolve, reject) {
  hook.app
    .service(service)
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
}
