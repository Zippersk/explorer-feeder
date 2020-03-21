import ipfsBtreeNodeChildren from "explorer-core/src/database/BTree/children/ipfsChildren";

import Queriable from "explorer-core/src/database/DAL/query/queriable";
import PrimaryKey from "explorer-core/src/database/DAL/decorators/primaryKey";
import Index from "explorer-core/src/database/DAL/decorators/index";
import Database from "explorer-core/src/database/DAL/database/databaseStore";
import IPFSconnector from "explorer-core/src/ipfs/IPFSConnector";
import { randomPortsConfigAsync } from "explorer-core/src/ipfs/ipfsDefaultConfig";
import { DEFAULT_COMPARATOR } from "explorer-core/src/database/BTree/btree";
import DatabaseInstance from "explorer-core/src/database/DAL/database/databaseInstance";
import IdentityProvider from "orbit-db-identity-provider";
import User from "./models/User";

/**
 * Start the express application.
 *
 * @param port The port to listen to.
 */
export async function start()
{
    const id = (await (await IPFSconnector.getInstanceAsync()).node.id()).id;
    const identity = await IdentityProvider.createIdentity({
        id,
    });
    Database.connect("testDB", identity);
    await Database.use("testDB").execute(
        async (db1: DatabaseInstance) =>
        {
            const tasks = [];

            for (let i = 0; i < 10; i++)
            {
                const u = new User();
                u.name = "test" + i;
                u.age = i;
                tasks.push(u.save());
            }

            await Promise.all(tasks);
            const users = await new User().all();
            console.log(users);
        }
    );
}
