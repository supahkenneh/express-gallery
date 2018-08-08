
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'slim', email: 'MM@gmail.com', password: 'password', name: 'marshall'},
        {username: 'Jimbo', email: 'jimmy@gmail.com', password: 'password', name: 'Jimmy'},
        {username: 'Noodles', email: 'campbell@gmail.com', password: 'password', name: 'Kumar'},
        {username: 'MissyE', email: 'freaky@gmail.com', password: 'password', name: 'Elliot'}
      ]);
    });
};
