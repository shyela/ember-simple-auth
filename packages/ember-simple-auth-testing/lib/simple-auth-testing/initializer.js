import TestAuthenticator from 'simple-auth-testing/authenticators/test';

export default {
  name:       'simple-auth-testing',
  before:     'simple-auth',
  initialize: function(container, application) {
    application.register('simple-auth-authenticator:test', TestAuthenticator);
  }
};
