module.exports = {
  env: 'DEV', // 'DEV', 'PROD', 'STAGING'
  host: 'localhost', // 'localhost'
  address: '127.0.0.1', // '0.0.0.0'
  port: 11080, // 11080
  tls: { // { cert: '<file contents>', key: '<file contents>' }
    cert: '',
    key: ''
  },
  postgres: {
    database: 'dev_db',
    user: '',
    password: ''
  },
  // logging
  logging: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ response: '*', log: '*' }]
      },
      { module: 'good-console' },
      'stdout'],
      myFileReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ response: '*', log: '*' }]
      },
      {
        module: 'good-squeeze',
        name: 'SafeJson'
      },
      {
        module: 'good-file',
        args: ['./logs/server-log']
      }]
    }
  },
};
