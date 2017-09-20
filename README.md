# Shifty-Auth
Authentication and authorizationback-end for Shifty applications. Written in Node.js with the 
Serverless Framework.
## Prerequisites
- [Node.js 6.10 or higher](https://nodejs.org/en/)
- [Serverless Framework](https://serverless.com/framework/) (version 1.17.0 or higher)
- Access to an AWS account with credentials for Lambda, API Gateway, and Dynamodb. 
- For now, you will need to deploy the [API](https://github.com/rdugue/Shifty-Serverless) first
for the database to work. 
  - Alternatively, you can create a *User* table in the Dynamodb console with 
the partition key of `userId`.
  - Or you can refer to the [Serverless documentation](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)
on how to edit the *serverless.yml* file to automatically create the required table.
## Installation
- Create a directory/folder and clone the project.
- Run `npm install` in the directory you cloned into.
## Deployment
- Simply use the `serverless deploy` command in the directory you cloned into. 
- You will then need to create the endpoints `/auth/login` and `/auth/register` manually in 
the API Gateway console under the service created if you 
[deployed the API](https://github.com/rdugue/Shifty-Serverless).
  - Alternatively, you can use the individual functions in your own API Gateway service. 