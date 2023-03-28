import { getMessage, deleteMessage } from '@day12-app/core/src/database'

export async function main(event) {

    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const { messageId } = event.pathParameters;

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
    // if the message exists and belongs to the user, delete it
    try {
      message = await deleteMessage(messageId);
    } catch (err) {
      // if the database throws an error, send a 500
      console.log(`Error deleting message with message_id ${messageId}`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error deleting message'
        }),
      };
    }
    // if the message was deleted, return a 200
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
  }