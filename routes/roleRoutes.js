import express from 'express';
import {getAllRoles,createRole,getAllPermissions,createPermission,assignPermissionsToRole, getPermissionsByRole, unAssignPermissionToRole, deletePermission, deleteRole,} from '../controllers/roleController.js';
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
 * /roles/{id}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Supprime ou restaure un rôle
 *     description: Bascule le champ `is_deleted` d'un rôle entre `true` et `false`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du rôle à supprimer ou restaurer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès de la suppression ou restauration du rôle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Erreur de requête.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete("/:id", deleteRole);


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
 * /permissions/{id}:
 *   delete:
 *     tags:
 *       - Permissions
 *     summary: Supprime ou restaure une permission
 *     description: Bascule le champ `is_deleted` d'une permission entre `true` et `false`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la permission à supprimer ou restaurer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès de la suppression ou restauration de la permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Erreur de requête.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete("/permissions/:id", deletePermission);


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

/**
 * @swagger
 * /roles/unassign-permission:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Désassigne une permission d'un rôle
 *     description: Supprime l'association entre un rôle et une permission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: ID du rôle.
 *               permissionId:
 *                 type: integer
 *                 description: ID de la permission.
 *     responses:
 *       200:
 *         description: Succès de la désassignation de la permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Erreur de requête.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post("/unassign-permission", unAssignPermissionToRole);

export default router;