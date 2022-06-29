require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER ,DB_PASSWORD ,DB_HOST,DB_NAME,DB_DIALECT } = process.env;

let 
  sequelize = new Sequelize('dcbqvqp52agbur', 'dlvwywowwkdaxx', '5a5d1287e56b197ca2ea51600869e3bf32e1756ad908c7448d1a4743556ea888', {
    port:"5432",
    host: 'ec2-18-204-142-254.compute-1.amazonaws.com',
    dialect: 'postgres',
  });

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Recipe,Diet } = sequelize.models;

// relacionamos
Recipe.belongsToMany(Diet, { through: 'recipe_diet' });
Diet.belongsToMany(Recipe, { through: 'recipe_diet' });
// Product.hasMany(Reviews);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
