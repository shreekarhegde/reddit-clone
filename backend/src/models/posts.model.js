/* eslint-disable no-undef */
// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongooseSchema = require('mongoose');

  const { Schema } = mongooseClient;
  const posts = new Schema({
    title: { type: String, required: true },
    text: { type: String },
    userID: { type: mongooseSchema.Schema.Types.ObjectId, ref: 'users', required: true },
    communityID: { type: mongooseSchema.Schema.Types.ObjectId, ref: 'communities', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    // upvotedBy: [{ type: mongooseSchema.Schema.Types.ObjectId, ref: 'users' }],
    upvotedBy: [
      {
        userID: { type: mongooseSchema.Schema.Types.ObjectId, ref: 'users' },
        upvotedAt: { type: Date, default: new Date() }
      }
    ],
    downvotedBy: [{ type: mongooseSchema.Schema.Types.ObjectId, ref: 'users' }],
    createdAt: { type: Date, default: new Date(), required: true }
  });

  return mongooseClient.model('posts', posts);
};
