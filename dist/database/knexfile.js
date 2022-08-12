"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const config = {
    development: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "root",
            database: "assessment",
        },
    },
    staging: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "root",
            database: "assessment",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
    production: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};
module.exports = config;
//# sourceMappingURL=knexfile.js.map