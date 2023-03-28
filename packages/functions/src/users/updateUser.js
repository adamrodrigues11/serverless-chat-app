import { updateUser } from '@day12-app/core/src/database';

export async function main(event) {
    const { sub, username } = event.requestContext.authorizer?.jwt.claims;
    const { bio, profileImgName } = JSON.parse(event.body);

    let user;
    try {
        user = await updateUser(sub, username, bio, profileImgName);
    } catch (err) {
        console.log(`Error updating user with sub ${sub}`, err);
        return {
            statusCode: 500,
            body: JSON.stringify({
              error: 'Error updating user'
            }),
          };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            user,
        }),
    };
}