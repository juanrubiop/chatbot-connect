// Import necessary modules
const axios = require("axios");
const { json } = require("sequelize");

// Retrieve environment variables
let Endpoint = process.env.ENDPOINT;
let projectName = process.env.PROJECT_NAME;
const uri = `${Endpoint}/language/query-knowledgebases/projects/${projectName}/sources?api-version=2021-10-01`;
const apiKey = process.env.API_KEY;

const { v1: uuidv1 } = require("uuid");
const { DefaultAzureCredential } = require('@azure/identity');
const {
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
  BlobServiceClient
} = require('@azure/storage-blob');

// Load environment variables from a .env file
require("dotenv").config();

// Function to edit a document in Azure Blob Storage
const editDocumentBlob = async (req, res) => {
  try {
    // Retrieve Azure Storage account name
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error('Azure Storage accountName not found');

    // Create BlobServiceClient instance
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );

    // Specify the container name
    const containerName = `qnadocuments`;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get data from the request
    const data = req.body.content;
    const bufferData = Buffer.from(req.body.base64Data, "base64");
    let blobName = req.body.file_name;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.uploadData(bufferData);

    if (response._response.status !== 201) {
      throw new Error(
        `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
      );
    }

    // Generate a Shared Access Signature (SAS) token
    const sas = await getSAS();
    console.log(`sasToken = '${sas}'\n`);

    let sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}${sas}`;
    console.log(sasUrl);
    let body = {};

    if (req.body.operation === 'add') {
      body = [
        {
          "op": 'add',
          "value": {
            "displayName": blobName,
            "sourceUri": sasUrl,
            "sourceKind": "file",
            "source": blobName
          }
        }
      ];
    } else if (req.body.operation === 'replace') {
      body = [
        {
          "op": 'replace',
          "value": {
            "displayName": blobName,
            "sourceUri": sasUrl,
            "sourceKind": "file",
            "refresh": true,
            "source": blobName
          }
        }
      ];
    }

    const response2 = await modifyKB(body);
    res.status(response2.status).send(response2.message);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(400).send(err.message);
  }
}

// Function to delete a document from Azure Blob Storage
const deleteDocumentBlob = async (req, res) => {
  try {
    // Retrieve Azure Storage account name
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error('Azure Storage accountName not found');

    // Create BlobServiceClient instance
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );

    // Specify the container name
    const containerName = `qnadocuments`;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get data from the request
    const data = req.body.content;
    const bufferData = Buffer.from(req.body.base64Data, "base64");
    let blobName = req.body.file_name;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    const response = await containerClient.deleteBlob(blobName);


    if (response._response.status !== 202) {
      throw new Error(`Error deleting ${blobName}`);
    }

    // Generate a Shared Access Signature (SAS) token
    const sas = await getSAS();
    console.log(`sasToken = '${sas}'\n`);

    let sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}${sas}`;
    console.log(sasUrl);

    let body = [
      {
        "op": "delete",
        "value": {
          "displayName": blobName,
          "sourceUri": sasUrl,
          "sourceKind": "file",
          "source": blobName
        }
      }
    ];

    const response2 = await modifyKB(body);
    res.status(response2.status).send(response2.message);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(400).send(err.message);
  }
}

// Function to generate a Shared Access Signature (SAS) token
const getSAS = async () => {

  // Creates object with the permissions and parameters required to ask for the SAS
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(),
    resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
    permissions: AccountSASPermissions.parse("rwdlacupi"),
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),
  };
  // Reads the names from the env variables
  const constants = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
  };
  // Gets key credentials
  const sharedKeyCredential = new StorageSharedKeyCredential(
    constants.accountName,
    constants.accountKey
  );
  //Generates token
  const sasToken = generateAccountSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  // Prepend sasToken with `?`
  return (sasToken[0] === '?') ? sasToken : `?${sasToken}`;
}

// Function to modify a knowledge base
const modifyKB = async (body) => {

  // Header for the api call to authenticate
  let header = {
    "Ocp-Apim-Subscription-Key": apiKey,
    "Content-Type": "application/json"
  };

  try {
    let response = await axios.patch(uri, body, { headers: header })
      .catch(function (error) {
        if (error.response) {
          console.log("Data:");
          console.log(error.response.data);
          console.log("Status:");
          console.log(error.response.status);
          console.log("Headers:");
          console.log(error.response.headers);
          console.log("1");
          return { status: error.response.status, message: error.response.data };
        } else if (error.request) {
          console.log(error.request);
          console.log("2");
          return { status: 400, message: "" };
        } else {
          console.log('Error', error.message);
          console.log("3");
          return { status: 400, message: error.message };
        }
      });
    return response;
  }
  catch (e) {
    console.log(e);
    return { status: 500, message: e };
  }
}

// Function to view documents
const viewDocuments = async (req, res) => {

  // Headers to authenticate the api call
  let header = {
    "Ocp-Apim-Subscription-Key": apiKey,
    "Content-Type": "application/json"
  };
  // Call the azure api
  try {
    let response = await axios.get(uri, { headers: header })
    res.status(200).json(response.data);
  }
  catch (e) {
    res.status(500).json({ message: e });
  }
}

// Export functions for use in other parts of the application
module.exports = {
  viewDocuments,
  editDocumentBlob,
  deleteDocumentBlob
}
