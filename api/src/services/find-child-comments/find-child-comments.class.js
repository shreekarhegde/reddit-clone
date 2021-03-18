/* eslint-disable no-unused-vars */

class FindChildComments {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function(options) {
  return new FindChildComments(options);
};

module.exports.FindChildComments = FindChildComments;
