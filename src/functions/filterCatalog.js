const { app } = require("@azure/functions");
const { getCatalogContainer } = require("../cosmosClient");

// GET /api/catalog/filter?category=Ficcao Cientifica
// GET /api/catalog/filter?title=matrix
// Filtra os itens do catalogo por categoria e/ou titulo (busca parcial, sem diferenciar maiusculas/minusculas).
app.http("filterCatalog", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "catalog/filter",
  handler: async (request, context) => {
    try {
      const category = request.query.get("category");
      const title = request.query.get("title");

    if (!category && !title) {
      return {
        status: 400,
        jsonBody: {
          error: "Informe ao menos um filtro: 'category' ou 'title' na query string."
        }
      };
    }

    const conditions = [];
      const parameters = [];

    if (category) {
      conditions.push("CONTAINS(LOWER(c.category), LOWER(@category))");
      parameters.push({ name: "@category", value: category });
    }

    if (title) {
      conditions.push("CONTAINS(LOWER(c.title), LOWER(@title))");
      parameters.push({ name: "@title", value: title });
    }

    const querySpec = {
      query: `SELECT * FROM c WHERE ${conditions.join(" AND ")}`,
      parameters
    };

    const container = getCatalogContainer();
      const { resources } = await container.items.query(querySpec).fetchAll();

    context.log(`Filtro aplicado (category="${category || ""}", title="${title || ""}") retornou ${resources.length} item(ns).`);

    return { status: 200, jsonBody: { count: resources.length, items: resources } };
    } catch (error) {
      context.error("Erro ao filtrar catalogo:", error);
      return {
        status: 500,
        jsonBody: { error: "Erro interno ao filtrar o catalogo." }
      };
    }
  }
});
