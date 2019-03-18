module.exports = {
  before: {
    all: [],
    find: [createStructure()],
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

function createStructure(option) {
  return function(hook) {
    return new Promise(async (resolve, reject) => {
      console.log('Start');
      let commentService = hook.app.service('/comments');
      let firstLevelQuery = hook.params.query;
      let comments = await createChildrenArray(commentService, firstLevelQuery);
      console.log('first level: createStructure', JSON.parse(JSON.stringify(comments)));
      hook['result'] = comments;
      // console.log('createStructure: hook', hook);
      return resolve(hook);
    });
  };
}

function createChildrenArray(service, query) {
  return new Promise(async resolve => {
    console.log('parent Id------->', JSON.parse(JSON.stringify(query)));

    let comments = await getComments(service, query);
    console.log(' comments: createChildrenArray------------->', JSON.parse(JSON.stringify(comments)));

    if (comments['data'].length > 0) {
      for (let i = 0; i < comments.data.length; i++) {
        console.log(i);
        let iterationLevelQuery = {
          parentCommentID: comments['data'][i]['_id']
        };
        comments['data'][i]['children'] = await createChildrenArray(service, iterationLevelQuery);
      }
      return resolve(comments);
    } else {
      return resolve([]);
    }
  });
}

function getComments(service, query) {
  return new Promise(async (resolve, reject) => {
    return service
      .find({ query: query })
      .then(comments => {
        console.log('get comments: comments----------->', JSON.parse(JSON.stringify(comments)));
        return resolve(comments);
      })
      .catch(err => {
        console.log(err);
        return reject(err);
      });
  });
}
