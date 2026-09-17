const { app } = require("@azure/functions");
const { randomUUID } = require("crypto");
const { getCatalogContainer } = require("../cosmosClient");

// POST /api/catalog
// Recebe os metadados de um filme/serie e salva no Azure Cosmos DB.
// Body esperado:
// {
//   "title": "Matrix",
//   "description": "Um hacker descobre a verdade sobre sua realidade.",
//   "category": "Ficcao Cientifica",
//   "releaseYear": 1999,
//   "imageUrl": "https://<storage>.blob.core.windows.net/capas/matrix.jpg"
// }
app.http("saveCatalogItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "catalog",
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { title, description, category, releaseYear, imageUrl } = body || {};

    if (!title || !category) {
      return {
        status: 400,
        jsonBody: { error: "Os campos 'title' e 'category' sao obrigatorios." }
      };
    }

    const item = {
      id: randomUUID(),
      title,
      description: description || "",
      category,
      releaseYear: releaseYear || null,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString()
    };

    const container = getCatalogContainer();
      const { resource } = await container.items.create(item);

    context.log(`Item "${title}" salvo no CosmosDB.`);

    return { status: 201, jsonBody: resource };
    } catch (error) {
      context.error("Erro ao salvar item no catalogo:", error);
      return {
        status: 500,
        jsonBody: { error: "Erro interno ao salvar o item no catalogo." }
      };
    }
  }
});
