/// This service communicates with Cosmos DB and does all data manupulation work.
// @ts-check
import { CosmosClient } from '@azure/cosmos';
import fs from 'fs';
const appConfigText = fs.readFileSync('./src/appConfig.json', { encoding: 'utf-8' });
const appConfig = JSON.parse(appConfigText);
// For simplicity we'll set a constant partition key
const partitionKey = undefined;
const ContainerNames = {
    // labels: 'labels',
    // points: 'points',
    // comments: 'comments'
    items: 'items'
};
class CosmosdbService {
    containers;
    /**
     * Manages reading, adding, and updating Tasks in Azure Cosmos DB
     * @param {string} databaseId
     * @param {string} containerId
     */
    init() {
        const cosmosClient = new CosmosClient({
            endpoint: appConfig.COSMOS_DB.ENDPOINT,
            key: appConfig.COSMOS_DB.AUTH_KEY
        });
        const databaseId = appConfig.COSMOS_DB.DATABASE_ID;
        return new Promise((resolve, reject) => {
            cosmosClient.databases.createIfNotExists({ id: databaseId })
                .then(response => {
                const cosmosDb = response.database;
                this.containers = {};
                const promises = [];
                for (const name in ContainerNames) {
                    const promise = cosmosDb.containers.createIfNotExists({ id: name })
                        .then(response => {
                        this.containers[name] = response.container;
                    })
                        .catch(error => error);
                    promises.push(promise);
                }
                Promise.all(promises)
                    .then(() => resolve(null))
                    .catch(error => reject(error));
            })
                .catch(error => reject(error));
        });
    }
    async getItem(containerName, itemId) {
        const { resource } = await this.containers[containerName].item(itemId, partitionKey).read();
        return resource;
    }
    /**
     * Performs SQL query on a container.
     * @param {string} containerName
     * @param {array|object} parameters: in the format [{ name: '@name_of_column', value: x }]. If only on parameter, then just pass the object without array.
     */
    find(containerName, parameters) {
        const querySpec = {
            query: `SELECT * FROM ${containerName}`,
            parameters: parameters instanceof Array ? parameters : [parameters]
        };
        return new Promise((resolve, reject) => {
            this.containers[containerName].items.query(querySpec)
                .fetchAll()
                .then(response => {
                resolve(response.resources);
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    async addItem(containerName, item) {
        item.date = Date.now();
        item.completed = false;
        return new Promise((resolve, reject) => {
            this.containers[containerName].items.create(item, { preTriggerInclude: ['addToDoItemTimestamp'] })
                .then(r => {
                console.log('Created.', r);
                resolve(r.resource);
            })
                .catch(err => {
                console.log('Error on create.', err);
                reject(err);
            });
        });
    }
    async updateItem(containerName, itemId) {
        const doc = await this.getItem(containerName, itemId);
        doc.completed = true;
        return new Promise((resolve, reject) => {
            this.containers[containerName]
                .item(itemId, partitionKey)
                .replace(doc)
                .then(r => {
                resolve(r.resource);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
}
export { CosmosdbService, ContainerNames };
//# sourceMappingURL=cosmosdbService.js.map