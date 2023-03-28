import { getChats } from '@day12-app/core/src/database'

export async function main(event) {
  let chats;
  try {
    chats = await getChats();
  } catch (err) {
    // if the database throws an error, send a 500
    console.log(`Error getting chats`, err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error getting chats'
      }),
    };
  }
  // if the chats were retrieved, return a 200
  return {
    statusCode: 200,
    body: JSON.stringify({
      chats,
    }),
  };
}