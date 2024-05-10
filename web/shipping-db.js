import sqlite3 from "sqlite3";
import path from "path"
const DB_PATH = path.join(process.cwd(), 'database.sqlite');
var db = new sqlite3.Database(DB_PATH);
export const ShippingDB = {
    shippingTableName: "shipping",
    ready: null,

    create: async function ({
        fsgoal,
        initialmessage,
        progressmessage,
        goalachievemessage,
        shopDomain
    }) {
        await this.ready;

        const query = `
      INSERT INTO ${this.shippingTableName}
      ( 
        fsgoal,
        initialmessage,
        progressmessage,
        goalachievemessage,
        shopDomain
     )
        VALUES (
            
            '${fsgoal}', 
            '${initialmessage}', 
            '${progressmessage}',
            '${goalachievemessage}',
           ' ${shopDomain}')
           RETURNING id
    `;

        const rawResults = await this.__query(query).then(response => {
            console.log("insert response", response)
            return response
        });
        return rawResults[0].id;
    },

    update: async function (
        id,
        {
            fsgoal,
            initialmessage,
            progressmessage,
            goalachievemessage,
            shopDomain
        }
    ) {
        await this.ready;

        const query = `
      UPDATE ${this.shippingTableName}
      SET
      fsgoal =  '${fsgoal}', 
      initialmessage =  '${initialmessage}', 
      progressmessage =  '${progressmessage}',
      goalachievemessage = '${goalachievemessage}',
      shopDomain =  ' ${shopDomain}'
      WHERE
        id = ${id}
        RETURNING id;
    `;

        await this.__query(query).then(result => {
            return result
        });

    },

    list: async function (shopDomain) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.shippingTableName}
      WHERE shopDomain = '${shopDomain}';
    `;
        const results = await this.__query(query);

        return results
    },

    read: async function (id) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.shippingTableName}
      WHERE id = ${id};
    `;
        const rows = await this.__query(query);
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
        return rows[0];
    },

    delete: async function (id) {
        await this.ready;
        const query = `
      DELETE FROM ${this.shippingTableName}
      WHERE id = ${id};
    `;
        await this.__query(query);
        return true;
    },

    /* Initializes the connection with the app's sqlite3 database */
    init: async function () {
        db = await new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the sqlite database.');
        });
        const hasShippingTable = await this.__hasShippingTable();

        if (hasShippingTable) {
            this.ready = Promise.resolve();

            /* Create the Shipping table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.shippingTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shopDomain VARCHAR(511) NOT NULL,
          fsgoal VARCHAR(511),
          initialmessage VARCHAR(511),
          progressmessage VARCHAR(511),
          goalachievemessage VARCHAR(511),
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;

            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    __query: function (sql) {
        return new Promise((resolve, reject) => {
            db.all(sql, (err, result) => {
                // console.log("sql:::", sql)
                console.log("result::::", result)
                if (err) {
                    console.log("in error::", err)
                    reject(err);
                    return
                }
                resolve(result);
            });
        });
    },

    __hasShippingTable: async function () {
        const query = `
          SELECT name FROM sqlite_schema
          WHERE
            type = 'table' AND
            name = '${this.shippingTableName}';
        `;
        const result = await this.__query(query).then(response => {
            return response;
        });
        return result;
    },
};