const { app } = require("@azure/functions");
const { getCatalogContainer } = require("../cosmosClient");

// GET /api/catalog
// Lista todos os itens cadastrados no catalogo, do mais recente para o mais antigo.
app.http("listCatalog", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "catalog",
  handler: async (request, context) => {
    try {
      const container = getCatalogContainer();
      const { resources } = await container.items
      .query("SELECT * FROM c ORDER BY c.createdAt DESC")
      .fetchAll();

    context.log(`Listagem do catalogo retornou ${resources.length} item(ns).`);

    return { status: 200, jsonBody: { count: resources.length, items: resources } };
    } catch (error) {
      context.error("Erro ao listar catalogo:", error);
      return {
        status: 500,
        jsonBody: { error: "Erro interno ao listar o catalogo." }
      };
    }
  }
});
