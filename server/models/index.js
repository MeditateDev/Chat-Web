const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const namespace = cls.createNamespace('shortlink');
Sequelize.useCLS(namespace);
const { DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD, DB_PROVIDER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_SERVER || 'localhost',
  dialect: DB_PROVIDER || 'mysql',
  define: {
    timestamps: false,
    freezeTableName: true,
    // hooks: {
    //   beforeBulkDestroy: async (options) => {
    //     if (options.model._attributeManipulation.deleted) {
    //       const { where } = options;
    //       await options.model.update({ deleted: true }, { where });
    //     }
    //   },
    // },
  },
  logging: false,
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(async function (errors) {
    console.log('Connection DB has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

db.LinkModel = require('./link')(sequelize);

sequelize.sync();

module.exports = db;
