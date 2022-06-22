const axios = require('axios');
const  router  = require('express').Router();
const { Diet } = require('../db');
const {API_KEY} = process.env;
const recipeNumb = 100


// Ejemplo: router.use('/auth', authRouter);
router.get("/", async function (req, res, next) {
  try {
    const diet = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=${recipeNumb}&addRecipeInformation=true`
    );
    const onlyDiets = await diet.data.results.map((d) => d.diets).flat();
    try {
      onlyDiets.forEach((e) => {
        Diet.findOrCreate({
          where: {
            name: e,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
    const dietsAll = await Diet.findAll();
    dietsAll.length ? res.json(dietsAll) : res.send("Diets not found");
  } catch (e) {
    next(e);
  }
});



module.exports = router;