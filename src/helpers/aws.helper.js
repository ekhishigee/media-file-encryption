import AWS from "aws-sdk";
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

const S3_ACCESS_KEY_ID = process.env.REACT_APP_S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.REACT_APP_S3_SECRET_ACCESS_KEY;
const S3_REGION = process.env.REACT_APP_S3_BUCKET;
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;

const config = new AWS.Config({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: S3_REGION,
});

let instanceOfS3;

async function getIntanceOfS3() {
  if (!instanceOfS3) {
    instanceOfS3 = new AWS.S3(config);
  }

  return instanceOfS3;
}

const convertWordArrayToUint8Array = (wordArray) => {
  var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
  var length = wordArray.hasOwnProperty("sigBytes")
    ? wordArray.sigBytes
    : arrayOfWords.length * 4;
  var uInt8Array = new Uint8Array(length),
    index = 0,
    word,
    i;
  for (i = 0; i < length; i++) {
    word = arrayOfWords[i];
    uInt8Array[index++] = word >> 24;
    uInt8Array[index++] = (word >> 16) & 0xff;
    uInt8Array[index++] = (word >> 8) & 0xff;
    uInt8Array[index++] = word & 0xff;
  }
  return uInt8Array;
};

export const getEncyptedFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log("reader.result: ", reader.result);
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const encrypted = CryptoJS.AES.encrypt(wordArray, "12334").toString();
      console.log("encrypted: ", encrypted);
      resolve(encrypted);
    };
    reader.onerror = (error) => reject(error);
  });

export const getDecyptedFile = (buffer) =>
  new Promise((resolve, reject) => {
    const source = Buffer.from(buffer).toString();
    console.log("encrypted data: ", source);
    const decrypted = CryptoJS.AES.decrypt(source, "12334");
    console.log("decrypted: ", decrypted);
    const typedArray = convertWordArrayToUint8Array(decrypted);
    console.log("typedArray: ", typedArray);
    const decryptedFile = new Blob([typedArray]);
    console.log("decryptedFile: ", decryptedFile);
    resolve(decryptedFile);
  });

export const uploadToS3 = async (file) => {
  console.log("file: ", file);
  const fileType = file.type;
  const s3 = await getIntanceOfS3();
  const encryptedFile = await getEncyptedFile(file.originFileObj);
  // const blob = new Blob([encryptedFile]);
  // console.log("blob: ", blob);
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: file.name,
      Body: encryptedFile,
    };
    return s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({url: data.Location, type: fileType});
    });
  });
};

const getKey = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const getFileFromS3 = async (url, type) => {
  const s3 = await getIntanceOfS3();
  return new Promise((resolve) => {
    const key = getKey(url);
    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: key,
    };
    return s3.getObject(params, async (err, data) => {
      if (err) {
        resolve({ key, status: false, payload: err.message });
        return;
      }
      console.log("s3 response", data.Body);
      const decryptedFile = await getDecyptedFile(data.Body);
      // const reader = new FileReader();
      // reader.readAsDataURL(decryptedFile);
      // reader.onload = () => {
      //   resolve({
      //     key,
      //     status: true,
      //     payload: reader.result,
      //   });
      // };
      let blob = new Blob([decryptedFile], { type: type });
      let url = URL.createObjectURL(blob);
      resolve({
        key,
        status: true,
        payload: url,
      });
    });
  });
};
