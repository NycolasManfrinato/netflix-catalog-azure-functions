const { BlobServiceClient } = require("@azure/storage-blob");

let containerClient;

/**
 * Retorna (criando se necessario) o cliente do container de Blob Storage
 * usado para armazenar os arquivos de capa do catalogo.
 */
function getContainerClient() {
  if (!containerClient) {
    const connectionString = process.env.STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error(
      "A variavel de ambiente STORAGE_CONNECTION_STRING nao foi configurada."
      );
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(
      process.env.STORAGE_CONTAINER_NAME || "capas"
      );
  }

return containerClient;
}

module.exports = { getContainerClient };
