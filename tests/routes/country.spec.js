/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Recipe, conn } = require('../../src/db.js');

const agent = session(app);

const recipe = {
  title: 'Milanea a la napolitana',
  summary:'x',
  image:'https://image.com.ar'
};

describe('Recipe routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Recipe.sync({ force: true })
    .then(() => Recipe.create(recipe)));
  describe('GET /recipes', () => {
    it('should get 200', () =>
      agent.get('/recipes').expect(200)
    );
  });
});

describe('POST/recipe', () => {
  it('responds with 200', () => agent.post('/recipe').expect(200));
  it('responds with the recipe', () =>
    agent.post('/recipe')
      .send({
        title:"receta",
        summary:"124",
        score:"12",
        image:"http://image.com",
        healthyness:"10",
        steps:"asdadasd"})

      .then(() => {
        expect('Receta creada');
      })
  );
});
