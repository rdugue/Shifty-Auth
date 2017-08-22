'use strict';
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import { DynamoHelper } from './dynamo-helper'

const response = {
  statusCode: 200,
  body: JSON.stringify({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  }),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': True,
    'Content-Type': 'application/json'
  }
};
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = [process.env.JWT_ALGORITHM]
const helper = new DynamoHelper()

module.exports.register = (event, context, callback) => {
  if (event.body) {
    let user = JSON.parse(event.body)
  } else {
    response.statusCode = 400
    response.body = JSON.stringify({ error: 'No POST body.' })
    callback(response)
  }
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash
    return helper.createUser(user)
  })
  .then(item => {
    const tokenData = {
      userId: item.userId,
      position: item.position,
      company: item.company
    }
    response.body = JSON.stringify({
      data: item,
      token: jwt.sign(tokenData, JWT_SECRET, JWT_ALGORITHM)
    })
    callback(null, response)
  })
  .catch(reason => {
    response.statusCode = 400
    response.body = JSON.stringify({ error: reason })
    callback(response)
  })
};

module.exports.login = (event, context, callback) => {
  if (event.body) {
    let user = JSON.parse(event.body)
  } else {
    response.statusCode = 400
    response.body = JSON.stringify({ error: 'No POST body.' })
    callback(response)
  }
  helper.getUser(user.userId)
  .then(item => {
    return bcrypt.compare(user.password, item.Item.password)
  })
  .catch(reason => reject(reason))
  .then(valid => {
    if (valid) {
      const tokenData = {
        userId: item.userId,
        position: item.position,
        company: item.company
      }
      response.body = JSON.stringify({
        data: item,
        token: jwt.sign(tokenData, JWT_SECRET, JWT_ALGORITHM)
      })
      callback(null, response)
    } else {
      response.statusCode = 300
      response.body = JSON.stringify({ error: 'Invalid credentials'})
      callback(response)
    }
  })
  .catch(reason => {
    response.statusCode = 400
    response.body = JSON.stringify({ error: reason })
    callback(response)
  })
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