import { Api, Cognito, use } from "sst/constructs";
import { Storage } from "./StorageStack";

export function API({ stack }) {

  // create auth provider
  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
    triggers: {
      postConfirmation: {
        handler: "packages/functions/src/users/postConfirmation.main",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL
        },
      },
    },
  });
  
  const api = new Api(stack, "Api", {
    authorizers: {
      jwt : {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },
    routes: {
      "GET /users/me": "packages/functions/src/users/getUser.main",
      "GET /chats": {
        function: "packages/functions/src/chats/getChats.main",
        authorizer: "none",
      },
      "POST /chats": "packages/functions/src/chats/createChat.main",
      "PUT /chats/{id}": "packages/functions/src/chats/updateChat.main",
      "DELETE /chats/{id}": "packages/functions/src/chats/deleteChat.main",
      "GET /chats/{chatId}/messages": {
        function: "packages/functions/src/messages/getMessages.main",
        authorizer: "none",
      },
      "POST /chats/{chatId}/messages": "packages/functions/src/messages/createMessage.main",
      "PUT /chats/{chatId}/messages/{messageId}": "packages/functions/src/messages/updateMessage.main",
      "DELETE /chats/{chatId}/messages/{messageId}": "packages/functions/src/messages/deleteMessage.main",
      "GET /users/{userId}": "packages/functions/src/users/getUser.main",
      "PUT /users/{userId}": "packages/functions/src/users/updateUser.main",
    },
  });

  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    api,
    auth,
  };
}
