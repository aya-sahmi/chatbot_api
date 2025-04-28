import { Router } from 'express';
import {signUp,login,createUser,getAllUsers,updateUser,deleteUser,getUserById,assignPackageToUsers,assignWorkspaceToUsers, activeDesactiveUser, logout} from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/verifyToken.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API for managing authentication
 */

/**
 * @swagger
 * /api/v1/users/signup:
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
 * /api/v1/users/login:
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
 * /api/v1/users/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion de l'utilisateur.
 *     description: Cette route permet à un utilisateur de se déconnecter.
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are logged out successfully"
 *       400:
 *         description: Erreur lors de la déconnexion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/logout', authenticateUser, logout);

router.use(authenticateUser);

/**
 * @swagger
 * /api/v1/users/:
 *   post:
 *     tags:
 *       - Users
 *     summary: Créer un utilisateur.
 *     description: Cette route permet de créer un nouvel utilisateur, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "user1"
 *               email:
 *                 type: string
 *                 example: "usertesttt@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456789"
 *               full_name:
 *                 type: string
 *                 example: "User Testtest"
 *               age:
 *                 type: integer
 *                 example: 44
 *               domaine_id:
 *                 type: string
 *                 example: "domaine_1"
 *               package_id:
 *                 type: string
 *                 example: "package_1"
 *               solde_total:
 *                 type: number
 *                 example: 1000
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 */
router.post('/', checkRole(['super_admin', 'admin']), createUser);

/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer tous les utilisateurs.
 *     description: Cette route permet de récupérer la liste de tous les utilisateurs, nécessite un rôle approprié.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 */
router.get('/', checkRole(['super_admin','admin']), getAllUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par son ID.
 *     description: Cette route permet de récupérer les informations d'un utilisateur spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 */
router.get('/:id', checkRole(['super_admin', 'admin']), getUserById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Mettre à jour un utilisateur existant.
 *     description: Cette route permet de mettre à jour les informations d'un utilisateur, nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updateduser@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               full_name:
 *                 type: string
 *                 example: "User Name"
 *               age:
 *                 type: integer
 *                 example: 31
 *               domaine_id:
 *                 type: string
 *                 example: "domaine_id"
 *               package_id:
 *                 type: string
 *                 example: "package_id"
 *               solde_total:
 *                 type: number
 *                 example: 150
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 */
router.put('/:id',checkRole(['super_admin', 'admin']), updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprimer un utilisateur.
 *     description: Cette route permet de supprimer un utilisateur existant, nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 */
router.delete('/:id', checkRole(['super_admin', 'admin']), deleteUser);

/**
 * @swagger
 * /api/v1/users/activeDesactiveUser/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Activer ou désactiver un utilisateur.
 *     description: Cette route permet d'activer ou de désactiver un utilisateur en fonction de son état actuel.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à activer ou désactiver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès de l'activation ou désactivation de l'utilisateur.
 *       400:
 *         description: Erreur dans la requête.
 *       500:
 *         description: Erreur serveur.
 */
router.patch('/activeDesactiveUser/:id', checkRole(['super_admin', 'admin']), activeDesactiveUser);

/**
 * @swagger
 * /api/v1/users/assignPackageToUsers:
 *   post:
 *     tags:
 *       - Users
 *     summary: Assigner un package à des utilisateurs.
 *     description: Cette route permet d'assigner un package à plusieurs utilisateurs, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packageId:
 *                 type: string
 *                 example: "package_id"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *     responses:
 *       200:
 *         description: Package assigné avec succès.
 */
router.post('/assignPackageToUsers', checkRole(['super_admin', 'admin']), assignPackageToUsers);

/**
 * @swagger
 * /api/v1/users/assignworkspacetouser:
 *   post:
 *     tags:
 *       - Users
 *     summary: Assigner un workspace à un utilisateur.
 *     description: Cette route permet d'assigner un workspace à un ou plusieurs utilisateurs, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 example: "workspace_id"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *     responses:
 *       200:
 *         description: Workspace assigné avec succès.
 */
router.post('/assignworkspacetouser', checkRole(['super_admin', 'admin']), assignWorkspaceToUsers);

export default router;
