const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccess = process.env.AWS_ACCESS_KEY;
const awsSecret = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccess,
    secretAccessKey: awsSecret,
  },
  region: bucketRegion,
});

const addToS3 = async (uniqueFilename, buffer, mimetype) => {
  const params = {
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command); // Upload file to S3
  imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${uniqueFilename}`;
  return imageUrl;
};

const deleteFromS3 = async (oldImageKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: oldImageKey,
  };
  const deleteCommand = new DeleteObjectCommand(deleteParams);
  await s3.send(deleteCommand);
};

module.exports = {
  addToS3,
  deleteFromS3
};