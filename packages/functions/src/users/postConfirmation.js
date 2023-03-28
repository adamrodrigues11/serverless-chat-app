import { createUser } from '@day12-app/core/src/database'

export async function main(event) {
  console.log("username", event.userName)
  console.log("event.request", event.request);
    const username = event.userName;
    const { sub } = event.request.userAttributes;
    let user;
    try {
      user = await createUser(sub, username);
    } catch (err) {
      console.log(`Error creating user for user with sub ${sub}`, err);
    } finally {
      return event;
    }
  }