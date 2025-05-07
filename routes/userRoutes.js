import { Router } from 'express';
import {createUser,getAllUsers,updateUser,deleteUser,getUserById,assignPackageToUsers,assignWorkspaceToUsers, activeDesactiveUser, assignRoleToUsers, assignDomaineToUsers} from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/verifyToken.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * /users/:
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
router.post('/', checkPermission('createUser'), createUser);

/**
 * @swagger
 * /users/:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer tous les utilisateurs.
 *     description: Cette route permet de récupérer la liste de tous les utilisateurs, nécessite un rôle approprié.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 */
router.get('/', checkPermission('getAllUsers'), getAllUsers);

/**
 * @swagger
 * /users/{id}:
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
router.get('/:id', checkPermission('getUserById'), getUserById);

/**
 * @swagger
 * /users/{id}:
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
router.put('/:id',checkPermission('updateUser'), updateUser);

/**
 * @swagger
 * /users/{id}:
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
router.delete('/:id', checkPermission('deleteUser'), deleteUser);

/**
 * @swagger
 * /users/activeDesactiveUser/{id}:
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
router.patch('/activeDesactiveUser/:id', checkPermission('activeDesactiveUser'), activeDesactiveUser);

/**
 * @swagger
 * /users/assignPackageToUsers:
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
router.post('/assignPackageToUsers', checkPermission('assignPackageToUsers'), assignPackageToUsers);

/**
 * @swagger
 * /users/assign-domaine:
 *   post:
 *     tags:
 *       - Users
 *     summary: Assigner un domaine à des utilisateurs.
 *     description: Cette route permet d'assigner un domaine spécifique à un ou plusieurs utilisateurs. Nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaineId:
 *                 type: string
 *                 example: "domaine_id"
 *                 description: L'ID du domaine à assigner.
 *               usersId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user_id_1", "user_id_2"]
 *                 description: Liste des IDs des utilisateurs à qui le domaine sera assigné.
 *     responses:
 *       200:
 *         description: Domaine assigné aux utilisateurs avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domaines assignment completed successfully."
 *                 updatedUsers:
 *                   type: array
 *                   description: Liste des utilisateurs mis à jour.
 *                   items:
 *                     type: object
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "domaineId and an array of usersId are required."
 *       404:
 *         description: Domaine non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Domaine not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/assign-domaine', checkPermission('assignDomaineToUsers'), assignDomaineToUsers);

/**
 * @swagger
 * /users/assignworkspacetouser:
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
router.post('/assignworkspacetouser', checkPermission('assignWorkspaceToUsers'), assignWorkspaceToUsers);

/**
 * @swagger
 * /users/assignRole:
 *   post:
 *     tags:
 *       - Users
 *     summary: Assigner un rôle à un utilisateur.
 *     description: Cette route permet d'assigner un rôle à un utilisateur spécifique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user1"
 *               roleId:
 *                 type: string
 *                 example: "7b4a7d6b-8903-4ecd-90ea-dc5a407255e6"
 *     responses:
 *       200:
 *         description: Rôle assigné avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role assigned to user successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user1"
 *                     role_id:
 *                       type: string
 *                       example: "7b4a7d6b-8903-4ecd-90ea-dc5a407255e6"
 *       404:
 *         description: Rôle ou utilisateur non trouvé.
 *       400:
 *         description: Erreur dans la requête.
 *       500:
 *         description: Erreur serveur.
 */
router.post('/assignRole' , checkPermission('assignRoleToUsers') , assignRoleToUsers);

export default router;
