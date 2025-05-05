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
        console.log(req.body);
        console.log('----------------');
        console.log(data);
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
        const {data , error} = await supabase.from("domaines").update({is_deleted:true}).eq("domaine_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json({
            message: "Domaine marked as deleted successfully",
            data
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

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
        const {domaine_id,tokens}= req.body;
        const{ data : domaine , error: dmnErr} = await supabase.from('domaines').select('solde_total').eq('domaine_id',domaine_id)
        if(dmnErr){
            return res.status(400).json({error: dmnErr.message})
        }
        if(domaine[0].solde_total < tokens ){
            return res.status(400).json({error: "Solde insuffisant"})
        }
        domaine[0].solde_total -= tokens;
        const {data , error: dmnUpdateErr} = await supabase.from('domaines').update({solde_total: domaine[0].solde_total}).eq('domaine_id',domaine_id).select('*');
        if(dmnUpdateErr){
            return res.status(400).json({error: dmnUpdateErr.message})
        }
        const {data : workspacesUpdate , error: wsUpdateErr} = await supabase.from('workspaces').update({solde_total: tokens}).in('workspace_id', workspaceIds).select('*');
        if(wsUpdateErr){
            return res.status(400).json({error: wsUpdateErr.message})
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export { createDomaine, getAllDomaines, getDomaineById, updateDomaine, deleteDomaine , activeDesactiveDomaine , assignSoldeToWorkspaces };