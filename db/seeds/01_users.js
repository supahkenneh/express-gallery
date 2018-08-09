
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'slim', email: 'MM@gmail.com', password: '$2b$12$KyNVorFwy6bzc1OS/MRvq.4W/safpsY2/jt.e.t12pmLzRaE9hRBi', name: 'marshall'},
        {username: 'Jimbo', email: 'jimmy@gmail.com', password: '$2b$12$KyNVorFwy6bzc1OS/MRvq.4W/safpsY2/jt.e.t12pmLzRaE9hRBi', name: 'Jimmy'},
        {username: 'Noodles', email: 'campbell@gmail.com', password: '$2b$12$KyNVorFwy6bzc1OS/MRvq.4W/safpsY2/jt.e.t12pmLzRaE9hRBi', name: 'Kumar'},
        {username: 'MissyE', email: 'freaky@gmail.com', password: '$2b$12$KyNVorFwy6bzc1OS/MRvq.4W/safpsY2/jt.e.t12pmLzRaE9hRBi', name: 'Elliot'},
        {username: 'DropDeadFred', email: 'FreddyGotFingered@gmail.com', password: '$2b$12$KyNVorFwy6bzc1OS/MRvq.4W/safpsY2/jt.e.t12pmLzRaE9hRBi', name: 'Fred Rogers'}
      ]);
    });
};
