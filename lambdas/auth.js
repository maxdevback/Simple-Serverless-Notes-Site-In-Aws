const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.AUTH_TABLE;
const { v4 } = require("uuid");
// const { compare, hash } = require("bcrypt");
const JWT = require("jsonwebtoken");

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  if(!data.username || !data.password) {
    throw {
      statusCode: 400,
      name: "dataAbsent",
      message: "One or more fields are absent"
    }
  }
  try {
    const user = await dynamodb
      .get({
        TableName: tableName,
        Key: {
          username: data.username,
        },
      })
      .promise();
    if (!user.Item) {
      const newUser = {
        id: v4(),
        username: data.username,
        // password: await hash(data.password, 10),
        password: data.password,
      };
      await dynamodb
        .put({
          TableName: tableName,
          Item: newUser,
        })
        .promise();
      delete newUser.password;
      const jwt = JWT.sign(newUser, "supersecret");
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",},
        body: JSON.stringify({token:jwt})
      };
    } else {
      //const isPasswordValid = await compare(event.body, user.Item.password);
      if (data.password !== user.Item.password)
        throw { statusCode: 400, name: "Validation error", message: "Invalid password" };
      const jwt = JWT.sign(
        { id: user.Item.id, username: data.body },
        "supersecret"
      );
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",},
        body: JSON.stringify({token: jwt})
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
