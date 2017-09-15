
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('datasets', function(table){
      table.increments('id').primary();
      table.string('code');
      table.string('name');
      table.string('description');
      table.string('config');
      table.string('original_filename');
      table.dateTime('dt_uploaded');
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.dropTableIfExists('datasets'),

  ])  
};
