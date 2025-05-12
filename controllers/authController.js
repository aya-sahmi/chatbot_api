import supabase from '../config/supabaseClient.js';

const signUp = async (req, res) => {
    const { email, password, full_name, solde_total } = req.body;
    const { data: authData, error: errAuth } = await supabase.auth.signUp({
        email,
        password,
    });
    if (errAuth) {
        return res.status(400).json({ error: errAuth.message });
    }
    const userID = authData.user.id;
    const { data, error } = await supabase.from('users').insert([
        { user_id: userID, full_name, solde_total, is_deleted: false, is_active: true },
    ]).select('*');
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ data });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const { data: loginData, error: errLogin } = await supabase.auth.signInWithPassword({
        email,password,
    });
     if (errLogin || !loginData || !loginData.user || !loginData.session) {
        return res.status(400).json({ error: errLogin ? errLogin.message : "Invalid login credentials" });
    }

    const emailUser = loginData.user.email;
    if (errLogin) {
        return res.status(400).json({ error: errLogin.message });
    }
    const userID = loginData.user.id;
    const access_token = loginData.session.access_token;
    const { data: userData, error: errUser } = await supabase.from('users').select('user_id, full_name, age, domaine_id, package_id, solde_total, is_deleted, is_active, role_id, roles(role_name)').eq('user_id', userID).single();
    if (errUser) {
        return res.status(400).json({ error: errUser.message });
    }
    if (userData.is_active === false) {
        return res.status(400).json({ error: "User is deactivated" });
    }

    if (userData.is_deleted === true) {
        return res.status(400).json({ error: "User is deleted" });
    }
    const { roles, ...rest } = userData;
    const userAuth = {...rest, email : emailUser ,role: roles.role_name,
    };

    return res.status(200).json({
        access_token,
        userData: userAuth,
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5000/reset-password',
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: "Password reset email sent successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const access_token = req.headers['access_token'];
        const { password } = req.body;
        const { error } = await supabase.auth.updateUser(access_token, {
            password: password,
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { signUp, login, forgotPassword, resetPassword };