// @ts-nocheck  
// gets user pool user id from iam authorized request
export function getUserPoolUserId(event) {
    if (!event.requestContext.authorizer?.iam) {
      return 
    }
    const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr.findLast((ref) => ref.includes(':'))
    const parts = authProvider.split(':');
    return parts[parts.length - 1];
  }

  export function getIdentityId(event) {
    return event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  }