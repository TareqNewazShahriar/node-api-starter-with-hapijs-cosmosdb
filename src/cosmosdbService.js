/// This service communicates with Cosmos DB and does all data manupulation work.

import { CosmosClient } from '@azure/cosmos'
import ApiResponseHelper from './ApiResponseHelper.js'
import fs from 'fs'
//import appConfig from './appConfig.json' assert {type: 'json'} // if broken on future version, see the change log.

// For simplicity we'll set a constant partition key

const ContainerNames = {
   // labels: 'labels',
   // points: 'points',
   // comments: 'comments'
   container1: 'labels'
}

class CosmosdbService {

   containers = {}

   init() {
      const appConfigText = fs.readFileSync('./appConfig.json', {encoding: 'utf-8'})
      const appConfig = JSON.parse(appConfigText) 

      const cosmosClient = new CosmosClient({
         endpoint: appConfig.COSMOS_DB.ENDPOINT,
         key: appConfig.COSMOS_DB.AUTH_KEY
      })
      const databaseId = appConfig.COSMOS_DB.DATABASE_ID

      return new Promise((resolve, reject) => {
         cosmosClient.databases.createIfNotExists({ id: databaseId })
            .then(response => {
               const cosmosDb = response.database
               this.containers = {}
               const promises = []

               for (const name of Object.values(ContainerNames)) {
                  const promise = cosmosDb.containers.createIfNotExists({ id: name })
                     .then(response => {
                        this.containers[name] = response.container
                     })
                     .catch(error => error)
                  promises.push(promise)
               }
               Promise.all(promises)
                  .then(() => resolve(null))
            })
            .catch(error => reject(error))
      })
   }

   /**
    * @param {string} containerName
    * @param {any} item
    */
   create(containerName, item) {
      return new Promise((resolve, reject) => {
         this.containers[containerName].items.create(item /*, { preTriggerInclude: ['addToDoItemTimestamp'] }*/)
            .then((r) => {
               resolve(ApiResponseHelper.create(r.statusCode, r.resource))
            })
            .catch((error) => {
               reject(ApiResponseHelper.createError(error.code, 
                  'Error occurred on adding new data on database.', 
                  null, 
                  ApiResponseHelper.ERROR_TYPES.Database, 
                  error))
            })
      })
   }

   /**
    * @param {string} containerName
    * @param {any} id
    * @param {any} item
    */
   update(containerName, id, item) {
      return new Promise((resolve, reject) => {
         this.containers[containerName].item(id).replace(item)
            .then((r) => {
               resolve(ApiResponseHelper.create(r.code, r.resource))
            })
            .catch((error) => {
               reject(ApiResponseHelper.createError(error.code, 
                  'Error occurred while updating data on database.',
                  null,
                  ApiResponseHelper.ERROR_TYPES.Database,
                  error))
            })
      })
   }

   delete(containerName, id) {
      return new Promise((resolve, reject) => {
         this.containers[containerName].item(id)
            .delete()
            .then((r) => {
               resolve(ApiResponseHelper.create(r.statusCode, r.resource))
            })
            .catch((error) => {
               reject(ApiResponseHelper.createError(error.code,
                  'Error on deleting data.',
                  null,
                  ApiResponseHelper.ERROR_TYPES.Database,
                  error))
            })
      })
   }

   /**
    * @param {string} containerName
    * @param {any} id
    */
   get(containerName, id) {
      return new Promise((resolve, reject) => {
         this.containers[containerName].item(id, id)
            .read()
            .then((r) => {
               resolve(ApiResponseHelper.create(r.statusCode, r.resource))
            })
            .catch((error) => {
               reject(ApiResponseHelper.createError(error.code,
                  'Error on getting data.',
                  null,
                  ApiResponseHelper.ERROR_TYPES.Database,
                  error))
            })
      })
   }

   /**
    * Performs SQL query on a container.
    * @param {string} containerName
    * @param {array|object} parameters: in the format [{ name: '@name_of_column', value: x }]. If only on parameter, then just pass the object without array.
    */
   query(containerName, parameters) {
      const querySpec = {
         query: `SELECT * FROM ${containerName}`,
         parameters: parameters instanceof Array ? parameters : [parameters]
      }

      return new Promise((resolve, reject) => {
         this.containers[containerName].items.query(querySpec)
            .fetchAll()
            .then((r) => {
               resolve(ApiResponseHelper.create(200, r.resources))
            })
            .catch((error) => {
               reject(ApiResponseHelper.createError(error.code,
                  'Error occurred while searching on data.',
                  null,
                  ApiResponseHelper.ERROR_TYPES.Database,
                  error))
            })
      })
   }
}

export { CosmosdbService, ContainerNames }