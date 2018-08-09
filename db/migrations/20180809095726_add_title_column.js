
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.string('title', 50);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('gallery', table => {
    table.dropColumn('title');
  });
};
