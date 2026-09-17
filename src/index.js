// Ponto de entrada das Azure Functions.
// Cada arquivo dentro de "functions/" registra a sua propria funcao
// utilizando o modelo de programacao v4 do Azure Functions para Node.js.

require("./functions/saveFile");
require("./functions/saveCatalogItem");
require("./functions/filterCatalog");
require("./functions/listCatalog");
