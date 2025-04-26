import supabase from "../config/supabaseClient.js";
import express, { json } from "express";

const app=express();
app.use(json());

const createChatbot = async (req, res) => {
    try {
        const {chatbot_name  , chatbot_title , chatbot_description , workspace_id , solde_total } = req.body;
        const { data, error } = await supabase.from("chatbots").insert([{ chatbot_name , chatbot_title , chatbot_description , workspace_id , solde_total }]).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data);
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllChatbots = async(req,res)=>{
    try{
        const {data,error} = await supabase.from("chatbots").select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

const getChatbotById = async (req, res) => {
    try {
        const id = req.params.id;
        const { data, error } = await supabase.from("chatbots").select("*").eq("chatbot_id",id);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateChatbot = async (req,res) =>{
    try {
        const id = req.params.id;
        const { chatbot_name  , chatbot_title , chatbot_description , solde_total , workspace_id } = req.body;
        const {data , error } = await supabase.from("chatbots").update({chatbot_name  , chatbot_title , chatbot_description  , solde_total , workspace_id}).eq("chatbot_id",id).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deleteChatbot = async (req, res) => {
    try {
        const id = req.params.id;
        const {data , error} = await supabase.from("chatbots").delete().eq("chatbot_id",id);
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const assignChatbotToWorkspace = async (req, res) => {
    try {
        const { chatbot_id, workspace_id } = req.body;
        const { data, error } = await supabase.from("chatbots").update({ workspace_id }).eq("chatbot_id", chatbot_id).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export { createChatbot , getAllChatbots , getChatbotById , updateChatbot , deleteChatbot , assignChatbotToWorkspace };