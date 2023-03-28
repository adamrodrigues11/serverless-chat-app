import { API } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { Storage } from "./stacks/StorageStack";

export default {
  config(_input) {
    return {
      name: "day12-app",
      region: "us-west-2",
    };
  },
  stacks(app) {
    app.stack(Storage).stack(API).stack(FrontendStack);
  }
};
