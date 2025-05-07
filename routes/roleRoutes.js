import express from 'express';
import {getAllRoles,createRole,getAllPermissions,createPermission,assignPermissionsToRole, getPermissionsByRole,} from '../controllers/roleController.js';
import { authenticateUser } from '../middlewares/verifyToken.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: API for managing roles
 *   - name: Permissions
 *     description: API for managing permissions
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Récupérer tous les rôles.
 *     description: Cette route permet de récupérer tous les rôles.
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   role_name:
 *                     type: string
 *                     example: "admin"
 */
router.get('/', checkPermission('getAllRoles') , getAllRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Ajouter un rôle.
 *     description: Cette route permet d'ajouter un nouveau rôle.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Rôle ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 role_name:
 *                   type: string
 *                   example: "admin"
 */
router.post('/', checkPermission('createRole') ,createRole);

/**
 * @swagger
 * /permissions:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Récupérer toutes les permissions.
 *     description: Cette route permet de récupérer toutes les permissions.
 *     responses:
 *       200:
 *         description: Liste des permissions récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   permission_name:
 *                     type: string
 *                     example: "createUser"
 */
router.get('/permissions', checkPermission('getAllPermissions'), getAllPermissions);

/**
 * @swagger
 * /permissions:
 *   post:
 *     tags:
 *       - Permissions
 *     summary: Ajouter une permission.
 *     description: Cette route permet d'ajouter une nouvelle permission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permission_name:
 *                 type: string
 *                 example: "createUser"
 *     responses:
 *       201:
 *         description: Permission ajoutée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 permission_name:
 *                   type: string
 *                   example: "createUser"
 */
router.post('/permissions', checkPermission('createPermission') ,createPermission);

/**
 * @swagger
 * /roles/assignPermissions:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Assigner des permissions à un rôle.
 *     description: Cette route permet d'assigner des permissions à un rôle spécifique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 1
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Permissions assignées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permissions assigned to role successfully"
 *                 rolePermissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role_id:
 *                         type: integer
 *                         example: 1
 *                       permission_id:
 *                         type: integer
 *                         example: 2
 */
router.post('/assignPermissions' , checkPermission('assignPermissionsToRole') , assignPermissionsToRole);

/**
 * @swagger
 * /roles/permissions/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Récupérer les permissions d'un rôle.
 *     description: Cette route permet de récupérer toutes les permissions associées à un rôle spécifique.
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: ID du rôle.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permissions récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   example: "admin"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "createUser"
 *       404:
 *         description: Rôle non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/permissions/:id', checkPermission('getPermissionsByRole'), getPermissionsByRole);

export default router;