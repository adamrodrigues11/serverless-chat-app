import { StaticSite, use } from "sst/constructs";
import { API } from "./ApiStack";
import { Storage } from "./StorageStack";

export function FrontendStack({ stack, app }) {
  const { api, auth } = use(API);
  const { bucket } = use(Storage);

  const site = new StaticSite(stack, "ReactSite", {
    path: "frontend",
    buildOutput: "dist",
    buildCommand: "npm run build",
    // Pass in our environment variables
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId ?? "",
      VITE_APP_BUCKET_NAME: bucket.bucketName,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.url || "",
  });
}
