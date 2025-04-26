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
        const {data , error } = await supabase.from('packages').delete('*').eq('package_id',id);
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export {createPackage, getAllPackages, getPackageById, updatePackage, deletePackage}