/* eslint-disable no-undef */
// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongooseSchema = require('mongoose');

  const { Schema } = mongooseClient;
  const posts = new Schema(
    {
      text: { type: String, required: true },
      userID: { type: mongooseSchema.Schema.Types.ObjectId, ref: 'users', required: true },
      community: { type: String, required: true },
      votes: { type: String },
      isUpvoted: { type: Boolean },
      isDownvoted: { type: Boolean }
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model('posts', posts);
};
