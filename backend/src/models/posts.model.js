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
      title: { type: String, required: true },
      text: { type: String },
      userID: { type: mongooseSchema.Schema.Types.ObjectId, ref: 'users', required: true },
      communities: [{ type: mongooseSchema.Schema.Types.ObjectId, ref: 'communities' }],
      votes: { type: Number },
      isUpvoted: { type: Boolean },
      isDownvoted: { type: Boolean }
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model('posts', posts);
};
