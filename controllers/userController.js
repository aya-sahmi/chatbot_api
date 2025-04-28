import supabase from '../config/supabaseClient.js';
import express, { json } from 'express';

const app = express()
app.use(json());

const signUp = async (req, res) => {
    const { email, password ,full_name , solde_total , role} = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,password,
    });
    const user = await supabase.from('users').insert({ user_id: data.user.id , full_name ,domaine_id : null, package_id :null,solde_total , role  }).select('*');
    if (error){
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ data });
};
const login = async (req, res) => {
    const { email, password} = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,password
    });
    const user = data.user.id;
    const { data: userStatut , error: errStatut} = await supabase.from('users').select('is_active').eq('user_id', user).single();
    if(userStatut.is_active === false){
        return res.status(400).json({error: "User is desactivated"})
    }
    if (error){
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ data });
};

const logout = async(req, res) => {
    try {
        const {error} = await supabase.auth.signOut();
        if(error){
            return res.status(400).json({error:error.message})
        }
        res.status(200).json({message: "You are logged out successfully"});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const createUser = async (req, res) => {
    const {data , error } = await supabase.auth.signUp({
        email: req.body.email,
        password: req.body.password,
    });
    const user = data.user.id;
    console.log(user)
    try {
        const { full_name, age, domaine_id, package_id, solde_total , role } = req.body;
        const { data :dataUser, error:errorUser } = await supabase.from('users').insert([{ user_id: user, full_name, age, domaine_id, package_id, solde_total , role , is_deleted:false , is_active:true}]).select('*');
        if(errorUser){
            return res.status(400).json({ error: errorUser.message });
        }
        res.status(201).json(dataUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if(error){
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req,res) =>{
    try {
        const id  = req.params.id;
        const {data , error} = await supabase.from("users").select("*").eq("user_id",id);
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({error : error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const id  = req.params.id;
        const { full_name, age, domaine_id, package_id, solde_total , is_deleted} = req.body;
        const { data, error } = await supabase.from('users').update({ full_name, age, domaine_id, package_id, solde_total , is_deleted }).eq('user_id', id).select('*');
        if(error){
            return res.status(400).json({ error: error.message });
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { data, error } = await supabase.from('users').update({ is_deleted: true }).eq('user_id', id).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({message: "User was deleted successfully",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activeDesactiveUser = async (req,res) => {
    try {
        const id  = req.params.id;
        const { data , error } = await supabase.from('users').select('is_active').eq('user_id', id).single();
        if (data.is_active === true) {
            const {data : updateActivation , err} = await supabase.from('users').update({is_active: false}).eq('user_id',id).select('*');
            if(err){
                return res.status(400).json({error: err.message})
            }
            res.status(200).json({message: 'User was desactivated successfully',updateActivation})
        }
        else {
            const {data : updateActivation , err} = await supabase.from('users').update({is_active: true}).eq('user_id',id).select('*');
            if(err){
                return res.status(400).json(err.message)
            }
            res.status(200).json({message: 'User was activated successfully',updateActivation})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const assignPackageToUsers = async (req, res) => {
    try {
        const { packageId, usersId } = req.body;
        if (!packageId || !Array.isArray(usersId) || usersId.length === 0) {
            return res.status(400).json({ error: "packageId and an array of usersId are required" });
        }
        const results = [];
        for (const userId of usersId) {
            const { data: exUser} = await supabase.from('users').select('id, package_id').eq('user_id', userId).single();
            if (exUser && exUser.package_id) {
                const { data: userUpdate, error: errUpdate } = await supabase.from('users').update({ package_id: packageId }).eq('user_id', userId);
                if (errUpdate) {
                    results.push({ userId, action: 'error', error: errUpdate.message });
                } else {
                    results.push({ userId, action: 'updated', data: userUpdate });
                }
            } else {
                const { data: user, error: errAdd } = await supabase.from('users').insert({ package_id: packageId }).eq('user_id', userId);
                if (errAdd) {
                    results.push({ userId, action: 'error', error: errAdd.message });
                } else {
                    results.push({ userId, action: 'inserted', data: user });
                }
            }
        }
        res.status(200).json({
            message: "Package assignment completed successfully",
            results,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assignDomaineToUsers = async (req, res) => {
    try {
        const { domaineId, usersId } = req.body;
        if (!domaineId || !Array.isArray(usersId) || usersId.length === 0) {
            return res.status(400).json({ error: "domaineId and an array of usersId are required." });
        }
        const { data: domaine, error: domaineError } = await supabase.from('domaines').select('id').eq('id', domaineId).single();
        if (domaineError || !domaine) {
            return res.status(404).json({ error: "Domaine not found." });
        }
        const { data, error } = await supabase.from('users').update({ domaine_id: domaineId }).in('user_id', usersId).select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({
            message: "Domaines assignment completed successfully.",
            updatedUsers: data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const assignWorkspaceToUsers = async (req, res) => {
    try {
        const {userID , workspaceID} = req.body;
        console.log(req.body)
        if(!workspaceID || !Array.isArray(userID) || userID.length === 0){
            return res.status(400).json({error : "workspaceId and usersId are required"})
        }
        const assignment = userID.map(user =>({
            user_id:user,
            workspace_id : workspaceID
        }))
        console.log(assignment)
        const {data, error} = await supabase.from('users_workspaces').insert(assignment).select('*');
        if(error){
            return res.status(400).json({error: error.message})
        }
        res.status(200).json({
            message : "Workspace assignment completed successfully",
            data
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export {signUp , login , logout ,createUser, getAllUsers, getUserById, updateUser, deleteUser , assignPackageToUsers , assignDomaineToUsers , assignWorkspaceToUsers,activeDesactiveUser};