import { createMessage } from '@day12-app/core/src/database'

export async function main(event, context) {
    const { sub } = event.requestContext.authorizer?.jwt.claims;
    const { content } = JSON.parse(event.body);
    const { chatId } = event.pathParameters;

    // if missing content, return a 400
    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing content'
        }),
      };
    }

    // make the chat
    let message;
    try {
      message = await createMessage(sub, chatId, content);
    } catch (err) {
      // if the database throws an error, send a 500
      console.log(`Error creating message`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error creating message'
        }),
      };
    }

    // if the message was created, return a 201
    return {
      statusCode: 201,
      body: JSON.stringify({
        message, 
      }),
    };
  }