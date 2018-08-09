
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.integer('author_id').references('users.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.dropColumn('author_id');
  })
};
