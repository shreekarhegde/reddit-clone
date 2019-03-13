// communities-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');

  const { Schema } = mongooseClient;
  const communities = new Schema(
    {
      name: { type: String },
      title: { type: String },
      description: { type: String },
      rules: { type: String }
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model('communities', communities);
};
