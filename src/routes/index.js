const router = require('express').Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Postrecipe = require('./Recipe.js');
const getRecipes = require('./Recipes.js');
const Types = require('./Types'); 



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/recipe', Postrecipe);
router.use('/recipes', getRecipes);
router.use('/Types', Types);

router.get('/', async function(req, res, next){

    res.send('Entroo');
  })


module.exports = router;
