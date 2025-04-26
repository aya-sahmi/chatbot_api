export const checkRole = (roles) => {
    return (req, res, next) => {
        const { user } = req;
        if(!user){
            return res.status(401).json({error:'Unauthorized'})
        }
        if(roles.includes(user.role)){
            return next();
        }
        return res.status(403).json({error:"You are not allowed"})
    }
};