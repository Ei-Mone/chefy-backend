/**
 * recipes.js
 * -----------------------------------------------------------------------
 * Clean local recipe dataset for Chefy.
 * Frontend only for now: no server/database yet.
 *
 * Database-ready fields used by the app:
 * id, name, category, ageGroup, image, ingredients, steps,
 * shortAdvantages, advantages.
 * -----------------------------------------------------------------------
 */

const recipes = {
  "banana-pudding": {
    "id": "banana-pudding",
    "name": "Banana Pudding",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "banana",
      "milk"
    ],
    "steps": [
      "Wash your hands and prepare a clean bowl.",
      "Peel the banana and place it inside the bowl.",
      "Mash the banana until it becomes smooth.",
      "Add the milk slowly.",
      "Mix gently until everything is combined."
    ],
    "shortAdvantages": "Good for teeth",
    "advantages": "Good for teeth"
  },
  "kailan-shrimp-mash": {
    "id": "kailan-shrimp-mash",
    "name": "Kailan Shrimp Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "kailan",
      "carrot",
      "tomato",
      "shrimp",
      "chicken",
      "water"
    ],
    "steps": [
      "Prepare 4 leaves of kailan.",
      "Prepare 2 small pieces of carrot.",
      "Prepare 3 small pieces of tomato.",
      "Prepare 3 small pieces of shrimp. If the baby is under 8 months, use a small piece of boneless and skinless chicken instead of shrimp.",
      "Wash the kailan, carrot, and tomato carefully.",
      "Boil or steam the carrot until very soft.",
      "Add the kailan and tomato, then cook until soft.",
      "Cook the shrimp or chicken fully. Remove all shells, skin, bones, and hard pieces.",
      "Put the cooked kailan, carrot, tomato, and shrimp or chicken into a blender.",
      "Add a little warm water to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Green mash with protein and vegetables.",
    "advantages": "A nutritious baby mash with vegetables and protein. Kailan provides green vegetable nutrients, vitamins, minerals, and fiber. Carrot adds natural sweetness and vitamin A, which supports healthy eyes and growth. Tomato gives moisture, gentle flavor, and vitamin C. Shrimp provides protein, but it is a shellfish allergen, so chicken can be used instead for babies under 8 months or when parents want a safer first option."
  },
  "salmon-rice-mash": {
    "id": "salmon-rice-mash",
    "name": "Salmon Rice Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "salmon",
      "potato",
      "broccoli",
      "carrot",
      "rice",
      "water"
    ],
    "steps": [
      "Prepare 10 to 13g of salmon.",
      "Remove all skin, bones, and hard pieces from the salmon.",
      "Prepare 3 small pieces of potato.",
      "Prepare 5 small pieces of broccoli.",
      "Prepare 3 small pieces of carrot.",
      "Wash the potato, broccoli, and carrot carefully.",
      "Pre-boil or steam the potato, broccoli, and carrot until very soft.",
      "Cook the salmon fully until it is soft and flaky.",
      "Use 2 tablespoons of cooked rice.",
      "Put the cooked salmon, potato, broccoli, carrot, and rice into a blender.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the blended mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft salmon mash with rice and vegetables.",
    "advantages": "A nutritious baby mash with protein, energy, and vegetables. Salmon provides protein and healthy fats that support growth and brain development. Rice gives gentle energy and helps make the meal filling. Potato adds soft energy and a creamy texture. Broccoli provides vitamins, minerals, and fiber. Carrot adds natural sweetness and vitamin A, which supports healthy eyes and growth. The smooth texture makes it easier for babies over 6 months to swallow."
  },
  "egg-potato-pudding": {
    "id": "egg-potato-pudding",
    "name": "Egg Potato Pudding",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "egg",
      "potato",
      "formula milk"
    ],
    "steps": [
      "Boil 1 potato until it becomes very soft.",
      "Mash the boiled potato in a clean bowl.",
      "Crack 1 egg into the bowl.",
      "Add 30 ml of correctly prepared baby formula milk, breast milk, or water.",
      "Mix the egg, mashed potato, and milk until smooth.",
      "Pour the mixture into a small heat-safe square plate or bowl.",
      "Beat the second egg in a separate bowl.",
      "Pour the beaten egg gently on top of the potato mixture.",
      "Steam or bake the pudding with gentle heat until the egg is fully cooked and the pudding is set.",
      "Check that there is no runny raw egg left.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft pudding with egg and potato.",
    "advantages": "A soft baby pudding with protein, energy, and a smooth texture. Egg provides protein and important nutrients that support growth. Potato gives gentle energy and makes the pudding soft and filling. Formula milk, breast milk, or water helps make the texture smoother and easier for babies over 6 months to swallow. Because egg can be an allergenic food, it should be fully cooked and introduced in a small portion first."
  },
  "carp-egg-mash": {
    "id": "carp-egg-mash",
    "name": "Carp Egg Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "mrigal carp",
      "carrot",
      "chayote",
      "egg yolk",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare 2 small pieces of mrigal carp.",
      "Boil the fish until it is fully cooked.",
      "Remove all bones, skin, and hard pieces from the cooked fish very carefully.",
      "Boil 1 carrot until it becomes very soft.",
      "Boil 1 chayote until it becomes soft.",
      "Boil 1 egg until it is fully cooked.",
      "Remove the egg white and use only the cooked egg yolk.",
      "Put the boneless cooked fish, soft carrot, and cooked egg yolk into a bowl.",
      "Mash them together until soft and smooth.",
      "Cut the soft chayote into very small pieces.",
      "Add a very small amount of oil to a pan.",
      "Add the mashed fish, carrot, and egg yolk mixture to the pan.",
      "Cook on low heat while stirring gently.",
      "Add the small chayote pieces.",
      "Cook until everything is soft and well mixed.",
      "Mash again if needed so the texture is easy for the baby to swallow.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft fish mash with egg and vegetables.",
    "advantages": "A soft baby mash with protein and vegetables. Mrigal carp provides protein that supports growth and body strength, but all bones must be removed carefully. Egg yolk adds protein and important nutrients for growth. Carrot gives natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Chayote is light, soft, and gentle, helping make the meal smoother and easier to eat. A very small amount of oil helps soften the texture and makes the mash more filling."
  },
  "carrot-egg-custard": {
    "id": "carrot-egg-custard",
    "name": "Carrot Egg Custard",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "carrot",
      "egg yolk",
      "water"
    ],
    "steps": [
      "Prepare 1 carrot.",
      "Cut the carrot into small pieces.",
      "Add the carrot pieces to a pot.",
      "Add enough water until the carrot pieces are fully soaked.",
      "Boil the carrot until it becomes very soft.",
      "Put the soft carrot and a little boiled carrot water into a blender.",
      "Blend until smooth.",
      "Pour the blended carrot mixture into a clean cloth and squeeze out the carrot juice.",
      "Add 1 egg yolk into a small square heat-safe cup.",
      "Add the carrot juice to the egg yolk.",
      "Mix them well until smooth.",
      "Cover the cup loosely with a lid or foil. Do not close it too tightly.",
      "Steam the cup for about 15 minutes, or cook with gentle heat until the custard is fully set.",
      "Check that there is no runny raw egg left.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft custard with carrot and egg yolk.",
    "advantages": "A soft baby custard with vegetable sweetness and egg yolk. Carrot gives natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Egg yolk provides protein and important nutrients that support baby growth. The soft custard texture makes it gentle and easy for babies over 6 months to swallow. Because egg can be an allergenic food, it should be fully cooked and served in a small amount first."
  },
  "chicken-tomato-curry": {
    "id": "chicken-tomato-curry",
    "name": "Chicken Tomato Curry",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "chicken",
      "garlic",
      "onion",
      "turmeric",
      "tomato",
      "iodized salt",
      "kid soy sauce",
      "water",
      "oil"
    ],
    "steps": [
      "Prepare a small piece of chicken.",
      "Chop a small amount of garlic and onion.",
      "Add a little oil to a pan.",
      "Add the garlic and onion, then stir-fry gently until fragrant.",
      "Add the chicken to the pan.",
      "Add a small pinch of turmeric.",
      "Add enough water to cook the chicken.",
      "Cook until the chicken is fully cooked and soft.",
      "Take the chicken out of the pan.",
      "Separate the meat from the bones carefully.",
      "Use only the cooked chicken meat. Do not use bones.",
      "Put the chicken meat into a blender.",
      "Add tomato and blend until smooth.",
      "Put the blended chicken and tomato mixture back into the pan.",
      "Add a very small amount of iodized salt or kid soy sauce only if needed.",
      "Cook on low heat until the curry becomes thicker and most of the water is gone.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft chicken curry with tomato flavor.",
    "advantages": "A soft curry-style meal for kids over 1 year. Chicken provides protein that supports growth and body strength. Tomato adds moisture, gentle sour-sweet flavor, and vitamin C. Garlic and onion add aroma and taste. Turmeric gives color and mild flavor. Iodized salt or kid soy sauce should be used only in a very small amount because young children do not need much added salt."
  },
  "lima-bean-stir-fry": {
    "id": "lima-bean-stir-fry",
    "name": "Lima Bean Stir-Fry",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "lima beans",
      "onion",
      "meat",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare a small amount of lima beans.",
      "Slice the lima beans into small eatable pieces.",
      "Thinly slice a small amount of onion.",
      "Add a little oil to a pan.",
      "Add the sliced onion and stir-fry until it becomes soft and golden.",
      "If you have leftover cooked meat, cut it into very small pieces and add it to the pan.",
      "Add the sliced lima beans.",
      "Stir-fry the lima beans, onion, and meat together for a few minutes.",
      "Add enough water to help the lima beans cook fully.",
      "Cook on low to medium heat until the lima beans become very soft.",
      "Stir gently until most of the water is gone.",
      "Let it cool before serving. Cut or mash more if needed."
    ],
    "shortAdvantages": "Soft bean stir-fry with onion and meat.",
    "advantages": "A simple soft stir-fry for kids over 1 year. Lima beans provide plant-based protein, fiber, and energy, helping make the meal filling. Onion adds natural flavor and aroma. Meat adds extra protein that supports growth and body strength. Cooking the lima beans until very soft makes the food easier for young children to chew and eat."
  },
  "shrimp-rice-porridge": {
    "id": "shrimp-rice-porridge",
    "name": "Shrimp Rice Porridge",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "shrimp",
      "rice",
      "bell pepper",
      "carrot",
      "tomato",
      "garlic",
      "turmeric",
      "pink salt",
      "pepper",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare 3 small pieces of shrimp.",
      "Remove the shrimp shell, tail, and vein carefully.",
      "Cut the shrimp into very small pieces.",
      "Mix the shrimp with a very tiny pinch of pink salt and turmeric.",
      "Slice a small amount of bell pepper into small pieces.",
      "Slice carrot into small pieces.",
      "Slice tomato into small pieces.",
      "Finely chop a small amount of garlic.",
      "Add a little oil to a pan.",
      "Add the garlic and stir-fry gently until fragrant.",
      "Add the shrimp and cook until it turns golden and fully cooked.",
      "Add the tomato, bell pepper, and carrot.",
      "Add a very small pinch of pepper only if needed.",
      "Add 3 tablespoons of cooked rice.",
      "Add enough water to make porridge.",
      "Cook on low heat until the rice becomes very soft and porridge-like.",
      "Stir gently until everything is soft and well mixed.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft shrimp porridge with vegetables.",
    "advantages": "A warm soft porridge for kids over 1 year. Shrimp provides protein that supports growth and body strength, but it is a shellfish allergen, so it should be given only if the child has already tried shrimp safely before. Rice gives energy and makes the meal filling. Bell pepper provides vitamin C and color. Carrot adds natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Tomato adds moisture, gentle flavor, and vitamin C. Garlic, turmeric, and a tiny amount of pepper add flavor, while pink salt should be used only in a very small amount."
  },
  "lamb-bean-stew": {
    "id": "lamb-bean-stew",
    "name": "Lamb Bean Stew",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "lamb",
      "red bean",
      "potato",
      "garlic",
      "turmeric",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare 10g of lamb.",
      "Cut the lamb into small pieces.",
      "Prepare 3 tablespoons of cooked or soaked red beans.",
      "Prepare a small amount of potato and cut it into small pieces.",
      "Finely chop a small amount of garlic.",
      "Add a little oil to a pan.",
      "Add a small pinch of turmeric to the pan.",
      "Add the garlic and stir-fry gently until fragrant.",
      "Add the lamb and stir-fry until the outside changes color.",
      "Add the red beans and potato.",
      "Stir-fry everything together for about 1 minute.",
      "Put everything into a pressure cooker.",
      "Add enough water to cook the lamb, beans, and potato until very soft.",
      "Pressure cook until the lamb is fully cooked and tender.",
      "After cooking, check that the beans and potato are soft.",
      "Mash or cut everything into small pieces before serving.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft lamb stew with beans and potato.",
    "advantages": "A soft and filling stew for kids over 1 year. Lamb provides protein and iron that support growth and body strength. Red beans add plant-based protein, fiber, and energy, helping make the meal more filling. Potato gives soft energy and makes the stew gentle and satisfying. Garlic and turmeric add aroma, color, and mild flavor. Everything should be cooked until very soft and cut or mashed into small pieces before serving."
  },
  "chicken-veggie-gravy": {
    "id": "chicken-veggie-gravy",
    "name": "Chicken Veggie Gravy",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "chicken",
      "corn",
      "carrot",
      "green onion",
      "onion",
      "egg",
      "corn starch",
      "chicken soup",
      "pink salt",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare small pieces of corn, carrot, chicken, green onion, and onion.",
      "Slice all ingredients into small child-friendly pieces.",
      "Boil or cook the chicken first, then cut it into very small pieces.",
      "Keep some boiled chicken soup for cooking.",
      "When the pan is hot, add a little oil.",
      "Add the onion and stir-fry until soft and fragrant.",
      "Add the corn, carrot, green onion, and cooked chicken.",
      "Stir-fry everything together for a few minutes.",
      "Crack 1 egg into the pan.",
      "Stir-fry again until the egg is fully cooked and not runny.",
      "Add a very tiny pinch of pink salt only if needed.",
      "Add the boiled chicken soup.",
      "Cook until the vegetables become soft.",
      "In a small bowl, mix 3 tablespoons of corn starch with a little water to make a smooth corn starch mixture.",
      "Slowly add the corn starch mixture into the pan while stirring.",
      "Cook until the gravy becomes thick and smooth.",
      "Serve with soft cooked rice.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft chicken gravy with vegetables and egg.",
    "advantages": "A soft gravy-style meal for kids over 1 year. Chicken provides protein that supports growth and body strength. Egg adds more protein and important nutrients, making the meal more filling. Corn gives natural sweetness and energy. Carrot provides fiber and vitamin A, which supports healthy eyes and growth. Onion and green onion add gentle flavor and aroma. Chicken soup makes the gravy soft and easier to eat with rice. Corn starch helps thicken the gravy, but it should be mixed with water first before adding to the pan."
  },
  "tofu-rice-patty": {
    "id": "tofu-rice-patty",
    "name": "Tofu Rice Patty",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "rice",
      "tofu",
      "carrot",
      "egg",
      "green onion",
      "flour",
      "oil"
    ],
    "steps": [
      "Put soft cooked rice into a bowl.",
      "Prepare 1 big piece of tofu.",
      "Mash the tofu gently.",
      "Slice carrot into very small pieces.",
      "Add the carrot, tofu, and rice into the bowl.",
      "Add 1 egg.",
      "Add a little finely chopped green onion.",
      "Add 1 tablespoon of flour.",
      "Mix everything together until it becomes one soft mixture.",
      "Shape the mixture into small patties or any shape you like.",
      "Add a little oil to a pan.",
      "Fry the patties on low to medium heat.",
      "Cook both sides until golden and the egg is fully cooked inside.",
      "Let them cool before serving. Cut into small pieces if needed."
    ],
    "shortAdvantages": "Soft rice patty with tofu and vegetables.",
    "advantages": "A soft and filling patty for kids over 1 year. Rice gives energy and makes the patty filling. Tofu provides plant-based protein and a soft texture. Carrot adds natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Egg adds protein and helps hold the patty together. Green onion gives gentle flavor, and flour helps the mixture keep its shape while frying."
  },
  "potato-cheese-balls": {
    "id": "potato-cheese-balls",
    "name": "Potato Cheese Balls",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "potato",
      "flour",
      "salt",
      "butter",
      "cheese powder",
      "oil"
    ],
    "steps": [
      "Boil the potato until it becomes very soft.",
      "Mash the boiled potato into a smooth potato paste.",
      "Add 2 tablespoons of flour.",
      "Add a very tiny pinch of salt only if needed.",
      "Add 1 teaspoon of butter or a little cooking oil.",
      "Add a small amount of baby cheese powder.",
      "Mix everything together until it becomes a soft dough-like mixture.",
      "Shape the mixture into small round balls.",
      "Add a little oil to a pan.",
      "Fry the potato balls on low to medium heat.",
      "Turn them gently until all sides become golden.",
      "Take them out and let them cool before serving.",
      "Cut into small pieces if needed."
    ],
    "shortAdvantages": "Soft potato balls with mild cheese flavor.",
    "advantages": "A soft snack-style food for kids over 1 year. Potato gives energy and makes the balls soft and filling. Flour helps hold the shape together. Cheese powder adds flavor and can provide calcium and protein, but it should be used in a small amount because cheese products can be salty. Butter or oil helps make the texture softer and gives a gentle rich taste. Salt should be optional and used only in a very tiny amount."
  },
  "mackerel-rice-balls": {
    "id": "mackerel-rice-balls",
    "name": "Mackerel Rice Balls",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "mackerel",
      "carrot",
      "bell pepper",
      "rice",
      "egg",
      "oil",
      "water"
    ],
    "steps": [
      "Prepare 2 small pieces of mackerel fish.",
      "Prepare 1 carrot and cut it into small pieces.",
      "Prepare a small amount of bell pepper and cut it into small pieces.",
      "Put the mackerel, carrot, and bell pepper into a steaming pot.",
      "Steam until the fish is fully cooked and the vegetables become soft.",
      "Remove all bones, skin, and hard pieces from the cooked mackerel very carefully.",
      "Put the cooked mackerel, carrot, and bell pepper into a blender.",
      "Add 3 tablespoons of cooked rice.",
      "Blend everything until it becomes a soft mixture.",
      "Add 1 egg to the mixture.",
      "Mix again until everything is combined well.",
      "Shape the mixture into small round balls.",
      "Add a little oil to a pan.",
      "Fry the balls on low to medium heat.",
      "Turn them gently until all sides become golden.",
      "Cook until the egg inside is fully cooked and not runny.",
      "Let them cool before serving. Cut into small pieces if needed."
    ],
    "shortAdvantages": "Soft fish rice balls with vegetables.",
    "advantages": "A soft fish ball recipe for kids over 1 year. Mackerel provides protein and helps make the meal filling. Rice gives energy and helps hold the balls together. Carrot adds natural sweetness, fiber, and helpful vegetable nutrients. Bell pepper adds color, flavor, and extra vitamins. Egg helps bind the mixture and adds more protein. The fish must be checked carefully so there are no bones before blending."
  },
  "shrimp-pea-rice": {
    "id": "shrimp-pea-rice",
    "name": "Shrimp Pea Rice",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "shrimp",
      "green peas",
      "rice",
      "carrot",
      "onion",
      "turmeric",
      "pink salt",
      "kid soy sauce",
      "oil",
      "water"
    ],
    "steps": [
      "Put 2 tablespoons of green peas into a bowl.",
      "Add enough water until the green peas are fully soaked.",
      "Leave the green peas to soak for one day before cooking.",
      "Before cooking, drain and rinse the soaked green peas.",
      "Slice a small amount of onion into thin pieces.",
      "Prepare 3 shrimps and remove the shell, tail, and vein carefully.",
      "Cut the shrimp into small child-friendly pieces.",
      "Prepare carrot and cut it into small pieces.",
      "Add a little oil to a pan.",
      "Add the sliced onion and stir-fry until soft and fragrant.",
      "Add a small pinch of turmeric.",
      "Add the shrimp and stir-fry until the outside changes color.",
      "Add the carrot and soaked green peas.",
      "Stir-fry everything together for a little while.",
      "Add raw rice to the pan and mix it with all ingredients.",
      "Add enough water to cook the rice, peas, carrot, and shrimp until soft.",
      "Add a very tiny pinch of pink salt or a very small amount of kid soy sauce only if needed.",
      "Cook on low heat until the rice becomes soft and the shrimp is fully cooked.",
      "Stir gently until everything becomes soft and rice-like.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft shrimp rice with peas and carrot.",
    "advantages": "A soft rice meal for kids over 1 year. Shrimp provides protein that supports growth and body strength, but it is a shellfish allergen, so it should be given only if the child has already tried shrimp safely before. Green peas provide plant-based protein, fiber, and energy, helping make the meal filling. Rice gives gentle energy and makes the dish soft. Carrot adds natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Onion and turmeric add aroma, color, and mild flavor. Pink salt and kid soy sauce should be used only in a very tiny amount or skipped."
  },
  "shrimp-carrot-patties": {
    "id": "shrimp-carrot-patties",
    "name": "Shrimp Carrot Patties",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "shrimp",
      "carrot",
      "corn starch",
      "rice",
      "oil",
      "salt",
      "water"
    ],
    "steps": [
      "Prepare a small amount of shrimp.",
      "Remove the shrimp shell, tail, and vein carefully.",
      "Prepare carrot and cut it into small pieces.",
      "Put the shrimp and carrot into a blender.",
      "Blend until it becomes a soft mixture.",
      "Add 1 tablespoon of corn starch.",
      "Mix everything together until the mixture can hold its shape.",
      "Shape the mixture into small round and thin patties.",
      "Add a little oil to a pan.",
      "Fry the patties on low to medium heat.",
      "Turn them gently and cook both sides until golden.",
      "Make sure the shrimp patties are fully cooked inside.",
      "For serving, mix soft cooked rice with a little cooked oil.",
      "Add a very tiny pinch of salt only if needed.",
      "Serve the shrimp carrot patties with the rice.",
      "Let the food cool before serving."
    ],
    "shortAdvantages": "Soft shrimp patties with carrot and rice.",
    "advantages": "A soft patty-style meal for kids over 2 years. Shrimp provides protein that supports growth and body strength, but it is a shellfish allergen, so it should be served only if the child has already tried shrimp safely before. Carrot adds natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth. Corn starch helps the patties hold their shape. Rice gives energy and makes the meal more filling. Oil helps fry the patties and gives a soft texture, while salt should be used only in a very tiny amount or skipped."
  },
  "pork-rice-gravy": {
    "id": "pork-rice-gravy",
    "name": "Pork Rice Gravy",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "pork",
      "onion",
      "rice",
      "corn starch",
      "kid soy sauce",
      "oil",
      "water"
    ],
    "steps": [
      "Slice the pork into small thin pieces.",
      "Slice a small amount of onion.",
      "Add a little oil to a pan.",
      "Add the onion and stir-fry until soft and fragrant.",
      "Add the pork and stir-fry together with the onion.",
      "Add a very small amount of kid soy sauce or baby-friendly seasoning only if needed.",
      "Add enough water to help the pork cook.",
      "Cook until the pork is fully cooked and soft.",
      "In a small bowl, mix 1 tablespoon of corn starch with a little water.",
      "Add a very small amount of kid soy sauce to the corn starch mixture if needed.",
      "Mix the corn starch mixture well until smooth.",
      "Pour the corn starch mixture into the pan.",
      "Stir-fry again with the pork until the sauce becomes thick and smooth.",
      "Prepare soft cooked rice in a bowl.",
      "Pour the cooked pork gravy over the rice.",
      "Let it cool before serving."
    ],
    "shortAdvantages": "Soft pork gravy served with rice.",
    "advantages": "A soft rice meal for kids over 2 years. Pork provides protein and iron that support growth and body strength. Rice gives energy and makes the meal filling. Onion adds natural flavor and aroma. Corn starch helps make the sauce thicker and smoother, so it is easier to mix with rice. Kid soy sauce or seasoning should be used only in a very small amount because young children do not need much added salt."
  },
  "veggie-sprout-pancake": {
    "id": "veggie-sprout-pancake",
    "name": "Veggie Sprout Pancake",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "tempura flour",
      "bean sprouts",
      "tomato",
      "green peas",
      "oil",
      "water"
    ],
    "steps": [
      "Add 3 tablespoons of tempura flour into a bowl.",
      "Add a little water slowly.",
      "Mix well until it becomes a smooth pancake batter.",
      "Prepare a few bean sprouts and cut them smaller if needed.",
      "Prepare tomato and cut it into small pieces.",
      "Prepare boiled green peas.",
      "Add a little oil to a non-stick pan.",
      "Pour the flour batter into the pan and spread it into a thin pancake shape.",
      "Cook for a few seconds until the bottom starts to set.",
      "Put the bean sprouts, tomato, and boiled green peas on top of the batter.",
      "Cook on low to medium heat until the bottom becomes light brown.",
      "Flip the pancake carefully to the other side.",
      "Cook until the bean sprouts are fully cooked and the pancake is golden on both sides.",
      "Let it cool before serving.",
      "Cut into small child-friendly pieces."
    ],
    "shortAdvantages": "Soft veggie pancake with sprouts and peas.",
    "advantages": "A soft pancake-style snack for kids over 2 years. Tempura flour helps make the pancake base and holds the vegetables together. Bean sprouts add crunch and vegetable nutrients, but they must be fully cooked for young children. Tomato adds moisture, flavor, and vitamin C. Green peas provide plant-based protein, fiber, and energy, making the pancake more filling. A little oil helps cook the pancake until golden."
  },
  "sesame-egg-toast": {
    "id": "sesame-egg-toast",
    "name": "Sesame Egg Toast",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "bread",
      "egg",
      "milk",
      "black sesame",
      "oil"
    ],
    "steps": [
      "Crack 1 egg into a bowl.",
      "Add a small amount of baby milk, formula milk, or regular milk.",
      "Mix the egg and milk well.",
      "Add a small amount of black sesame.",
      "Prepare 2 slices of bread.",
      "Soak the bread slices in the egg and milk mixture.",
      "Add a little oil to a pan.",
      "Place the soaked bread slices into the pan.",
      "Fry on low to medium heat until the bottom becomes golden.",
      "Flip the bread carefully and cook the other side.",
      "Cook until the egg coating is fully cooked and the bread is golden on both sides.",
      "Let it cool before serving.",
      "Cut into small child-friendly pieces."
    ],
    "shortAdvantages": "Soft golden toast with egg and sesame.",
    "advantages": "A soft toast-style snack for kids over 2 years. Bread gives energy and makes the snack filling. Egg provides protein and helps coat the bread with a soft texture. Milk makes the toast softer and gives a gentle taste. Black sesame adds extra flavor and texture. The egg should be cooked fully before serving."
  },
  "fruit-pancakes": {
    "id": "fruit-pancakes",
    "name": "Fruit Pancakes",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "pancake",
      "fruit",
      "banana"
    ],
    "steps": [
      "Place the pancake on a clean plate.",
      "Prepare the soft fruit.",
      "Cut or mash the fruit into a suitable texture.",
      "Place the prepared fruit on the pancake.",
      "Allow the food to cool before serving."
    ],
    "shortAdvantages": "Rich in vitamins",
    "advantages": "Rich in vitamins"
  },
  "beef-noodle-cheese-soup": {
    "id": "beef-noodle-cheese-soup",
    "name": "Beef Noodle Cheese Soup",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "rice noodles",
      "beef",
      "cheese",
      "kid soy sauce",
      "salt",
      "water"
    ],
    "steps": [
      "Add fermented rice noodles or rice noodles to boiling water.",
      "Cook the noodles for about 1 minute, or until they become soft.",
      "Prepare sliced beef.",
      "Before adding the beef to the noodles, fry or cook the beef first until it is fully cooked.",
      "Add the cooked sliced beef to the noodle pot.",
      "Add a very small amount of kid soy sauce only if needed.",
      "Add a very tiny pinch of salt only if needed.",
      "Add 2 small pieces of baby cheese.",
      "Cook on low heat and stir gently until the cheese melts into the soup.",
      "Continue cooking until the noodles are soft and there is still a little water left in the pan.",
      "Let it cool before serving.",
      "Cut the noodles and beef into small child-friendly pieces if needed."
    ],
    "shortAdvantages": "Soft noodle soup with beef and cheese.",
    "advantages": "A soft noodle meal for kids over 2 years. Rice noodles give energy and make the meal filling. Beef provides protein and iron that support growth and body strength. Cheese adds a creamy taste and can provide calcium and protein. Kid soy sauce and salt should be used only in a very tiny amount or skipped because young children do not need much added salt. The beef should be fully cooked and cut into small soft pieces before serving."
  },
  "egg-biscuit-mash": {
    "id": "egg-biscuit-mash",
    "name": "Egg Biscuit Mash",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "egg",
      "kids biscuit"
    ],
    "steps": [
      "Boil the egg until it is fully cooked and firm.",
      "Let the boiled egg cool down slightly.",
      "Peel the egg carefully.",
      "Mash the egg with a fork until it becomes soft and paste-like.",
      "Crush a small amount of kid-friendly biscuit into fine crumbs.",
      "Add the biscuit crumbs to the mashed egg.",
      "Mix everything together until soft and easy to eat.",
      "Serve in a small portion."
    ],
    "shortAdvantages": "A soft and simple snack with protein from egg and extra energy...",
    "advantages": "A soft and simple snack with protein from egg and extra energy from biscuit. Best served occasionally and in a small portion."
  },
  "rice-fish-chicken-veggie-puree": {
    "id": "rice-fish-chicken-veggie-puree",
    "name": "Rice Fish or Chicken Veggie Puree",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "rice",
      "fish",
      "chicken",
      "red bean",
      "potato",
      "pumpkin",
      "broccoli",
      "oil"
    ],
    "steps": [
      "Use 2 tablespoons of cooked rice. If using raw rice, cook 1 tablespoon of rice first until very soft.",
      "Choose a small amount of fish or chicken.",
      "Cook the fish or chicken fully. Remove all bones, skin, and hard pieces.",
      "Boil the potato, pumpkin, broccoli, and red bean until very soft.",
      "Put the cooked rice, cooked fish or chicken, red bean, potato, pumpkin, and broccoli into a blender.",
      "Add a small amount of warm water, breast milk, or formula to help blend smoothly.",
      "Add a very small amount of oil.",
      "Blend everything until it becomes a smooth puree.",
      "Pour the blended mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A balanced baby puree that combines energy, protein, and...",
    "advantages": "A balanced baby puree that combines energy, protein, and vegetables in one soft meal. Rice and potato provide gentle energy, fish or chicken adds protein for growth, red bean gives extra plant-based nutrients, and pumpkin and broccoli add vitamins, minerals, and fiber. The smooth texture makes it easier for babies over 6 months to swallow."
  },
  "rice-pumpkin-snow-pea-fish-puree": {
    "id": "rice-pumpkin-snow-pea-fish-puree",
    "name": "Rice Pumpkin Snow Pea Fish Puree",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "rice",
      "pumpkin",
      "snow pea",
      "fish",
      "oil"
    ],
    "steps": [
      "Use 2 tablespoons of cooked rice.",
      "Prepare 2 small pieces of sweet pumpkin.",
      "Prepare 3 to 4 pieces of snow pea.",
      "Use a very small amount of boneless and skinless fish.",
      "Boil or steam the pumpkin and snow peas until very soft.",
      "Cook the fish fully and check carefully that there are no bones or hard pieces.",
      "Put the cooked rice, pumpkin, snow peas, and fish into a blender.",
      "Add a very small amount of oil.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Blend everything until it becomes a smooth puree.",
      "Pour the blended mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A gentle baby puree that combines energy, protein, and vegetables...",
    "advantages": "A gentle baby puree that combines energy, protein, and vegetables in one soft meal. Rice gives gentle energy, fish provides protein for growth, pumpkin adds natural sweetness with vitamins, and snow peas add extra nutrients and fiber. The smooth texture makes it easier for babies over 6 months to swallow."
  },
  "rice-carrot-chayote-fish-chicken-puree": {
    "id": "rice-carrot-chayote-fish-chicken-puree",
    "name": "Rice Carrot Chayote Fish or Chicken Puree",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "rice",
      "fish",
      "chicken",
      "red bean",
      "carrot",
      "chayote",
      "snow pea",
      "oil"
    ],
    "steps": [
      "Use 2 tablespoons of cooked rice.",
      "Choose 1 small piece of boneless and skinless fish or chicken.",
      "Cook the fish or chicken fully. Remove all bones, skin, and hard pieces.",
      "Prepare 1 teaspoon of red bean and cook it until very soft.",
      "Peel and cut 1 carrot into small pieces.",
      "Prepare 2 small pieces of chayote.",
      "Prepare 3 pieces of snow pea.",
      "Boil or steam the carrot, chayote, and snow peas until very soft.",
      "Put the cooked rice, cooked fish or chicken, soft red bean, carrot, chayote, and snow peas into a blender.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Add a very small amount of oil.",
      "Blend everything until it becomes a smooth puree.",
      "Pour the blended mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A balanced baby puree with energy, protein, and vegetables in one...",
    "advantages": "A balanced baby puree with energy, protein, and vegetables in one soft meal. Rice gives gentle energy, fish or chicken provides protein for growth, red bean adds plant-based nutrients, carrot supports eye health with vitamin A, chayote is light and gentle, snow peas add fiber and vitamins, and a small amount of oil helps make the puree smoother and more filling."
  },
  "chicken-broccoli-mash": {
    "id": "chicken-broccoli-mash",
    "name": "Chicken Broccoli Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "chicken",
      "broccoli",
      "pumpkin"
    ],
    "steps": [
      "Prepare 1 small piece of chicken breast.",
      "Boil the chicken breast until it is fully cooked.",
      "Cut the cooked chicken into very small pieces.",
      "Prepare 3 small pieces of white broccoli or cauliflower.",
      "Prepare 2 small pieces of sweet pumpkin.",
      "Boil or steam the broccoli and pumpkin until very soft.",
      "Put the cooked chicken, broccoli, and pumpkin into a blender.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Blend until the mixture becomes soft and smooth.",
      "Pour the blended mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A soft baby mash with protein and vegetables.",
    "advantages": "A soft baby mash with protein and vegetables. Chicken provides protein that supports growth and body strength. Broccoli or cauliflower gives vitamins, minerals, and fiber to support digestion. Sweet pumpkin adds natural sweetness, gentle energy, and vitamin A, which supports healthy eyes and growth."
  },
  "beet-apple-oat-mash": {
    "id": "beet-apple-oat-mash",
    "name": "Beet Apple Oat Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "beetroot",
      "apple",
      "baby oatmeal",
      "water"
    ],
    "steps": [
      "Prepare 2 small pieces of beetroot.",
      "Prepare 2 small pieces of apple.",
      "Boil or steam the beetroot and apple until very soft.",
      "Put the soft beetroot and apple into a blender.",
      "Add 2 tablespoons of baby oatmeal.",
      "Add a little warm water to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A naturally sweet and colorful baby mash with fruit, vegetable,...",
    "advantages": "A naturally sweet and colorful baby mash with fruit, vegetable, and grain in one meal. Beetroot provides fiber and useful minerals, apple adds gentle natural sweetness and vitamin C, and baby oatmeal gives soft energy and helps make the meal more filling. The smooth texture makes it easier for babies over 6 months to swallow."
  },
  "spinach-potato-mash": {
    "id": "spinach-potato-mash",
    "name": "Spinach Potato Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "spinach",
      "yellow bean",
      "potato"
    ],
    "steps": [
      "Prepare 5 to 6 spinach leaves.",
      "Prepare 1 teaspoon of yellow bean.",
      "Prepare 2 small pieces of potato.",
      "Wash the spinach leaves carefully.",
      "Cook the yellow bean until it becomes very soft.",
      "Boil or steam the potato until it is very soft.",
      "Add the spinach leaves near the end and cook until soft.",
      "Put the cooked spinach, yellow bean, and potato into a blender.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "A gentle green baby mash with vegetables and plant-based nutrients.",
    "advantages": "A gentle green baby mash with vegetables and plant-based nutrients. Spinach provides vitamins and minerals that support healthy growth. Potato gives soft energy and makes the mash creamy and filling. Yellow bean adds plant-based protein and extra nutrients, helping make the meal more balanced for babies over 6 months."
  },
  "egg-avocado-mash": {
    "id": "egg-avocado-mash",
    "name": "Egg Avocado Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "egg yolk",
      "carrot",
      "avocado"
    ],
    "steps": [
      "Boil 1 egg until it is fully cooked.",
      "Let the egg cool down, then peel it carefully.",
      "Remove the egg white and use only the cooked egg yolk.",
      "Prepare 2 small pieces of carrot.",
      "Boil or steam the carrot until it becomes very soft.",
      "Prepare half of a ripe avocado.",
      "Put the cooked egg yolk, soft carrot, and avocado into a blender.",
      "Add a little warm water, breast milk, or formula to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Serve a small portion first."
    ],
    "shortAdvantages": "Creamy mash with healthy fat and protein.",
    "advantages": "A creamy baby mash with protein, healthy fat, and vegetables. Egg yolk provides protein and nutrients that support growth. Avocado gives healthy fat and a soft creamy texture, which helps make the meal filling. Carrot adds natural sweetness, fiber, and vitamin A, which supports healthy eyes and growth."
  },
  "bok-choy-rice-mash": {
    "id": "bok-choy-rice-mash",
    "name": "Bok Choy Rice Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "rice",
      "bok choy",
      "carrot",
      "formula milk",
      "water"
    ],
    "steps": [
      "Use 2 tablespoons of cooked rice.",
      "Prepare 4 leaves of bok choy.",
      "Prepare 4 small pieces of carrot.",
      "Wash the bok choy and carrot carefully.",
      "Boil or steam the carrot until it becomes very soft.",
      "Add the bok choy near the end and cook until soft.",
      "Put the cooked rice, soft carrot, and bok choy into a blender.",
      "Add 2 tablespoons of correctly prepared baby formula milk, breast milk, or water.",
      "Add a little warm water if needed to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft rice mash with greens and carrot.",
    "advantages": "A soft baby mash with grain and vegetables in one gentle meal. Rice gives mild energy and helps make the mash filling. Bok choy adds green vegetable nutrients, vitamins, and fiber. Carrot gives natural sweetness and vitamin A, which supports healthy eyes and growth. Formula milk, breast milk, or water helps make the texture smoother and easier for babies over 6 months to swallow."
  },
  "chayote-rice-mash": {
    "id": "chayote-rice-mash",
    "name": "Chayote Rice Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "chayote",
      "corn",
      "tomato",
      "rice",
      "water"
    ],
    "steps": [
      "Prepare 3 small pieces of chayote.",
      "Prepare a small amount of corn.",
      "Prepare half of a tomato.",
      "Use 2 tablespoons of cooked rice.",
      "Wash the chayote, corn, and tomato carefully.",
      "Boil or steam the chayote and corn until very soft.",
      "Add the tomato and cook until soft.",
      "Put the cooked chayote, corn, tomato, and cooked rice into a blender.",
      "Add a little warm water to help blend smoothly.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft rice mash with light vegetables.",
    "advantages": "A gentle baby mash with rice and soft vegetables. Rice gives mild energy and helps make the meal filling. Chayote is light, soft, and gentle for babies. Corn adds natural sweetness and extra energy, but it should be cooked very soft and blended smoothly. Tomato adds flavor, moisture, and vitamins. This smooth texture makes it easier for babies over 6 months to swallow."
  },
  "broccoli-rice-mash": {
    "id": "broccoli-rice-mash",
    "name": "Broccoli Rice Mash",
    "category": "Kid Foods",
    "ageGroup": "6-12 months",
    "image": "",
    "ingredients": [
      "rice",
      "formula milk",
      "broccoli",
      "carrot",
      "mustard greens",
      "water"
    ],
    "steps": [
      "Use 2 tablespoons of cooked rice.",
      "Prepare 2 tablespoons of correctly prepared baby formula milk.",
      "Prepare 2 small pieces of broccoli.",
      "Prepare 2 to 3 small pieces of carrot.",
      "Prepare a medium amount of mustard greens.",
      "Wash the broccoli, carrot, and mustard greens carefully.",
      "Boil or steam the carrot and broccoli until very soft.",
      "Add the mustard greens near the end and cook until soft.",
      "Put the cooked rice, broccoli, carrot, and mustard greens into a blender.",
      "Add the formula milk and a little warm water if needed.",
      "Blend everything until it becomes a smooth mash or puree.",
      "Pour the mixture into a small pan.",
      "Cook on low heat for a few minutes while stirring gently.",
      "Let it cool before serving. Serve only a small portion first."
    ],
    "shortAdvantages": "Soft rice mash with green vegetables.",
    "advantages": "A soft baby mash with rice, milk, and green vegetables. Rice gives gentle energy and helps make the meal filling. Formula milk helps create a smoother texture and adds familiar taste for the baby. Broccoli provides vitamins, minerals, and fiber. Carrot adds natural sweetness and vitamin A, which supports healthy eyes and growth. Mustard greens add extra green vegetable nutrients, but they should be cooked very soft and blended smoothly for babies over 6 months."
  },
  "burmese-chicken-curry": {
    "id": "burmese-chicken-curry",
    "name": "Burmese Chicken Curry",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "chicken",
      "masala",
      "clausena excavata",
      "garlic"
    ],
    "steps": [
      "Put oil into the pan.",
      "Put garlic and onion paste into the pan.",
      "Also put Clausena excavata together",
      "When everything is ready,put chicken and coook until all the water in chicken is gone.",
      "And then put large amount of water and cook until for like 1 hour.",
      "When chicken become soft ,the food is ready."
    ],
    "shortAdvantages": "Chicken is rich in protein",
    "advantages": "Chicken is rich in protein"
  },
  "fruit-yogurt": {
    "id": "fruit-yogurt",
    "name": "Fruit Yogurt",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "yogurt",
      "fruit"
    ],
    "steps": [
      "Place the yogurt inside a clean bowl.",
      "Prepare the soft fruit.",
      "Mash the fruit into a smooth texture.",
      "Add the fruit to the yogurt.",
      "Mix everything gently before serving."
    ],
    "shortAdvantages": "Soft and refreshing",
    "advantages": "Soft and refreshing"
  },
  "chicken-rice": {
    "id": "chicken-rice",
    "name": "Chicken Rice",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "chicken",
      "rice",
      "garlic"
    ],
    "steps": [
      "Wash the rice.",
      "Cook the chicken until it is fully cooked.",
      "Mix the chicken and rice together.",
      "Let it cool slightly before serving."
    ],
    "shortAdvantages": "Filling and easy on busy nights",
    "advantages": "Filling and easy on busy nights"
  },
  "chicken-spinach-rice": {
    "id": "chicken-spinach-rice",
    "name": "Chicken Spinach Rice",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "chicken",
      "spinach",
      "rice"
    ],
    "steps": [
      "Prepare the rice.",
      "Cook the chicken until it is fully cooked.",
      "Add spinach and cook until soft.",
      "Mix everything gently."
    ],
    "shortAdvantages": "Protein rich and simple",
    "advantages": "Protein rich and simple"
  },
  "pork-garlic-stir-fry": {
    "id": "pork-garlic-stir-fry",
    "name": "Pork Garlic Stir-Fry",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "pork",
      "garlic",
      "spinach"
    ],
    "steps": [
      "Slice the pork thinly.",
      "Stir-fry pork with garlic until fully cooked.",
      "Add spinach and cook until wilted.",
      "Serve warm with rice if desired."
    ],
    "shortAdvantages": "Quick weeknight dinner",
    "advantages": "Quick weeknight dinner"
  },
  "spinach-egg-scramble": {
    "id": "spinach-egg-scramble",
    "name": "Spinach Egg Scramble",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "spinach",
      "egg",
      "garlic"
    ],
    "steps": [
      "Warm a little oil with garlic.",
      "Add spinach and cook until soft.",
      "Pour in beaten eggs.",
      "Scramble everything together until the egg is cooked."
    ],
    "shortAdvantages": "Ready in under 10 minutes",
    "advantages": "Ready in under 10 minutes"
  },
  "pork-rice-bowl": {
    "id": "pork-rice-bowl",
    "name": "Pork Rice Bowl",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "pork",
      "rice",
      "onion"
    ],
    "steps": [
      "Cook the rice.",
      "Cook pork with onion until fully cooked.",
      "Place the pork mixture over the rice.",
      "Serve warm."
    ],
    "shortAdvantages": "Simple family meal",
    "advantages": "Simple family meal"
  },
  "veggie-rice-balls": {
    "id": "veggie-rice-balls",
    "name": "Veggie Rice Balls",
    "category": "Kid Foods",
    "ageGroup": "above 1 year",
    "image": "",
    "ingredients": [
      "rice",
      "spinach",
      "vegetable"
    ],
    "steps": [
      "Cook the rice until soft.",
      "Prepare soft cooked vegetables.",
      "Mix the rice and vegetables together.",
      "Shape the mixture into small balls.",
      "Let them cool before serving."
    ],
    "shortAdvantages": "Boosts energy",
    "advantages": "Boosts energy"
  },
  "strawberry-yogurt": {
    "id": "strawberry-yogurt",
    "name": "Strawberry Yogurt",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "strawberry",
      "yogurt",
      "milk"
    ],
    "steps": [
      "Wash the strawberries carefully.",
      "Cut the strawberries into small soft pieces.",
      "Place yogurt in a clean bowl.",
      "Add the strawberries to the yogurt.",
      "Mix gently before serving."
    ],
    "shortAdvantages": "Strengthens bones",
    "advantages": "Strengthens bones"
  },
  "mini-sandwich-bites": {
    "id": "mini-sandwich-bites",
    "name": "Mini Sandwich Bites",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "bread",
      "egg",
      "vegetable"
    ],
    "steps": [
      "Place the bread on a clean plate.",
      "Add a soft cooked filling.",
      "Close the sandwich gently.",
      "Cut it into small bite-sized pieces.",
      "Serve fresh."
    ],
    "shortAdvantages": "Protein-packed",
    "advantages": "Protein-packed"
  },
  "apple-oat-cookies": {
    "id": "apple-oat-cookies",
    "name": "Apple Oat Cookies",
    "category": "Kid Foods",
    "ageGroup": "above 2 years",
    "image": "",
    "ingredients": [
      "apple",
      "oat",
      "banana"
    ],
    "steps": [
      "Mash the banana in a clean bowl.",
      "Grate or finely chop the apple.",
      "Mix the apple, banana, and oats together.",
      "Shape the mixture into small cookies.",
      "Bake until firm and let them cool before serving."
    ],
    "shortAdvantages": "High in fiber",
    "advantages": "High in fiber"
  },
  "shrimp-potato-skillet": {
    "id": "shrimp-potato-skillet",
    "name": "Shrimp Potato Skillet",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "shrimp",
      "potato",
      "garlic"
    ],
    "steps": [
      "Wash and cut the potatoes into small pieces.",
      "Cook the potatoes until they become soft.",
      "Add shrimp and garlic.",
      "Cook until the shrimp is fully cooked.",
      "Serve warm."
    ],
    "shortAdvantages": "Warm, filling, and easy to share",
    "advantages": "Warm, filling, and easy to share"
  },
  "shrimp-potato-rice": {
    "id": "shrimp-potato-rice",
    "name": "Shrimp Potato Rice",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "shrimp",
      "potato",
      "rice"
    ],
    "steps": [
      "Cook the rice until soft.",
      "Boil the potato until tender.",
      "Cook the shrimp until fully cooked.",
      "Mix shrimp, potato, and rice together.",
      "Let it cool slightly before serving."
    ],
    "shortAdvantages": "Simple comfort meal",
    "advantages": "Simple comfort meal"
  },
  "chicken-potato-soup": {
    "id": "chicken-potato-soup",
    "name": "Chicken Potato Soup",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "chicken",
      "potato",
      "onion"
    ],
    "steps": [
      "Cut the potato and onion into small pieces.",
      "Cook the chicken until fully cooked.",
      "Add potato, onion, and water.",
      "Simmer until the potato is soft.",
      "Serve warm."
    ],
    "shortAdvantages": "Gentle and comforting",
    "advantages": "Gentle and comforting"
  },
  "chicken-potato-rice": {
    "id": "chicken-potato-rice",
    "name": "Chicken Potato Rice",
    "category": "Daily Meals",
    "ageGroup": null,
    "image": "",
    "ingredients": [
      "chicken",
      "potato",
      "rice"
    ],
    "steps": [
      "Cook the rice.",
      "Boil or steam the potato until soft.",
      "Cook the chicken until fully cooked.",
      "Mix chicken, potato, and rice together.",
      "Serve warm."
    ],
    "shortAdvantages": "Filling family meal",
    "advantages": "Filling family meal"
  }
};

// Make the recipe data available to scripts that read window.recipes.
window.recipes = recipes;
