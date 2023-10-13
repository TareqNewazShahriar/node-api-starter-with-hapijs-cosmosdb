import Hapi from '@hapi/hapi';
import { CosmosdbService } from './cosmosdbService.js';
import apiController from './apiController.js';
const init = async () => {
    const server = Hapi.server({
        port: 3070,
        host: 'localhost'
    });
    const dbService = new CosmosdbService();
    await dbService.init();
    const controller = new apiController(dbService);
    for (let i = 0; i < controller.routes.length; i++)
        server.route(controller.routes[i]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
//# sourceMappingURL=main.js.map