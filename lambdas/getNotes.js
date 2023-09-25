/**
 * Route: GET /notes
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const JWT = require("jsonwebtoken");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let userData;
    try {
      userData = JWT.verify(event.headers.Authorization, "supersecret");
    } catch (err) {
      return {
        statusCode: 403,
        body: {
          message: "Something went wrong with auth",
        },
      };
    }
    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 5;

    let params = {
      TableName: tableName,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": userData.id,
      },
      Limit: limit,
      ScanIndexForward: false,
    };

    let startTimestamp = query && query.start ? parseInt(query.start) : 0;

    if (startTimestamp > 0) {
      params.ExclusiveStartKey = {
        userId: userData.id,
        timestamp: startTimestamp,
      };
    }

    let data = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
