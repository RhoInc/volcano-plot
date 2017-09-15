/**
 * prebuilt courses
 */
const knex = require('knex');

exports.seed = function(knex, Promise) {
  return Promise.join(

    knex('datasets').del()
    .then(() => {
      return knex('datasets').insert([
        {
          id: 1,
          code: 'example1',
          name: 'Camelot',
          description: "It's only a model",
          original_filename: "mb_long.csv",
          dt_uploaded: "2017-09-14 08:00:00"
        }
      ]);
    }),

    knex('configs').del()
    .then(() => {
      return knex('configs').insert([
        {id: 1, dataset_id: 1, settings_blob: '{}'}
      ]);
    })

  );
}
