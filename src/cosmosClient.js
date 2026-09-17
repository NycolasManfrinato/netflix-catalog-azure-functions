const { CosmosClient } = require("@azure/cosmos");

let container;

/**
 * Retorna (criando se necessario) o container do Cosmos DB
 * onde os itens do catalogo (filmes/series) sao armazenados.
 */
function getCatalogContainer() {
  if (!container) {
    const connectionString = process.env.COSMOS_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error(
      "A variavel de ambiente COSMOS_CONNECTION_STRING nao foi configurada."
      );
  }

  const client = new CosmosClient(connectionString);
    const database = client.database(process.env.COSMOS_DATABASE_NAME || "NetflixCatalogDB");
    container = database.container(process.env.COSMOS_CONTAINER_NAME || "Catalogo");
  }

return container;
}

module.exports = { getCatalogContainer };
