const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const model = sequelize.define('Link', {
    id: {
      field: 'id',
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shortenedPath: {
      field: 'shortenedPath',
      type: Sequelize.STRING,
      unique: true,
    },
    attributes: {
      type: Sequelize.TEXT,
    },
    expire: {
      field: 'expire',
      type: Sequelize.DATE,
    },
    dateReceived: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  return model;
};
