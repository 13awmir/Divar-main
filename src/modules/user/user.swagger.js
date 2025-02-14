/**
 * @swagger
 * tags:
 *  name: User
 *  description: User Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *          
 */

/**
 * @swagger
 * 
 * /user/whoami:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   user
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * 
 * /auth/logout:
 *  get:
 *      summary: logout user 
 *      tags:
 *          -   Auth
 *      responses:
 *          200:
 *              description: success
 */