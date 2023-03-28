import { getMessages } from '@day12-app/core/src/database'

export async function main(event) {

    const { chatId } = event.pathParameters;
    
    let messages;
    try {
      messages = await getMessages(chatId);
    } catch (err) {
      // if the database throws an error, send a 500
      console.log(`Error getting messages`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error getting messages'
        }),
      };
    }
    // if the messages were retrieved, return a 200
    // returns all the messages in the chat with the username for each message
    return {
      statusCode: 200,
      body: JSON.stringify({
        messages,
      }),
    };
  }