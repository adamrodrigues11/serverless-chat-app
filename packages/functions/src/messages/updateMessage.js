import { getMessage, updateMessage } from '@day12-app/core/src/database'

export async function main(event) {
    const { sub } = event.requestContext.authorizer?.jwt.claims;
    const { messageId } = event.pathParameters;
    const { content } = JSON.parse(event.body);

    // if missing content, return a 400
    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing content'
        }),
      };
    }

    // if the message does not exist or belong to the user, return a 404
    let message = await getMessage(messageId, sub);
    if (!message) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Message not found'
        }),
      };
    }

    // if the message exists and belongs to the user, update it
    try {
      message = await updateMessage(messageId, sub, content);
    } catch (err) {
      // if the database throws an error, send a 500
      console.log(`Error updating message with message_id ${messageId}`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error updating message'
        }),
      };
    }

    // if the message was updated, return a 200
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
  }