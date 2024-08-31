const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const accountId = process.env.CF_ACCOUNT_ID;
const apiToken = process.env.CF_API_KEY;

axios
  .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2`, {
    headers: {
      Authorization: "Bearer " + apiToken,
    },
  })
  .then((response) => {
    const images = response.data.result.images;
    return images.map((element) => {
      const url = element.variants.find((variant) => variant.includes('public'));
      const blurUrl = element.variants.find((variant) => variant.includes('blur'));

      return {
        id: element.id,
        url,
        filename: element.filename,
        uploaded: element.uploaded,
        blurUrl, 
      }
    });
  }).then((images) => {
    const data = {
        images
    };

    const jsonData = JSON.stringify(data);

    fs.writeFile("./public/output.json", jsonData, (err) => {
        if (err) {
            console.error("Error writing to JSON file:", err);
        } else {
            console.log("JSON file has been written successfully.");
        }
    });
  });
