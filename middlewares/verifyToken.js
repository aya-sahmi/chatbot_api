import supabase from "../config/supabaseClient.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token is missing." });
    }
    const { data: user, error } = await supabase.auth.getUser(token);
    const { data: us } = await supabase.from('users').select('*').eq('user_id', user.user.id).single();
        req.user = { ...user, ...us };
    if (error || !user) {
        return res.status(401).json({ error: "Invalid token." });
    }
    next();
};