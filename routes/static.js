module.exports = {
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      index: true,
      listing: true
    }
  }
}
