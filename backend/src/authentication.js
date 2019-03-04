/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
let id = '';
let name = '';
module.exports = function(app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate('jwt')]
    },
    after: {
      create: [
        context => {
          if (context.hasOwnProperty('params')) {
            console.log(context.params);
            id = context.params.user._id;
            name = context.params.user.username;
          }
        },
        hook => {
          hook.result['id'] = id;
          hook.result['username'] = name;
        }
      ]
    }
  });
};
