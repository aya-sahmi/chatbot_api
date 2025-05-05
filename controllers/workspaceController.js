import supabase from "../config/supabaseClient.js";
import express, { json } from "express";

const app=express();
app.use(json());

const createWorkspace = async (req, res) => {
    try {
        const { workspace_name , domaine_id , solde_total } = req.body;
        const {data : domaine , error : errDomaine} = await supabase.from('domaines').select('solde_total').eq('domaine_id', domaine_id).single();
        if(domaine.solde_total < solde_total){
            return res.status(400).json({error: "Insuffisant Solde"})
        }
        const { data, error } = await supabase.from("workspaces").insert([{ workspace_name , domaine_id , solde_total }]).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const updatedSolde = domaine.solde_total - solde_total;
        const {data : updateDomaine , error : errUpdate} = await supabase.from('domaines').update({solde_total : updatedSolde}).eq('domaine_id', domaine_id).select('*');
        if(errUpdate){
            return res.status(400).json({error: errUpdate.message})
        }
        res.status(201).json(data);
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getAllWorkspaces = async(req,res)=>{
    try{
        const {data,error} = await supabase.from("workspaces").select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

const getWorkspaceById = async (req, res) => {
    try {
        const id  = req.params.id;
        const { data, error } = await supabase.from("workspaces").select("*").eq("workspace_id",id);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateWorkspace = async (req, res) => {
    try {
        const id = req.params.id;
        const { workspace_name , domaine_id , solde_total } = req.body;
        const {data , error } = await supabase.from("workspaces").update({workspace_name , domaine_id , solde_total}).eq("workspace_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deleteWorkspace = async (req, res) => {
    try {
        const id = req.params.id;
        const {data , error} = await supabase.from("workspaces").update({is_deleted:true}).eq("workspace_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json({
            message: "Workspace marked as deleted successfully",
            data
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const activeDesactiveWorkspace = async (req, res) => {
    try {
        const id = req.params.id;
        const { data, error } = await supabase.from('workspaces').select('is_active').eq('workspace_id', id).single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        if (data.is_active === true) {
            const { data: updateActivation, error: err } = await supabase.from('workspaces').update({ is_active: false }).eq('workspace_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Workspace was deactivated successfully',updateActivation});
        } else {
            const { data: updateActivation, error: err } = await supabase.from('workspaces').update({ is_active: true }).eq('workspace_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Workspace was activated successfully',updateActivation});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assignDomainToWorkspaces = async (req,res)=>{
    try{
        const {domaineId, workspacesId} = req.body;
        if(!domaineId || !Array.isAray(workspacesId) || workspacesId.length === 0){
            return res.status(400).json({error:" domaineId and an array of workspacesId are required"})
        }
        const results = [];
        for(const workspaceId of workspacesId){
            const {data : exWorkspace} = await supabase.from('workspaces').select('id, domaine_id').eq('workspace_id','workspaceId')
            if(exWorkspace && exWorkspace.domaineId){
                const {data : workspaceUpdate , error : errUpdate} = await supabase.from('workspaces').update({domaineId : domaineId}).eq('workspace_id','workspaceId')
                if(errUpdate){
                    return res.status(400).json({error : errUpdate.message})
                }
                results.push({workspaceId, action:'updated', data: workspaceUpdate})
            }
            else{
                const {data : workspace , error : errAdd} = await supabase.from('workspaces').insert({domaineId : domaineId}).eq('workspace_id','workspaceId')
                if(errAdd){
                    results.push({workspaceId, action:'error', error: errAdd.message})
                }
                results.push({workspaceId, action : 'inserted', data: workspace})
            }
        }
        res.status(200).json({
            message: "Domaines assignment completed succesfully",
            results
        })
    }catch(error){
        res.status(500).json({error: error.message})
    }
}
export {createWorkspace, getAllWorkspaces, getWorkspaceById, updateWorkspace, deleteWorkspace , activeDesactiveWorkspace , assignDomainToWorkspaces}