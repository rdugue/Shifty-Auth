# Shifty-Auth
Authentication and authorizationback-end for Shifty applications. Written using the 
Serverless Framework for AWS Lambda and API Gateway.
## Prerequisites
- Access to an AWS account with credentials for Lambda, API Gateway, and Dynamodb. 
- For now, you will need to deploy the [API](https://github.com/rdugue/Shifty-Serverless) first
for the database to work. 
..- Alternatively, you can create a *User* table in the Dynamodb console with 
the partition key of `userId`.
..- Or you can refer to the [Serverless documentation](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)
on how to edit the *serverless.yml* file to automatically create the required table.
## Installation
- You will first need to install [Serverless Framework](https://serverless.com/framework/) on your
system(version 1.17.0 or higher). 
- Afterwards, you will need to clone this repository and run `npm install` in the directory 
you cloned into.
## Deployment
- Simply use the `serverless deploy` command in the directory you cloned into. 
- You will then need to create the endpoints `/auth/login` and `/auth/register` manually in 
the API Gateway console under the service created if you 
[deployed the API](https://github.com/rdugue/Shifty-Serverless).
..- Alternatively, you can use the individual functions in your own API Gateway service. 