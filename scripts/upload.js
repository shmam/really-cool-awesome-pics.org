
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const accountId = process.env.CF_ACCOUNT_ID;
const apiToken = process.env.CF_API_KEY;
const directoryPath = __dirname;
const images = [];

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        if (path.extname(filePath) === '.jpg') {
            images.push(filePath);
            console.log('Image path:', filePath);
        }
    });

    images.forEach((image) => {
        const form = new FormData();
        form.append('file', fs.createReadStream(image));
        axios.postForm(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
            file: fs.createReadStream(image),
        }, {
            headers: {
                Authorization: 'Bearer ' + apiToken,
                'Content-Type': 'image/jpeg'
            },
        })
        .then((response) => {
            console.log('Post request successful:', response.data);
        })
        .catch((error) => {
            console.error('Error making post request:', error.response.data);
        });
    });
})