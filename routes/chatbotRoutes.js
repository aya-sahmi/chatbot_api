import { Router } from "express";
import {createChatbot,getAllChatbots,getChatbotById,updateChatbot,deleteChatbot,assignChatbotToWorkspace, activeDesactiveChatbot} from "../controllers/chatbotController.js";
import { authenticateUser } from "../middlewares/verifyToken.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Chatbot
 *     description: API for managing chatbots
 */

/**
 * @swagger
 * /chatbots/:
 *   get:
 *     tags:
 *      - Chatbot
 *     summary: Récupérer tous les chatbots.
 *     description: Cette route permet de récupérer la liste de tous les chatbots, nécessite un rôle approprié.
 *     responses:
 *       200:
 *         description: Liste des chatbots récupérée avec succès.
 */
router.get('/', checkPermission('getAllChatbots'), getAllChatbots);

/**
 * @swagger
 * /chatbots/:
 *   post:
 *     tags:
 *      - Chatbot
 *     summary: Créer un nouveau chatbot.
 *     description: Cette route permet de créer un nouveau chatbot.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatbot_name:
 *                 type: string
 *                 example: "ChatBot Name"
 *               chatbot_title:
 *                 type: string
 *                 example: "title du chatbot"
 *               chatbot_description:
 *                 type: string
 *                 example: "Description du chatbot"
 *               workspace_id:
 *                 type: string
 *                 example: "workspace_id"
 *               solde_total:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Chatbot créé avec succès.
 *       400:
 *         description: Demande invalide.
 */
router.post('/',checkPermission('createChatbot'), createChatbot);

/**
 * @swagger
 * /chatbots/{id}:
 *   get:
 *     tags:
 *      - Chatbot
 *     summary: Récupérer un chatbot par son ID.
 *     description: Cette route permet de récupérer les informations d'un chatbot par son id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du chatbot à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chatbot récupéré avec succès.
 *       404:
 *         description: Chatbot non trouvé.
 */
router.get('/:id',checkPermission('getChatbotById'), getChatbotById);

/**
 * @swagger
 * /chatbots/{id}:
 *   put:
 *     tags:
 *       - Chatbot
 *     summary: Mettre à jour un chatbot existant.
 *     description: Cette route permet de mettre à jour les informations d'un chatbot, nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du chatbot à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatbot_name:
 *                 type: string
 *                 example: "Chatbot Name"
 *               chatbot_title:
 *                 type: string
 *                 example: "Title du Chatbot"
 *               chatbot_description:
 *                 type: string
 *                 example: "Description du chatbot"
 *               workspace_id:
 *                 type: string
 *                 example: "workspace_id"
 *               solde_total:
 *                 type: number
 *                 example: 250
 *     responses:
 *       200:
 *         description: Chatbot mis à jour avec succès.
 *       404:
 *         description: Chatbot non trouvé.
 */
router.put('/:id', checkPermission('updateChatbot'), updateChatbot);

/**
 * @swagger
 * /chatbots/{id}:
 *   delete:
 *     tags:
 *      - Chatbot
 *     summary: Supprimer un chatbot.
 *     description: Cette route permet de supprimer un chatbot existant, nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du chatbot à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Chatbot supprimé avec succès.
 *       404:
 *         description: Chatbot non trouvé.
 */
router.delete('/:id', checkPermission('deleteChatbot'), deleteChatbot);

/**
 * @swagger
 * /chatbots/active-desactive/{id}:
 *   patch:
 *     tags:
 *       - Chatbot
 *     summary: Activer ou désactiver un chatbot.
 *     description: Cette route permet de basculer le statut `is_active` d'un chatbot entre `true` et `false`. Nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du chatbot à activer ou désactiver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du chatbot mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chatbot was activated successfully."
 *                 updateActivation:
 *                   type: object
 *                   description: Les détails du chatbot mis à jour.
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
 *         description: Chatbot non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chatbot not found."
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
router.patch('/active-desactive/:id', checkPermission('activeDesactiveChatbot'), activeDesactiveChatbot);

/**
 * @swagger
 * /chatbots/assigntoworkspace:
 *   post:
 *     tags:
 *      - Chatbot
 *     summary: Assigner un chatbot à un workspace.
 *     description: Cette route permet d'assigner un chatbot à un workspace, nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatbot_id:
 *                 type: string
 *                 example: "chatbot_id"
 *               workspace_id:
 *                 type: string
 *                 example: "workspace_id"
 *     responses:
 *       200:
 *         description: Chatbot assigné avec succès à l'workspace.
 */
router.post('/assigntoworkspace', checkPermission('assignChatbotToWorkspace'), assignChatbotToWorkspace);

export default router;
