/* eslint-disable no-unused-vars */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const decode = require('jwt-decode');

module.exports = function(options = {}) {
  return async context => {
    if (context.hasOwnProperty('params')) {
      const { params } = context;
      const jwt = params.headers.authorization;
      const payload = decode(jwt);
      context['data']['userID'] = payload.userId;
    }
    return context;
  };
};
