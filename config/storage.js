import awsStorage from 'aws-sdk/clients/s3.js';
import { keys } from './keys.js';

const { accessKeyId, secretAccessKey, endpoint, bucket } = keys.aws;

const Storage = new awsStorage({
  credentials: { accessKeyId, secretAccessKey },
  endpoint,
  s3ForcePathStyle: true,
  maxRetries: 5,
  httpOptions: {
    timeout: 300000,      // 5 minutes
    connectTimeout: 10000 // 10 seconds
  }
});


export const uploadObject = async (Body, Key, mimetype) => {
  const params = {
    Bucket: bucket,
    Key,
    ContentType: mimetype || 'application/octet-stream',
    ACL: 'public-read'
  };


  const upload = new awsStorage.ManagedUpload({
    service: Storage,
    params: { ...params, Body }
  });

  console.log(`Starting upload for upload: ${upload}`);

  upload.on('httpUploadProgress', progress => {
    if (progress.total) {
      const pct = Math.round((progress.loaded / progress.total) * 100);
      console.log(`Upload progress: ${pct}%`);
    }
  });

  const data = await upload.promise();
  return {
    ...data,
    location: `https://${bucket}.${endpoint}/${Key}`
  };
};


const getKeyFromUrl = url => {
  if (!url) return null;
  const parts = url.split(`.com/`);
  return parts[1] || null;
};


export const deleteAssetByUrl = async url => {
  const Key = getKeyFromUrl(url);
  if (!Key) {
    throw new Error('Invalid URL: Unable to extract S3 key.');
  }

  await Storage.deleteObject({ Bucket: bucket, Key }).promise();
  console.log(`Deleted asset: ${Key}`);
};

export default Storage;
