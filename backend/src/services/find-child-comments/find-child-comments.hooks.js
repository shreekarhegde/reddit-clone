module.exports = {
  before: {
    all: [],
    find: [
      // hook => {
      //   createChildrenArray(hook);
      //   // return hook;
      // }
      createStructure()
      // createChildrenArray()
    ],
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
    console.log(hook);
    return new Promise(async (resolve, reject) => {
      console.log('createStructure: start');
      await createChildrenArray(hook);
      console.log('createStructure: end');
      // console.log('createStructure: hook', hook);

      return resolve(hook);
    });
  };
}

function createChildrenArray(hook) {
  return new Promise(async (resolve, reject) => {
    console.log('parent Id------->', JSON.parse(JSON.stringify(hook.params.query)));
    // hook.app
    //   .service('/comments')
    //   .find({ query: hook.params.query })
    //   .then(async comments => {
    let comments = await getComments(hook);
    console.log('child comments------------->', comments);

    // hook['result'] = comments;

    for (let i = 0; i < comments.data.length; i++) {
      hook.params.query = {
        parentCommentID: comments['data'][i]['_id']
      };
      console.log(i);

      // comments['data'][i]['children'] = comments['data'];

      createChildrenArray(hook);
    }

    // hook['result'] = comments;

    return resolve(hook);
    // })
    // .catch(err => {
    //   console.log(err);
    // });
  });
}

function getComments(hook) {
  return hook.app
    .service('/comments')
    .find({ query: hook.params.query })
    .then(comments => {
      // console.log(comments);
      return comments;
    })
    .catch(err => {
      console.log(err);
    });
}
