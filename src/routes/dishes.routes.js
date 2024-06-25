import { Router } from "express";
import { DishesController } from "../controllers/dishes.js";

const routes = Router();

/** 
 * @swagger
 * components:
 *      schemas:
 *          Dishes:
 *              type: object
 *              properties:
 *                  id:  
 *                      type: integer
 *                      description: The auto-generated id of the dish
 *                      example: 1          
 *                  dishes_name:    
 *                      type: string
 *                      description: The name of the dish
 *                      example: "Ceviche"
 *                  description: 
 *                      type: string
 *                      description: The description of the dish
 *                      example: "Plato realizado a base de pescado y limón"
 *                  price:
 *                      type: integer
 *                      description: The price of the dish
 *                      example: S/.15.00
 *                  available:
 *                      type: boolean
 *                      description: The availability of the dish
 *                      example: true
 *                  category_id:
 *                      type: integer
 *                      description: The category id of the dish
 *                      example: 1
 * */

/**
 * @swagger
 * /api/v1/dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: 
 *       - Dishes
 *     description: Return a list of all dishes
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 *                 items:
 *                      $ref: '#/components/schemas/Dishes'
 */
routes.get('/', DishesController.getDishes);

/**
 * @swagger
 * /api/v1/dishes/findByDishName:
 */
routes.get('/findByDishName', DishesController.searchDishesByName)


routes.get('/available', DishesController.getDishesAvailable)
/**
 * @swagger
 * /api/v1/dishes/findDishesByCategoryName:
 *   get:
 *     tags:
 *       - Dishes
 *     summary: Get dishes by category name
 *     description: Multiple Category values can be provided with comma separated strings
 *     operationId: findDishesByCategoryName
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Category values that need to be considered for filter
 *         required: true
 *         schema: 
 *             type: string
 *             default: platos principales
 *             enum:
 *               - platos principales
 *               - entradas
 *               - ensaladas
 *               - postres
 *               - sopas y caldos
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                   $ref: '#/components/schemas/Dishes'
 *       '400':
 *         description: Invalid categoryName value
 * 
 */


routes.get('/findDishesByCategoryName', DishesController.getDishesByCategoryName);

/** 
 * @swagger
 * /api/v1/dishes:
 *   post:
 *     summary: Create a new dish
 *     tags: 
 *       - Dishes
 *     description: Create a new dish and return its details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishes_name:
 *                 type: string
 *                 description: The name of the dish
 *                 example: "Ceviche"
 *               description:
 *                 type: string
 *                 description: The description of the dish
 *                 example: "Plato realizado a base de pescado y limón"
 *               price:
 *                 type: number
 *                 description: The price of the dish
 *                 example: 15.00
 *               available:
 *                 type: boolean
 *                 description: The availability of the dish
 *                 example: true
 *               id_category:
 *                 type: integer
 *                 description: The category id of the dish
 *                 example: 1
 *     responses:
 *       201:
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dishes'
 *       400:
 *         description: Bad request - invalid input data
 */

routes.post('/', DishesController.addDishes);
/**
 * @swagger
 * /api/v1/dishes/{id}:
 *   get:
 *     summary: Get a dish by id
 *     tags:
 *       - Dishes
 *     description: Return a dish by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The id of the dish
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dishes'
 *       404:
 *          description: Not found
 *       400:
 *          description: Bad request
 *       
*/

routes.get('/:id', DishesController.getDishById);

/** 
 * @swagger
 * /api/v1/dishes/{id}:
 *   put:
 *     summary: Update a dish by id
 *     tags:
 *       - Dishes
 *     description: Returns the updated dish
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The id of the dish to update
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishes_name:
 *                 type: string
 *                 description: The name of the dish
 *                 example: "Ceviche"
 *               description:
 *                 type: string
 *                 description: The description of the dish
 *                 example: "Plato realizado a base de pescado y limón"
 *               price:
 *                 type: number
 *                 description: The price of the dish
 *                 example: 15.00
 *               available:
 *                 type: boolean
 *                 description: The availability of the dish
 *                 example: true
 *               id_category:
 *                 type: integer
 *                 description: The category id of the dish
 *                 example: 1
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dishes'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Dish not found
 */

routes.put('/:id', DishesController.updateDishes);

/** 
 * @swagger
 * /api/v1/dishes/{id}:
 *   delete:
 *     summary: Delete a dish by a given id
 *     tags:
 *       - Dishes
 *     description: Return a confirmation message
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The id of the dish to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               value: "Dish deleted successfully"
 *       400:
 *         description: Bad request - invalid ID
 *       404:
 *         description: Dish not found
 */
routes.delete('/:id', DishesController.removeDishes);

export default routes;
