// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongooseSchema = require('mongoose');

  const users = new mongooseClient.Schema(
    {
      email: { type: String },
      username: { type: String },
      password: { type: String, required: true },
      communities: [{ type: mongooseSchema.Schema.Types.ObjectId, ref: 'communities' }]
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model('users', users);
};
