exports.up = function(knex, Promise) {
  return knex.schema.createTable('gallery', table => {
    table.increments();
    table.string('author', 50).notNullable();
    table.text('link').notNullable();
    table.text('description');
    table.timestamps(true, true);
    table.string('author_name').notNullable().references('users.username')
    table.string('title', 50)
  });
};;

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gallery');
};
