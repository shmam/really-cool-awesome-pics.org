import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";
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


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const photosDir = path.join(__dirname, 'photos');

async function listFiles() {
    const filesToExclude = new Set([
        '.DS_Store',
    ]);

    try {
        const files = await fs.promises.readdir(photosDir);
        return files.map(file => file).filter(file => !filesToExclude.has(file));
    } catch (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
}

async function s3ListObjects() {
    const response = await client.send(
        new ListObjectsV2Command({
            Bucket: "pics",
        })
    );
    return response.Contents?.map(element => element.Key);
}

async function uploadFile(filepath, filename) {
    const command = new PutObjectCommand({
        Bucket: "pics",
        Key: filename,
        Body: await readFile(filepath),
        ContentType: "image/avif",
    })

    const response = await client.send(command);
    console.log(response);
}

async function deleteFiles(filenames) {
    const command = new DeleteObjectsCommand({
        Bucket: "pics",
        Delete: {
            Objects: filenames.map(filename => ({ Key: filename })),
        },
    });

    const response = await client.send(command);
    console.log(response);
}

const allFileSet = new Set(await listFiles());
const alls3FileSet = new Set(await s3ListObjects());

const filesToUpload = [...allFileSet].filter(file => !alls3FileSet.has(file));
console.log("Files to upload:", filesToUpload);

for (const file of filesToUpload) {
    const filePath = path.join(photosDir, file)
    console.log("Uploading", filePath);
    await uploadFile(filePath, file);
}

const filesToDelete = [...alls3FileSet].filter(file => !allFileSet.has(file));
console.log("Files to delete:", filesToDelete);

if (filesToDelete.length > 0) {
    await deleteFiles(filesToDelete);
}