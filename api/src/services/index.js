const users = require('./users/users.service.js');
const posts = require('./posts/posts.service.js');
const comments = require('./comments/comments.service.js');
const findChildComments = require('./find-child-comments/find-child-comments.service.js');
const communities = require('./communities/communities.service.js');
const updateCommunity = require('./update-community/update-community.service.js');
const votes = require('./votes/votes.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(posts);
  app.configure(comments);
  app.configure(findChildComments);
  app.configure(communities);
  app.configure(updateCommunity);
  app.configure(votes);
};
