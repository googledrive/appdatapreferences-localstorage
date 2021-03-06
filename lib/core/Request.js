/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('appdatapreferences.Request');

goog.require('goog.net.XhrIo');

/**
 * Request constructor.
 * @constructor
 * @param {String} method     The HTTP method.
 * @param {String} path       The relative path of the request.
 * @param {String} opt_params Optional query parameters.
 */
appdatapreferences.Request = function(method, path, opt_params) {
  this.method = method;
  this.path = path;
  this.params = opt_params || {};
  this.contentType = 'application/json';
  this.headers = {};
}

/**
 * @const
 * @private
 * The base URL of the Google Drive's v2 API.
 * @type {String}
 */
appdatapreferences.Request.DRIVE_BASE_URL_ =
    'https://www.googleapis.com/drive/v2';

/**
 * @const
 * @private
 * The base URL of the Google Drive's v2 upload API.
 * @type {String}
 */
appdatapreferences.Request.DRIVE_UPLOAD_BASE_URL_ =
    'https://www.googleapis.com/upload/drive/v2';

/**
 * Sets the access token.
 * @param  {String} token The access token.
 * @return {Request}      Returns itself.
 */
appdatapreferences.Request.prototype.setToken = function(token) {
  this.token = token;
  return this;
};

/**
 * Sets the content type.
 * @param  {String} type The content type.
 * @return {Request}     Returns itself.
 */
appdatapreferences.Request.prototype.setContentType = function(type) {
  this.contentType = type;
  return this;
};

/**
 * Sets the body.
 * @param  {String} body The body of the request.
 * @return {Request}     Returns itself.
 */
appdatapreferences.Request.prototype.setBody = function(body) {
  this.body = body;
  return this;
};

/**
 * Sets a header.
 * @param  {String} key   The key of the header to set.
 * @param  {String} value The value of the header.
 * @return {Request}      Returns itself.
 */
appdatapreferences.Request.prototype.setHeader = function(key, value) {
  this.headers[key] = value;
  return this;
};

/**
 * Sets the request for upload.
 * @param  {Boolean} isUpload If set, the upload endpoint will be called.
 * @return {Request}          Returns itself.
 */
appdatapreferences.Request.prototype.setForUpload = function(isUpload) {
  this.isUpload = isUpload;
  return this;
};

/**
 * Runs the request.
 * @param  {Function=} opt_callback Optional callback fn.
 */
appdatapreferences.Request.prototype.run = function(opt_callback) {

  var queryParams = [];
  for (var key in this.params || {}) {
    queryParams.push(key + '=' + encodeURI(this.params[key]));
  }

  var url = this.path;
  if (this.path.indexOf('https://') < 0) {
    url = !this.isUpload ? appdatapreferences.Request.DRIVE_BASE_URL_ :
      appdatapreferences.Request.DRIVE_UPLOAD_BASE_URL_;
    url += this.path;
  }
  url += '?' + queryParams.join('&');
  
  this.headers['Authorization'] = 'Bearer ' + this.token || '';
  this.headers['Content-Type'] = this.contentType;
  goog.net.XhrIo.send(url, function(e){
    var err = !e.target.isSuccess() || e.target.getLastErrorCode();
    opt_callback &&
        opt_callback(err, e.target.getResponseJson());
  }, this.method, this.body, this.headers);
};
