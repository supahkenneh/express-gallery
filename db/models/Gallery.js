const bookshelf = require('./bookshelf');

class Gallery extends bookshelf.Model {
  get tableName() { return 'gallery' };
  get hasTimestamps() { return true };

  author() {
    return this.belongsTo('User', 'author')
  }
};

module.exports = bookshelf.model('Gallery', Gallery); 