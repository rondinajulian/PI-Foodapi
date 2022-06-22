const router = require("express").Router();
const { conn, Recipe, Diet} = require("../db");


router.post("/", async function (req, res) {
  const { title, summary, score, image, healthyness, steps, diets } = req.body;

  try {
    const recipe = await Recipe.create({
      title,
      summary,
      score,
      image,
      healthyness,
      steps,
    });

    const dietsAdd = await Diet.findOrCreate({
      where: { name: diets },
    });

    recipe.addDiet(dietsAdd);

    res.send('Receta creada');

  } catch (error) {
    res.send(error);
  }
});


module.exports= router;