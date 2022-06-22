const router = require('express').Router();
const axios = require('axios');
const { conn,Recipe,Diet } = require('../db');
const { Op } = require("sequelize");
const isUUID = require('is-uuid');
const {API_KEY} = process.env;
const recipeNumb = 100



// -------- primera peticion que devuelve las recetas --------------
router.get('/', async (req,res) =>{

  const title = req.query.name
  var recipes =[]

try {
 const respuesta = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=${recipeNumb}&addRecipeInformation=true`)
  const recipe = respuesta.data.results;
  if(respuesta){
     recipes = recipe.map(r=>({
      id:r.id,
      title:r.title,
      summary:r.summary,
      score: r.spoonacularScore,
      healthyness:r.healthScore,
      image:r.image,
      diets:r.diets,
      steps:(r.analyzedInstructions && r.analyzedInstructions.steps?r.analyzedInstructions.steps.map(item=>item.step).join("|"):'')
      }))
    }
    else res.status(404).send('No se encontraron datos')

    // ----filtro dentro de la api----
    if(title) recipes = recipes.filter(r=> r.title.includes(title))  
     
       
    filterTitle(res,recipes,title)
  
} catch (error) {

  res.json('No se encontraron recetas')
  
}
   
})



// ------ funciones de filtrado en db ------ 
function filterTitle(res, recipes, title) {
  var filter = {};
  if (title) filter = { title: { [Op.like]: `%${title}%` } };
  Recipe.findAll({
    where: filter,
    include: {
      model: Diet,
      as: "diets",
      through: { attributes: [] },
      attributes: ["name"],
      exclude: ["recipe_diet"],
    },
  })
    .then((recipesbd) => {
      recipesbd = recipesbd.map((recipe) => recipe.get({ plain: true }));
      recipesbd.forEach(
        (recipe) => (recipe.diets = recipe.diets.map((diet) => diet.name))
      );

      recipes = recipes.concat(recipesbd);
    })
    .finally(() => res.json(recipes));
}



// ------- filtracion por ID -----------

router.get('/:id', async (req,res)=>{
  const {id} = req.params
  var recipe = null

  if(isUUID.anyNonNil(id)) recipe =  await Recipe.findByPk(id,
    {
    include:{model:Diet, as: 'diets', through: {attributes: []},
      attributes: ["name"],exclude:["recipe_diet"]
    }
  }); 

   if (recipe) {
     recipe = recipe.get({ plain: true });
     recipe.diets = recipe.diets.map((diet) => diet.name);
     return res.json(recipe)
   }

   else{

     try {
      const respuesta = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
      recipe = respuesta.data;
  
    if(respuesta){
      recipe = {
        id:recipe.id,
        title:recipe.title,
        summary:recipe.summary,
        score: recipe.spoonacularScore,
        healthyness:recipe.healthScore,
        image:recipe.image,
        diets:recipe.diets,
        steps:(recipe.analyzedInstructions[0] && recipe.analyzedInstructions[0].steps?recipe.analyzedInstructions[0].steps.map(item=>item.step).join(""):'')
        }

        res.json(recipe)
  
     }} catch (error) {
  
       res.send('La receta solicitada no exite');
  
     }
   }


   

})


// router.get('/name/:name', async(req,res)=>{
//   const {name} = req.params;
//   const respuesta = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=${recipeNumb}&addRecipeInformation=true`);
//   const recipe = respuesta.data.results;
//   try {
//     if(respuesta){
//       recipes = recipe.map(r=>({
//         name:r.title
//       }))
//     }
//       const recipeName =
//       recipes.filter((r)=>{
//         const filtername = r.name
//         if(filtername.includes(name)) return filtername
//       })

    
//       recipeName? res.json(recipeName) : res.send("No se encontro")
    
    
//   } catch (error) {
//     res.sendStatus(404).send(error)
//   }
// })


router.get('/name/name', async(req,res)=>{
  const respuesta = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=${recipeNumb}&addRecipeInformation=true`);
  const recipe = respuesta.data.results;
  try {
    if(respuesta){
      recipes = recipe.map(r=>({
      name:r.title
    }))}
    
    res.json(recipes)

  } catch (error) {
    res.sendStatus(404).send("x")
  }
  res.json(recipe)

  
}
)


module.exports = router;

