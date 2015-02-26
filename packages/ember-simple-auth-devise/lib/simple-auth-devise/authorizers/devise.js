import Base from 'simple-auth/authorizers/base';
import Configuration from './../configuration';

/**
  Authenticator that works with the Ruby gem
  [Devise](https://github.com/plataformatec/devise) by sending the `token` and
  `user_email` properties from the session in the `Authorization` header.

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see the README for more information.

  _The factory for this authorizer is registered as
  `'simple-auth-authorizer:devise'` in Ember's container._

  @class Devise
  @namespace SimpleAuth.Authorizers
  @module simple-auth-devise/authorizers/devise
  @extends Base
*/
export default Base.extend({
  /**
    The token attribute name.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#tokenAttributeName`](#SimpleAuth-Configuration-Devise-tokenAttributeName).

    @property tokenAttributeName
    @type String
    @default 'token'
  */
  tokenAttributeName: 'token',

  /**
    The identification attribute name.

    This value can be configured via
    [`SimpleAuth.Configuration.Devise#identificationAttributeName`](#SimpleAuth-Configuration-Devise-identificationAttributeName).

    @property identificationAttributeName
    @type String
    @default 'user_email'
  */
  identificationAttributeName: 'user_email',

  /**
    Whether to log debug messages to the console

    @property logDebugMessages
    @type Boolean
    @default false
  */
  logDebugMessages: false,

  /**
    Authorizes an XHR request by sending the `token` and `user_email`
    properties from the session in the `Authorization` header:

    ```
    Authorization: Token <tokenAttributeName>="<token>", <identificationAttributeName>="<user identification>"
    ```

    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */

  /**
    @method init
    @private
  */
  init: function() {
    this.tokenAttributeName          = Configuration.tokenAttributeName;
    this.identificationAttributeName = Configuration.identificationAttributeName;
    this.logDebugMessages            = Configuration.logDebugMessages;

    if (this.logDebugMessages) {
      Ember.Logger.debug('** Ember Simple Auth Devise ** Inside DeviseAuthorizer#init: tokenAttributeName = ' + this.tokenAttributeName + ', identificationAttributeName = ' + this.identificationAttributeName );
    }
  },

authorize: function(jqXHR, requestOptions) {
    if (this.logDebugMessages) {
      Ember.Logger.debug('** Ember Simple Auth Devise ** Inside DeviseAuthorizer#authorize');
    }

    var userToken          = this.get('session').get(this.tokenAttributeName);
    var userIdentification = this.get('session').get(this.identificationAttributeName);
    if (this.logDebugMessages) {
      Ember.Logger.debug('** Ember Simple Auth Devise ** Inside DeviseAuthorizer#authorize: userToken = ' + userToken + ', userIdentification = ' + userIdentification + ', isAuthenticated = ' + this.get('session.isAuthenticated') );
    }

    if (this.get('session.isAuthenticated') && !Ember.isEmpty(userToken) && !Ember.isEmpty(userIdentification)) {
      var authData = this.tokenAttributeName + '="' + userToken + '", ' + this.identificationAttributeName + '="' + userIdentification + '"';
      if (this.logDebugMessages) {
        Ember.Logger.debug('** Ember Simple Auth Devise ** Inside DeviseAuthorizer#authorize: setting authentication token into request = ');
        Ember.Logger.debug(authData);
      }
      jqXHR.setRequestHeader('Authorization', 'Token ' + authData);
    }
  }
});
