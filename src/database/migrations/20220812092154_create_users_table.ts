import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable().unique();
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("account_number", 255);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
