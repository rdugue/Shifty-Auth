'use strict';
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
import { DynamoHelper } from './dynamo-helper'

const response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  })
};
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = process.env.JWT_ALGORITHM
const helper = new DynamoHelper()

module.exports.register = (event, context, callback) => {
  if (event.body) {
    let user = JSON.parse(event.body)
    helper.getAllUsers(user.company)
    .then(res => {
      if (res.Count > 0) {
        response.statusCode = 400
        response.body = JSON.stringify({
          error: "Company Id taken"
        })
        callback(null, response)
      } else {
        bcrypt.genSalt(10, (error, salt) => {
          if (error) {
            callback(new Error(`salting error - ${error}`))
          } else {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) {
                callback(new Error(`hashing error - ${err}`))
              } else {
                user.password = hash
                helper.createUser(user)
                .then(item => {
                  const tokenData = {
                    userId: item.Attributes.userId,
                    position: item.Attributes.position,
                    company: item.Attributes.company
                  }
                  jwt.sign(tokenData, JWT_SECRET, { algorithm: JWT_ALGORITHM }, (error, token) => {
                    if (error) {
                      callback(new Error(`token signing error - ${error}`))
                    } 
                    response.body = JSON.stringify({
                      data: item.Attributes,
                      token: token
                    })
                    callback(null, response)
                  })
                })
                .catch(reason => {
                  response.statusCode = 400
                  response.body = JSON.stringify({
                    error: reason
                  })
                  callback(null, response)
                })
              }
            })
          }
        })
      }
    })
  } else {
    response.statusCode = 400
    response.body = JSON.stringify({
      error: 'No POST body.'
    })
    callback(null, response)
  }
};

module.exports.login = (event, context, callback) => {
  if (event.body) {
    let user = JSON.parse(event.body)
    let db_response = {}
    helper.getUser(user.userId, user.company)
    .then(item => {
      db_response = item.Item
      return bcrypt.compare(user.password, item.Item.password)
    })
    .catch(reason => reject(reason))
    .then(valid => {
      if (valid) {
        const tokenData = {
          userId: db_response.userId,
          position: db_response.position,
          company: db_response.company
        }
        jwt.sign(tokenData, JWT_SECRET, { algorithm: JWT_ALGORITHM }, (error, token) => {
          if (error) {
            callback(new Error(`token signing error - ${error}`))
          } 
          response.body = JSON.stringify({
            data: db_response,
            token: token
          })
          callback(null, response)
        })
      } else {
        response.statusCode = 400
        response.body = JSON.stringify({
          error: 'Invalid credentials'
        })
        callback(null, response)
      }
    })
    .catch(reason => {
      response.statusCode = 400
      response.body = JSON.stringify({
        error: reason
      })
      callback(null, response)
    })
  } else {
    response.statusCode = 400
    response.body = JSON.stringify({
      error: 'No POST body.'
    })
    callback(null, response)
  }
}

module.exports.authorizer = (event, context, callback) => {
  const token = event.authorizationToken
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      callback("Unauthorized: " + error)
    } else {
      callback(null, generatePolicy(decoded.userId, 'Allow', event.methodArn))
    }
  })
  
}

var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  
  authResponse.principalId = principalId;
  if (effect && resource) {
      var policyDocument = {};
      policyDocument.Version = '2012-10-17'; // default version
      policyDocument.Statement = [];
      var statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; // default action
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}