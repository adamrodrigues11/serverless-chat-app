import { getChat, deleteChat } from '@day12-app/core/src/database'

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub
  const id = event.pathParameters.id

  // if the chat doesn't exist or doesn't belong to the user, return a 404
  const chat = await getChat(id, sub)
  if (!chat) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Chat not found',
      }),
    };
  }

  // if the chat exists and belongs to the user, delete it
  // cascade delete will delete all messages associated with the chat
  try {
    await deleteChat(id, sub)  
  } catch (err) {
    // if the database throws an error, send a 500
    console.log(`Error deleting chat with chat_id ${id}`, err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error deleting chat'
      }),
    };
  }

  // if the chat was deleted, finally return a 200
  return {
    statusCode: 200,
    body: JSON.stringify({
      chat,
    }),
  };
}
