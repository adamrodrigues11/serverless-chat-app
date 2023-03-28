import { createChat } from '@day12-app/core/src/database'

export async function main(event) {
    const { sub } = event.requestContext.authorizer?.jwt.claims;
    const { name } = JSON.parse(event.body);

    let chat;
    try {
      chat = await createChat(sub, name);
    } catch (err) {
      // if the database throws an error, send a 500
      console.log(`Error creating chat`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error creating chat'
        }),
      };
    }

    // if the chat was created, return a 201
    return {
      statusCode: 201,
      body: JSON.stringify({
        chat,
      }),
    };
  }