exports.up = function(knex, Promise) {
  return knex.schema.createTable('gallery', table => {
    table.increments();
    table.string('author', 50).notNullable();
    table.string('link', 255).notNullable();
    table.text('description');
    table.timestamps(true, true);
  });
};;

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gallery');
};
