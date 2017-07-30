const db = require('../database');

// TODO: This whole thing needs validation

module.exports = class User {
  constructor(user) {
    if (user.id) { this.id = user.id; }
    if (user.username) { this.username = user.username; }
    if (user.created_at) { this.created_at = user.created_at; }
    if (user.updated_at) { this.updated_at = user.updated_at; }
  }

  // find a way to make this static
  find(id) {
    let q = 'SELECT id, username, created_at, updated_at FROM users WHERE id = $1';
    return db.any(q, [id])
    .then((users) => { if (users.length) { return new User(users[0]); } });
  }

  // find a way to make this static
  create(user) {
    // TODO: hash password with bcrypt
    let q = 'INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING id';
    return db.any(q, [user.username, user.password])
    .then((newUser) => {
      user.id = newUser.id;
      delete user.password;
      return new User(user);
    });
  }

  // need to make sure id is not changed
  save() {
    // needs to handle insert vs update
    if (!this.id) { return Promise.reject('Not a User Instance'); }
    let q = 'UPDATE users SET (username, updated_at) = ($2, now()) WHERE id = $1';
    return db.any(q, [this.id, this.username]);
  }

  // need to make sure id is not changed
  updatePassword(password) {
    if (!this.id) { return Promise.reject('Not a User Instance'); }
    // TODO: hash password with bcrypt
    let q = 'UPDATE users SET (password, updated_at) = ($2, now()) WHERE id = $1';
    return db.any(q, [this.id, password]);
  }

  // need to make sure id is not changed
  confirmPassword(password) {
    if (!this.id) { return Promise.reject('Not a User Instance'); }
    let q = 'SELECT password FROM users WHERE id = $1';
    return db.any(q, [this.id])
    .then((users) => { /* confirm password here */ });
  }

  // need to make sure id is not changed
  destroy() {
    if (!this.id) { return Promise.reject('Not a User Instance'); }
    return db.any('DELETE FROM users WHERE id = $1', [this.id]);
  }
}
