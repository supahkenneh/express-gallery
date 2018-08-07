'use strict';

exports.up = function(knex, Promise) { 
  return knex.schema.createTable('photos', table => {
    table.increments();
    table.string('author_username', 50);
    table.foreign('author_username').references('users.username');
    table.string('link').notNullable();
    table.text('description').notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
