import { getUser } from "@day12-app/core/src/database";

export async function main(event) {
  const { sub } = event.requestContext.authorizer?.jwt.claims;
  
  let user;
  // get user from database
  user = await getUser(sub);

  // if the user was not found, return a 404
  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "User not found",
      }),
    };
  }

  // if the user was found, return a 200
  return {
    statusCode: 200,
    body: JSON.stringify({
      user,
    }),
  };
}
