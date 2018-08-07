exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', table => {
    table.increments();
    table.integer('author_id').notNullable().references('users.id');
    table.string('link', 255).notNullable();
    table.text('description');
    table.timestamps(true, true);
  });
};;

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
