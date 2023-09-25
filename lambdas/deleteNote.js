/**
 * Route: DELETE /note/t/{timestamp}
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
      userData = JWT.verify(
        event.headers.Authorization,
        "supersecret"
      );
    } catch (err) {
      return {
        statusCode: 403,
        body: {
          message: "Something went wrong with auth",
        },
      };
    }
    let timestamp = parseInt(event.pathParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        userId: userData.id,
        timestamp: timestamp,
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
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
