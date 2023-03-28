import { getChat, updateChat } from "@day12-app/core/src/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const { id } = event.pathParameters;
  const { name } = JSON.parse(event.body);
  
  // if the chat doesn't exist or doesn't belong to the user, return a 404
  let chat = await getChat(id, sub);
  if (!chat) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Chat not found",
      }),
    };
  }

  // if the chat exists and belongs to the user, update it
  try {
    chat = await updateChat(id, sub, name);
  } catch (err) {
    // if the database throws an error, send a 500
    console.log(`Error updating chat with chat_id ${id}`, err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error updating chat",
      }),
    };
  }

  // if the chat was updated, return a 200
  return {
      statusCode: 200,
      body: JSON.stringify({
        chat,
      }),
    };
  }