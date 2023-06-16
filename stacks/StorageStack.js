import { Bucket } from 'sst/constructs';

export function Storage({ stack }) {
  // Create a bucket
  const bucket = new Bucket(stack, 'Uploads', {
    bucketName: 'day12-app-media-bucket',
    cors: [
        {
          maxAge: "1 day",
          allowedOrigins: ["*"], // change this to my domain later
          allowedHeaders: ["*"],
          allowedMethods: ["GET", "PUT", "HEAD"],
        },
      ],
  });

  // Show the bucket name in the output
  stack.addOutputs({
    BucketName: bucket.bucketName,
  });

  return { bucket };
}