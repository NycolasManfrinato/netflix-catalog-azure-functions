# Gerenciador de Catalogos da Netflix com Azure Functions e Banco de Dados

Projeto desenvolvido na trilha **Formacao AZ-204** da [DIO](https://www.dio.me/), a partir do laboratorio *"Criando um Gerenciador de Catalogos da Netflix com Azure Functions e Banco de Dados"*, ministrado por Henrique Eduardo Souza (Microsoft MVP).

O projeto simula o backend de um catalogo de filmes e series (no estilo Netflix), usando servicos serverless do Azure:

- Upload de arquivos (capas) para o **Azure Blob Storage**;
- Cadastro dos itens do catalogo no **Azure Cosmos DB**;
- Filtro dos itens do catalogo por categoria e/ou titulo;
- Listagem de todos os itens cadastrados.

## Arquitetura

- **Azure Functions** (Node.js, modelo de programacao v4) hospedando 4 funcoes HTTP;
- **Azure Storage Account** (Blob Storage) para armazenar os arquivos de capa;
- **Azure Cosmos DB** (API SQL/Core) para persistir os metadados do catalogo;
- Infraestrutura como codigo com **Bicep** (pasta `infra/`).

```
Cliente HTTP -> Azure Functions -> Azure Blob Storage (arquivos de capa)
                                 -> Azure Cosmos DB    (itens do catalogo)
```

## Estrutura do projeto

```
netflix-catalog-azure-functions/
├── infra/
│   └── main.bicep              # Infraestrutura: Storage Account, Cosmos DB e Function App
├── src/
│   ├── index.js                 # Registro das funcoes
│   ├── blobClient.js            # Cliente do Blob Storage
│   ├── cosmosClient.js          # Cliente do Cosmos DB
│   └── functions/
│       ├── saveFile.js          # POST /api/files
│       ├── saveCatalogItem.js   # POST /api/catalog
│       ├── filterCatalog.js     # GET  /api/catalog/filter
│       └── listCatalog.js       # GET  /api/catalog
├── host.json
├── package.json
├── local.settings.json.example
└── .gitignore
```

## Etapas do laboratorio

O codigo deste repositorio cobre as etapas propostas no laboratorio da DIO:

1. Introducao;
2. Criando a infraestrutura em nuvem (Storage Account + Cosmos DB) -> [`infra/main.bicep`](infra/main.bicep);
3. Criando uma Azure Function para salvar arquivos no Storage Account -> [`src/functions/saveFile.js`](src/functions/saveFile.js);
4. Criando uma Azure Function para salvar no Cosmos DB -> [`src/functions/saveCatalogItem.js`](src/functions/saveCatalogItem.js);
5. Criando uma Azure Function para filtrar registros no Cosmos DB -> [`src/functions/filterCatalog.js`](src/functions/filterCatalog.js);
6. Criando uma Azure Function para listar registros no Cosmos DB -> [`src/functions/listCatalog.js`](src/functions/listCatalog.js).

7. ## Endpoints

8. ### 1. Salvar arquivo (capa) no Storage Account

9. `POST /api/files`

10. ```json
    {
      "fileName": "matrix.jpg",
      "contentType": "image/jpeg",
      "fileBase64": "<conteudo do arquivo em base64>"
    }
    ```

    Resposta `201`:

    ```json
    {
      "message": "Arquivo salvo com sucesso.",
      "fileName": "matrix.jpg",
      "url": "https://<storage>.blob.core.windows.net/capas/matrix.jpg"
    }
    ```

    ### 2. Cadastrar item no catalogo (Cosmos DB)

    `POST /api/catalog`

    ```json
    {
      "title": "Matrix",
      "description": "Um hacker descobre a verdade sobre sua realidade.",
      "category": "Ficcao Cientifica",
      "releaseYear": 1999,
      "imageUrl": "https://<storage>.blob.core.windows.net/capas/matrix.jpg"
    }
    ```

    ### 3. Filtrar itens do catalogo

    `GET /api/catalog/filter?category=Ficcao Cientifica`

    `GET /api/catalog/filter?title=matrix`

    ### 4. Listar todos os itens do catalogo

    `GET /api/catalog`

    ## Como executar localmente

    Pre-requisitos: Node.js 18+, Azure Functions Core Tools v4 e o Azurite (ou uma Storage Account real).

    ```bash
    npm install
    cp local.settings.json.example local.settings.json
    # preencha STORAGE_CONNECTION_STRING e COSMOS_CONNECTION_STRING no local.settings.json
    npm start
    ```

    ## Como provisionar a infraestrutura no Azure

    ```bash
    az group create --name rg-netflix-catalog --location brazilsouth

    az deployment group create \
      --resource-group rg-netflix-catalog \
      --template-file infra/main.bicep
    ```

    Apos a implantacao da infraestrutura, publique o codigo das Azure Functions:

    ```bash
    func azure functionapp publish <nome-da-function-app>
    ```

    ## Tecnologias utilizadas

    - Node.js
    - Azure Functions (modelo de programacao v4)
    - Azure Blob Storage
    - Azure Cosmos DB
    - Bicep (Infrastructure as Code)

    ## Autor

    Projeto realizado como parte da trilha **Formacao AZ-204** da [DIO](https://www.dio.me/).
