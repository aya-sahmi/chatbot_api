import supabase from "../config/supabaseClient.js";

export const checkPermission = (permissionRole) => {
    return async (req, res, next) => {
        const { user } = req;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { data: permissions, error } = await supabase.from('role_permissions').select('permissions(permission_name)').eq('role_id', user.role_id);
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            const permission = permissions.some(
                (p) => p.permissions.permission_name === permissionRole
            );

            if (!permission) {
                return res.status(403).json({ error: 'You dont have permission for this action' });
            }
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};