'use strict';
const AWS = require('aws-sdk')

export class DynamoHelper {
    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient()
        this.table = "Users"
    }
    createUser(user) {
        const params = {
            TableName: this.table,
            Item: user,
            ReturnValues: "ALL_OLD"
        }
        return this.docClient.put(params).promise()
    }

    getUser(id, company) {
        const params = {
            TableName: this.table,
            Key: {
                "userId": id,
                "company": company
            }
        }
        return this.docClient.get(params).promise()
    }
}