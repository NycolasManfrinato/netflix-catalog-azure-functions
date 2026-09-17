const { app } = require("@azure/functions");
const { getContainerClient } = require("../blobClient");

// POST /api/files
// Recebe um arquivo (em base64) e salva no Azure Blob Storage.
// Body esperado:
// {
//   "fileName": "matrix.jpg",
//   "contentType": "image/jpeg",
//   "fileBase64": "<conteudo do arquivo em base64>"
// }
app.http("saveFile", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "files",
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { fileName, contentType, fileBase64 } = body || {};

    if (!fileName || !fileBase64) {
      return {
        status: 400,
        jsonBody: {
          error: "Informe 'fileName' e 'fileBase64' no corpo da requisicao."
        }
      };
    }

    const containerClient = getContainerClient();
      await containerClient.createIfNotExists({ access: "blob" });

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const buffer = Buffer.from(fileBase64, "base64");

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType || "application/octet-stream" }
    });

    context.log(`Arquivo "${fileName}" salvo no Storage Account.`);

    return {
      status: 201,
      jsonBody: {
        message: "Arquivo salvo com sucesso.",
        fileName,
        url: blockBlobClient.url
      }
    };
    } catch (error) {
      context.error("Erro ao salvar arquivo:", error);
      return {
        status: 500,
        jsonBody: { error: "Erro interno ao salvar o arquivo." }
      };
    }
  }
});
