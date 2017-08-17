'use strict';
const AWS = require('aws-sdk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const docClient = new AWS.DynamoDB.DocumentClient()
const response = {
  statusCode: 200,
  body: JSON.stringify({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  }),
};

module.exports.register = (event, context, callback) => {
  
  callback(null, response);
};
