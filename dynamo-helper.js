'use strict';
const AWS = require('aws-sdk')

export class DynamoHelper {
    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient()
        this.table = "User"
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
    getAllUsers(company) {
        const params = {
            TableName: this.table,
            FilterExpression: "#cp = :company",
            ExpressionAttributeNames: {
                "#cp": "company"
            },
            ExpressionAttributeValues: {
                ":company": company
            }
        }
        return this.docClient.scan(params).promise()
    }
}