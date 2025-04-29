import express , {json} from "express";
import supabase from "../config/supabaseClient.js";

export const getAllRoles = async(req,res)=>{
    try {
        const {data, error} = await supabase.from('roles').select('*');
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export const createRole = async(req,res)=>{
    try {
        const {role_name} = req.body;
        const {data, error} = await supabase.from('roles').insert([{role_name}]).select('*');
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export const getAllPermissions = async(req,res)=>{
    try {
        const {data, error} = await supabase.from('permissions').select('*');
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}
export const createPermission = async(req,res)=>{
    try {
        const {permission_name} = req.body;
        const {data, error} = await supabase.from('permissions').insert([{permission_name}]).select('*');
        if(error){
            return res.status(400).json({error : error.message});
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export const assignPermissionsToRole = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;
        const rolePermissions = permissionIds.map((permissionId) => ({
            role_id: roleId,
            permission_id: permissionId,
        }));
        const { data, error } = await supabase.from('role_permissions').insert(rolePermissions).select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({
            message: 'Permissions assigned to role successfully',
            rolePermissions: data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPermissionsByRole = async(req,res)=>{
    try {
        const role_id = req.params.id;
        const {data : roleData, error: roleErr} = await supabase.from('roles').select('*').eq('role_id', role_id).single();
        if(roleErr){
            return res.status(400).json({error : roleErr.message});
        }
        const {data : permissionData, error: permissionErr} = await supabase.from('role_permissions').select('permissions(permission_name)').eq('role_id', role_id);
        if(permissionErr){
            return res.status(400).json({error : error.message});
        }
        res.status(200).json({
            role: roleData.role_name,
            permissions: permissionData.map((permission) => permission.permissions.permission_name),
        });
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}