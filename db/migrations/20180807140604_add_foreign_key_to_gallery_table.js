exports.up = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.integer('author_id').references('users.id').notNullable()
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('gallery', table => {
    table.dropColumn('author_id');
  });
};
