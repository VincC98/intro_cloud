// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary authenticate using an account name and a static key
 */

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { generateAccountSASQueryParameters, AccountSASPermissions, AccountSASResourceTypes, AccountSASServices, SASProtocol } = require("@azure/storage-blob");
const fs = require('fs');
const path = require('path');

// Read the content of the file
const directoryPath = '../images'; 
const account = "modified_for_privacy";
const accountKey = "modified_for_privacy";

async function main() {

    // Use StorageSharedKeyCredential with storage account and account key
    // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );

    // Create a container
    const containerName = `imagesgroupe44`;
    const containerClient = await blobServiceClient.createContainer(containerName, {access: 'container'});
    const container = blobServiceClient.getContainerClient(containerName);

    const images = fs.readdirSync(directoryPath);
    for (const file of images) {
        const filePath = path.join(directoryPath, file);
        const filename = path.parse(file).name;

        // Get a reference to the blob
        const blobClient = container.getBlockBlobClient(filename);
    
        // Upload the file to the blob
        await blobClient.uploadFile(filePath,{
            blobHTTPHeaders: { blobContentType: 'image/jpeg' },
        });
    
        console.log(`File '${file}' uploaded to Azure Blob Storage.`);
    }

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});