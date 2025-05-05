import supabase from "../config/supabaseClient.js";
import express, { json } from "express";

const app=express();
app.use(json());

const createPackage = async (req, res) => {
    try {
        const { package_name , package_description , number_workspace , number_chatbot , number_domaine , solde_total } = req.body;
        const { data, error } = await supabase.from("packages").insert([
            { package_name , package_description , number_workspace , number_chatbot , number_domaine , solde_total },
        ]).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data);
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllPackages = async(req,res)=>{
    try{
        const {data,error} = await supabase.from("packages").select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

const getPackageById = async (req, res) => {
    try {
        const id  = req.params.id;
        const { data, error } = await supabase.from("packages").select("*").eq("package_id",id);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updatePackage= async (req,res) =>{
    try {
        const id = req.params.id;
        const { package_name , package_description , number_workspace , number_chatbot , number_domaine , solde_total } = req.body;
        const {data , error } = await supabase.from("packages").update({package_name , package_description , number_workspace , number_chatbot , number_domaine , solde_total}).eq("package_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deletePackage = async (req, res)=>{
    try {
        const id  = req.params.id
        const {data , error } = await supabase.from('packages').update({is_deleted:true}).eq('package_id',id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json({
            message : "Package marked as deleted successfully",
            data
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const activeDesactivePackage = async (req, res) => {
    try {
        const id = req.params.id;
        const { data, error } = await supabase.from('packages').select('is_active').eq('package_id', id).single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        if (data.is_active === true) {
            const { data: updateActivation, error: err } = await supabase.from('packages').update({ is_active: false }).eq('package_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Package was deactivated successfully',updateActivation});
        } else {
            const { data: updateActivation, error: err } = await supabase.from('packages').update({ is_active: true }).eq('package_id', id).select('*');
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({message: 'Package was activated successfully',updateActivation});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const assignPackageToDomaine = async (req, res) => {
    try {
        const {domaine_id, package_id} = req.body;
        const {data, error} = await supabase.from('domaines').update({package_id}).eq('domaine_id', domaine_id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const unassignDomaineFromPackage = async (req, res) => {
    try {
        const { domaineId } = req.body;
        if (!domaineId) {
            return res.status(400).json({ error: "domaineId is required." });
        }
        const { data: domaine, error: domaineError } = await supabase.from('domaines').select('domaine_id, package_id').eq('domaine_id', domaineId).single();
        if (domaineError || !domaine) {
            return res.status(404).json({ error: "Domaine not found." });
        }
        if (!domaine.package_id) {
            return res.status(400).json({ error: "Domaine is not assigned to any package." });
        }
        const { data, error } = await supabase.from('domaines').update({ package_id: null }).eq('domaine_id', domaineId).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({
            message: "Domaine unassigned from package successfully.",
            updatedDomaine: data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getDomainsByPackageId = async (req, res) => {
    try {
        const packageId = req.params.id;
        const { data: packageData, error: packageError } = await supabase.from('packages').select('package_id, package_name').eq('package_id', packageId).single();

        if (packageError || !packageData) {
            return res.status(404).json({ error: "Package not found." });
        }
        const { data: domaines, error: domainesError } = await supabase.from('domaines').select('domaine_id, domaine_name, domaine_description, solde_total').eq('package_id', packageId);
        if (domainesError) {
            return res.status(400).json({ error: domainesError.message });
        }
        res.status(200).json({
            message:'Package details and their domains',
            package: packageData,
            domaines: domaines,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {createPackage, getAllPackages, getPackageById, updatePackage, deletePackage , activeDesactivePackage , assignPackageToDomaine , unassignDomaineFromPackage , getDomainsByPackageId}