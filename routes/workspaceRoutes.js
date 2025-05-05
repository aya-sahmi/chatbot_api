import { Router } from "express";
import {createWorkspace,getAllWorkspaces,getWorkspaceById,updateWorkspace,deleteWorkspace,assignDomainToWorkspaces, activeDesactiveWorkspace} from "../controllers/workspaceController.js";
import { authenticateUser } from "../middlewares/verifyToken.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Workspaces
 *     description: API for managing workspaces
 */

/**
 * @swagger
 * /workspaces/:
 *   post:
 *     tags:
 *       - Workspaces
 *     summary: Créer un nouveau workspace.
 *     description: Cette route permet de créer un nouveau workspace, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workspace_name:
 *                 type: string
 *                 example: "Workspace Name"
 *               domaine_id:
 *                 type: string
 *                 example: "domaine_id"
 *               solde_total:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: workspace créé avec succès.
 *       400:
 *         description: Demande invalide.
 */
router.post('/', checkPermission('createWorkspace'), createWorkspace);

/**
 * @swagger
 * /workspaces/:
 *   get:
 *     tags:
 *       - Workspaces
 *     summary: Récupérer tous les workspaces.
 *     description: Cette route permet de récupérer la liste de tous les workspaces.
 *     responses:
 *       200:
 *         description: Liste des workspaces récupérée avec succès.
 */
router.get('/',checkPermission('getAllWorkspaces'), getAllWorkspaces);

/**
 * @swagger
 * /workspaces/{id}:
 *   get:
 *     tags:
 *       - Workspaces
 *     summary: Récupérer un workspace par son ID.
 *     description: Cette route permet de récupérer les informations d'un workspace spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'workspace à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: workspace récupéré avec succès.
 *       404:
 *         description: workspace non trouvé.
 */
router.get('/:id',checkPermission('getWorkspaceById'), getWorkspaceById);

/**
 * @swagger
 * /workspaces/{id}:
 *   put:
 *     tags:
 *       - Workspaces
 *     summary: Mettre à jour un workspace existant.
 *     description: Cette route permet de mettre à jour les informations d'un workspace.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'workspace à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workspace_name:
 *                 type: string
 *                 example: "Updated Workspace"
 *               domaine_id:
 *                 type: string
 *                 example: "domaine_id"
 *               solde_total:
 *                 type: number
 *                 example: 300
 *     responses:
 *       200:
 *         description: workspace mis à jour avec succès.
 *       404:
 *         description: workspace non trouvé.
 */
router.put('/:id',checkPermission('updateWorkspace'), updateWorkspace);

/**
 * @swagger
 * /workspaces/{id}:
 *   delete:
 *     tags:
 *       - Workspaces
 *     summary: Supprimer un workspace.
 *     description: Cette route permet de supprimer un workspace existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'workspace à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: workspace supprimé avec succès.
 *       404:
 *         description: workspace non trouvé.
 */
router.delete('/:id',checkPermission('deleteWorkspace'), deleteWorkspace);

/**
 * @swagger
 * /workspaces/active-desactive/{id}:
 *   patch:
 *     tags:
 *       - Workspaces
 *     summary: Activer ou désactiver un workspace.
 *     description: Cette route permet de basculer le statut `is_active` d'un workspace entre `true` et `false`. Nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du workspace à activer ou désactiver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du workspace mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workspace was activated successfully."
 *                 updateActivation:
 *                   type: object
 *                   description: Les détails du workspace mis à jour.
 *       400:
 *         description: Requête invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request."
 *       404:
 *         description: Workspace non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Workspace not found."
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
router.patch('/active-desactive/:id', checkPermission('activeDesactiveWorkspace'), activeDesactiveWorkspace);

/**
 * @swagger
 * /workspaces/assignDomainToWorkspaces:
 *   post:
 *     tags:
 *       - Workspaces
 *     summary: Assigner un domaine à des workspaces.
 *     description: Cette route permet d'assigner un domaine à plusieurs workspaces.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaine_id:
 *                 type: string
 *                 example: "domaine_id"
 *               workspaceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["workspace_1", "workspace_2"]
 *     responses:
 *       200:
 *         description: Domaine assigné avec succès à l'workspace.
 */
router.post('/assignDomainToWorkspaces',checkPermission('assignDomainToWorkspaces'), assignDomainToWorkspaces);

export default router;
