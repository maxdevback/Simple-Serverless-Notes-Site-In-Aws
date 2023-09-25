/**
 * Route: GET /note/n/{note_id}
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const JWT = require("jsonwebtoken");
const _ = require("underscore");

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
    let note_id = decodeURIComponent(event.pathParameters.note_id);

    let params = {
      TableName: tableName,
      IndexName: "note_id-index",
      KeyConditionExpression: "note_id = :note_id",
      ExpressionAttributeValues: {
        ":note_id": note_id,
      },
      Limit: 1,
    };

    await dynamodb.query(params).promise();
    if (!_.isEmpty(data.Items)) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data.Items[0]),
      };
    } else {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      };
    }
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
