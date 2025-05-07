import supabase from "../config/supabaseClient.js";
import express, {json} from "express";

const app = express();
app.use(json());

const createDomaine = async (req, res) => {
    try{
        const {domaine_name , domaine_description , solde_total} = req.body;
        const {data, error} = await supabase.from('domaines').insert([{ domaine_name, domaine_description, solde_total}]).select('*');
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.status(200).json(data);
    }catch(error){
        return res.status(500).json({error : error.message});
    }
}

const getAllDomaines = async (req, res) => {
    try {
        const {data, error} = await supabase.from('domaines').select("*");
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

const getDomaineById = async (req, res) => {
    try {
        const id  = req.params.id;
        const { data , error } = await supabase.from('domaines').select('*').eq('domaine_id', id);
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}
const updateDomaine = async (req, res) => {
    try {
        const id = req.params.id;
        const { domaine_name , domaine_description , solde_total } = req.body;
        const {data , error } = await supabase.from("domaines").update({domaine_name , domaine_description , solde_total}).eq("domaine_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
const deleteDomaine = async (req, res) => {
    try {
        const id = req.params.id;
        const { data: domaine, error: err } = await supabase.from("domaines").select("is_deleted").eq("domaine_id", id).single();
        const isDeleted = !domaine.is_deleted;
        const { data, error } = await supabase
            .from("domaines").update({ is_deleted: isDeleted }).eq("domaine_id", id).select("*");

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({
            message: `Domaine ${isDeleted ? "marked as deleted" : "restored"} successfully`,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activeDesactiveDomaine = async (req, res) => {
    try {
        const id = req.params.id;
        const { data, error } = await supabase.from('domaines').select('is_active').eq('domaine_id', id).single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        if (data.is_active === true) {
            const { data: updateActivation, error: err } = await supabase.from('domaines').update({ is_active: false }).eq('domaine_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Domaine was deactivated successfully',updateActivation});
        } else {
            const { data: updateActivation, error: err } = await supabase.from('domaines').update({ is_active: true }).eq('domaine_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Domaine was activated successfully',updateActivation});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assignSoldeToWorkspaces = async (req, res) => {
    try {
        const { domaine_id, tokens, workspaceIds } = req.body;
        if (!domaine_id || !tokens || !workspaceIds || workspaceIds.length === 0) {
            return res.status(400).json({ error: "Données invalides. Veuillez fournir domaine_id, solde et workspaceIds." });
        }
        const { data: domaine, error: dmnErr } = await supabase.from('domaines').select('solde_total').eq('domaine_id', domaine_id).single();

        if (dmnErr || !domaine) {
            return res.status(404).json({ error: "Domaine introuvable." });
        }
        if (domaine.solde_total < tokens) {
            return res.status(400).json({ error: "Solde insuffisant." });
        }
        const newSolde = domaine.solde_total - tokens;
        const { error: dmnUpdateErr } = await supabase
            .from('domaines')
            .update({ solde_total: newSolde })
            .eq('domaine_id', domaine_id);

        if (dmnUpdateErr) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour du solde du domaine." });
        }
        const { error: wsUpdateErr } = await supabase
            .from('workspaces')
            .update({ solde_total: tokens })
            .in('workspace_id', workspaceIds);

        if (wsUpdateErr) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour des workspaces." });
        }

        res.status(200).json({ message: "Solde attribué avec succès aux espaces de travail." });
    } catch (error) {
        console.error("Erreur dans assignSoldeToWorkspaces :", error);
        res.status(500).json({ error: error.message });
    }
};

export { createDomaine, getAllDomaines, getDomaineById, updateDomaine, deleteDomaine , activeDesactiveDomaine , assignSoldeToWorkspaces };