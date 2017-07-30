module.exports = {
  method: 'GET',
  path: '/smoke',
  handler: (request, reply) => {
    return reply('test passed');
  }
}
