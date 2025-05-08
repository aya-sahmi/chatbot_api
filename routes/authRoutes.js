import { Router } from 'express';
import {signUp , login , forgotPassword, resetPassword} from '../controllers/authController.js';
import { authenticateUser } from '../middlewares/verifyToken.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API for managing authentication
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Créer un nouvel utilisateur.
 *     description: Cette route permet à un nouvel utilisateur de s'inscrire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@gmail.com"
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *       400:
 *         description: Demande invalide.
 */
router.post('/signup', signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authentifier un utilisateur.
 *     description: Cette route permet à un utilisateur de se connecter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ayasahmi@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Échec de l'authentification.
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password reset email to the user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: The email address of the user requesting a password reset.
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully.
 *       400:
 *         description: Bad request (e.g., missing email or invalid email).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email is required.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Verify OTP and reset the user's password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 example: token_from_email
 *                 description: The token sent to the user's email for password reset.
 *               new_password:
 *                 type: string
 *                 example: new_secure_password
 *                 description: The new password to set for the user.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully.
 *       400:
 *         description: Bad request (e.g., missing token or password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access token and new password are required.
 *       500:
 *         description: Internal server error.
 */
router.post('/reset-password',resetPassword)


export default router;