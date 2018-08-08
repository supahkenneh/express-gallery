
exports.up = function(knex, Promise) {
  return knex.schema.table('photos', table => {
    table.string('title').notNull();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('photos', table => {
    table.dropColumn('title');
  });
};
