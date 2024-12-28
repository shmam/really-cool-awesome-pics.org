import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new S3Client({
    endpoint: process.env.R2_ENDPOINT,
    region: "wnam",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
});


async function s3ListObjects() {
    const response = await client.send(
        new ListObjectsV2Command({
            Bucket: "pics",
        })
    );
    return response.Contents;
}

function formatObject(element) {
    const file = element.Key

    const shortFilePath = file.substring(9)
    const fileExtension = path.extname(file);
    const uploadTime = file.substring(0,8);

    const year = uploadTime.substring(0, 4);
    const month = uploadTime.substring(4, 6) - 1; // Months are zero-based in JavaScript Date
    const day = uploadTime.substring(6, 8);
    const uploadDate = new Date(year, month, day);

    return {
        id: element.ETag.replace(/^"|"$/g, ''),
        url: `${process.env.R2_DOMAIN}${element.Key}`,
        filename: shortFilePath,
        uploaded: uploadDate,
        ext: fileExtension
    };
}

const s3Objects = await s3ListObjects()

const data = s3Objects.map(element => formatObject(element));
const __dirname = path.dirname(new URL(import.meta.url).pathname);

data.sort((a, b) => b.uploaded - a.uploaded);

const filePath = path.join(__dirname, 'public', 'output.json');
fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Data successfully written to file');
    }
});