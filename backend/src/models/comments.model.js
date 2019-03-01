/* eslint-disable no-undef */
// comments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongooseSchema = require('mongoose');

  const { Schema } = mongooseClient;

  const comments = new Schema(
    {
      text: { type: String, required: true },
      userID: { type: mongooseSchema.Types.ObjectId, ref: 'users', required: true },
      postID: { type: mongooseSchema.Types.ObjectId, ref: 'posts', required: true }
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model('comments', comments);
};
