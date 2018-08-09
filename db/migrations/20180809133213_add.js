
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.dropColumn('author');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.string('author', 50).notNullable();
  })
};
