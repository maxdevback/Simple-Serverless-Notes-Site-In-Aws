/**
 * Route: POST /note
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const moment = require("moment");
const { v4 } = require("uuid");
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
    let item = JSON.parse(event.body).Item;
    item.userId = userData.id;
    item.user_name = userData.username;
    item.note_id = item.userId + ":" + v4();
    item.timestamp = moment().unix();
    item.expires = moment().add(90, "days").unix();
    await dynamodb
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(item),
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
