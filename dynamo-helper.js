'use strict';
const AWS = require('aws-sdk')

export class DynamoHelper {
    docClient = new AWS.DynamoDB.DocumentClient()
    table = "Users"
    createUser(user) {
        const params = {
            TableName: this.table,
            Item: user,
            ReturnValues: "ALL_OLD"
        }
        return this.docClient.put(params).promise()
    }

    getUser(id) {
        const params = {
            TableName: this.table,
            Key: {
                "userId": id
            }
        }
        return this.docClient.get(params).promise()
    }
}