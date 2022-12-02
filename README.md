\

## Project Introduction

Duke Patient Portal is a simple low-cost SaaS offering intended for use by Patients and Health Providers in developing nations and emerging economies. The solution allows Patients to manage their health provider information and simple workflow such as scheduling visits. We deliver a Proof-of-Concept (POC) application with a MVP feature set consisting of user login/authentication (SSO/SSL/TLS/MFA), modern web UI, GraphQL APIs, and a microservices/lambda style. We  designed and develop the software as a low-cost, scalable, available, distributed, robust, and secure app in the AWS cloud.

## Sample Demo Screenshots

Patient's prescriptions and upcoming appointments:
![image](https://user-images.githubusercontent.com/4393945/142808831-256c5d11-6f16-4df5-af1c-f985f2e65a17.png)

Register a doctor in the system using a form or chatbot:
![image](https://user-images.githubusercontent.com/4393945/142808642-2b7d692e-712d-4ebc-8698-2f5bea5cb9e5.png)

## Pre-requisites

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)
2. [Install and configure amplify CLI](https://docs.amplify.aws/cli/start/install/)
3. [Clone this git repo using amplify](https://docs.amplify.aws/cli/start/workflows/#clone-sample-amplify-project)

## Project Set-up

`amplify init --app https://github.com/sarinderv/cmpe281-project2` will initialize locally.

`amplify push` will then create the following resources in the AWS cloud:
- S3 buckets (hosting the frontend + for prescription upload/download)
- Cloudfront distribution (for frontend distribution)
- DynamoDB (for database storage)
- AppSync (for GraphQL API between frontend and database)
- Lambda (for appointment emails via SES)
- Lex resources (for chatbot)

All of the CloudFormation templates are in https://github.com/sarinderv/cmpe281-project2/tree/master/amplify/backend.

## Local configuration

How to set up and run project locally:
- `git clone https://github.com/sarinderv/cmpe281-project2`
- `cd cmpe281-project2`
- `npm init`
- `npm start`

Will open browser to http://localhost:3000

## Architecture

This project frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
The backend is all in AWS.

## AWS

All of the CloudFormation templates are in https://github.com/sarinderv/cmpe281-project2/tree/master/amplify/backend.
