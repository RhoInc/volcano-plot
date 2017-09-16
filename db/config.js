
const base = {
  client: 'sqlite3',
  migrations: {
    directory: __dirname + '/migs',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: __dirname + '/seeds'
  },
  useNullAsDefault: true
};

module.exports = {

  devlocal: Object.assign({}, base, {
    connection: {
      filename: __dirname + '/appdb.local'
    }
  }),

  development: Object.assign({}, base, {
    connection: {
      filename: __dirname + '/appdb.dev'
    }
  }),

  staging: Object.assign({}, base, {
    connection: {
      filename: __dirname + '/appdb.stage'
    }
  }),

  production: Object.assign({}, base, {
    connection: {
      filename: __dirname + '/appdb.prod'
    }
  })

};
