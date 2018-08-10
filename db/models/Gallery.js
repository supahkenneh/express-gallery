const bookshelf = require('./bookshelf');

class Gallery extends bookshelf.Model {
  get tableName() { return 'gallery' };
  get hasTimestamps() { return true };

  author() {
    return this.belongsTo('User', 'author_name')
  }
};

module.exports = bookshelf.model('Gallery', Gallery); 