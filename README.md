<!--
title: 'Serverless Framework Node Express API service backed by DynamoDB on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework API on AWS

This is a simple note-taking application written in serverless framework. It has these endpoints:
```
PATCH /note
POST /note
GET /note
GET /note/n/{note_id}
DELETE /note/t/{timestamp}
POST /auth
```

## Usage
Example of use with frontend: http://sls-notes-front.s3-website-us-east-1.amazonaws.com

### Deployment

Install dependencies with:

```
npm install serverless -g
npm install
```

and then deploy with:

```
serverless deploy
```

