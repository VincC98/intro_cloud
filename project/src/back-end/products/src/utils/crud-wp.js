axios = require('axios');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { Readable } = require('stream');
//in this file link with couchDB 
var productsDB = require('nano')(process.env.DB_URL);

const account = "modified_for_privacy";
const accountKey = "modified_for_privacy";

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient('imagesgroupe44');

function saveProduct (name, price,image,category,description) {
  return new Promise((resolve, reject) => {
    productsDB.insert(
    {'name':name ,'price' :price ,'image':image, 'category':category, 'description':description},
    async (error, success) => {
        if (success) {
          //console.log(`Product ${name} has been added, with price ${price}, image ${image} and category ${category}`)
          blobClient = containerClient.getBlockBlobClient(name);
          const response = await axios.get(image, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(response.data);
          // Upload the image to Azure Blob Storage
          blobClient.uploadData(imageBuffer, {
            blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Set the content type based on your image type
          });
          resolve(success)
        } else {
          reject(
            new Error(`Error when trying to add product (${name}). Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}

function updateProduct (name,price, image, category,description ,id, rev) {
  return new Promise((resolve, reject) => {

    productsDB.insert({'_id':id,'_rev':rev,'name':name ,'price' :price ,'image':image, 'category':category, 'description':description}, (error, success) => {
        if (success) {
          //console.log(`Product ${name} has been updated, with price ${price}, image ${image} and category ${category}`)
          resolve(success)
        } else {
          reject(
            new Error(`Error when trying to update product (${name}). Reason: ${error.reason}.`)
          )
        }
      })   
  })
}

function loadProduct (product) {
  return new Promise((resolve, reject) => {
    productsDB.get(product, (error, success) => {
      if (success) {
        //console.log(`Product ${product} has been loaded`)
        resolve(success)
      } else {
        reject(new Error(`To fetch information of product (${product}). Reason: ${error.reason}.`))
      }
    })
  })
}

function loadAllProduct() {
  return new Promise((resolve, reject) => {
    productsDB.get(`_design/queries/_view/products`, function (error, success) {
      if (success) {
        //console.log(`All the products have been loaded`)
        resolve(success)
      } else {
        reject(new Error`To fetch information of products . Reason: ${error.reason}.`)
      }
    })
  })
}

function delProduct (product, _rev) {
  return new Promise((resolve, reject) => {
    productsDB.destroy(product, _rev ,(error, success) => {
        if (success) {
          //console.log(`Product ${product} has been deleted`)
          var blockBlobClient = containerClient.getBlockBlobClient(product);
          blockBlobClient.delete({
            deleteSnapshots: 'include'
          });
          resolve(success)
        } else {
          reject(
            new Error(`Error when trying to delete product (${product}). Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


module.exports = {
  saveProduct,
  updateProduct,
  loadProduct,
  delProduct,
  loadAllProduct,
}