import Router from "express";
import {createDomaine,getAllDomaines,getDomaineById,updateDomaine,deleteDomaine,assignSoldeToWorkspaces , activeDesactiveDomaine} from "../controllers/domaineController.js";
import { authenticateUser } from "../middlewares/verifyToken.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Domaines
 *     description: API for managing domaines
 */

/**
 * @swagger
 * /domaines/:
 *   post:
 *     tags:
 *       - Domaines
 *     summary: Créer un nouveau domaine.
 *     description: Cette route permet de créer un nouveau domaine, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaine_name:
 *                 type: string
 *                 example: "Domaine Name"
 *               domaine_description:
 *                 type: string
 *                 example: "Description domaine"
 *               solde_total:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Domaine créé avec succès.
 *       400:
 *         description: Demande invalide.
 */
router.post('/', checkPermission('createDomaine'), createDomaine);

/**
 * @swagger
 * /domaines/:
 *   get:
 *     tags:
 *       - Domaines
 *     summary: Récupérer tous les domaines.
 *     description: Cette route permet de récupérer la liste de tous les domaines, nécessite un rôle approprié.
 *     responses:
 *       200:
 *         description: Liste des domaines récupérée avec succès.
 */
router.get('/', checkPermission('getAllDomaines'), getAllDomaines);

/**
 * @swagger
 * /domaines/{id}:
 *   get:
 *     tags:
 *       - Domaines
 *     summary: Récupérer un domaine par son ID.
 *     description: Cette route permet de récupérer les informations d'un domaine spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du domaine à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Domaine récupéré avec succès.
 *       404:
 *         description: Domaine non trouvé.
 */
router.get('/:id',checkPermission('getDomaineById'), getDomaineById);

/**
 * @swagger
 * /domaines/{id}:
 *   put:
 *     tags:
 *       - Domaines
 *     summary: Mettre à jour un domaine existant.
 *     description: Cette route permet de mettre à jour les informations d'un domaine existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du domaine à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaine_name:
 *                 type: string
 *                 example: "Updated Domaine"
 *               domaine_description:
 *                 type: string
 *                 example: "Description Domaine"
 *               solde_total:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       200:
 *         description: Domaine mis à jour avec succès.
 *       404:
 *         description: Domaine non trouvé.
 *       400:
 *         description: Demande invalide.
 */
router.put('/:id',checkPermission('updateDomaine'), updateDomaine);

/**
 * @swagger
 * /domaines/{id}:
 *   delete:
 *     tags:
 *       - Domaines
 *     summary: Supprimer un domaine.
 *     description: Cette route permet de supprimer un domaine existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du domaine à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Domaine supprimé avec succès.
 *       404:
 *         description: Domaine non trouvé.
 */
router.delete('/:id',checkPermission('deleteDomaine'), deleteDomaine);

/**
 * @swagger
 * /domaines/active-desactive/{id}:
 *   patch:
 *     tags:
 *       - Domaines
 *     summary: Activer ou désactiver un domaine.
 *     description: Cette route permet de basculer le statut `is_active` d'un domaine entre `true` et `false`. Nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du domaine à activer ou désactiver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du domaine mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domaine was activated successfully."
 *                 updateActivation:
 *                   type: object
 *                   description: Les détails du domaine mis à jour.
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
router.patch('/active-desactive/:id', checkPermission('activeDesactiveDomaine'), activeDesactiveDomaine);

/**
 * @swagger
 * /domaines/assign-solde-to-workspaces:
 *   post:
 *     tags:
 *       - Domaines
 *     summary: Assigner du solde à des workspaces depuis un domaine.
 *     description: Cette route permet de transférer des soldes depuis un domaine vers un ou plusieurs workspaces. Nécessite un rôle approprié.
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
 *               solde_total:
 *                 type: number
 *                 example: 200
 *               workspaceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["workspace_1", "workspace_2"]
 *     responses:
 *       200:
 *         description: Solde transféré avec succès aux workspaces.
 *       400:
 *         description: Requête invalide ou solde insuffisant.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/assign-solde-to-workspaces', checkPermission('assignSoldeToWorkspaces'), assignSoldeToWorkspaces);

export default router;
