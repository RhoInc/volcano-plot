
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('datasets', function(table){
      table.increments('id').primary();
      table.string('code');
      table.string('name');
      table.string('description');
      table.string('original_filename');
      table.dateTime('dt_uploaded');
    }),

    knex.schema.createTable('configs', function(table){
      table.increments('id').primary();
      table.string('dataset_id');
      table.string('settings_blob');
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.dropTableIfExists('datasets'),
    knex.schema.dropTableIfExists('configs')

  ])  
};
