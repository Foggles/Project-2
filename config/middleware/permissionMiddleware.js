

function accessibleRole(guardRoles) {
    // this is a middleware
    
    // goal: we only let the roles to aceess
    // otherwise kick the user out to home page
    return function (req, res, next) {
        
        const user = req.user;
        // const userRoles = user.roles; // array
        const userRoles = [
            {
                name: 'admin'
            }, 
            {
                name: 'volunteer'
            }
        ]
        const abc = userRoles
            .map(role => {
                return guardRoles.findIndex((guard) =>  guard === role.name) !== -1; 
            });
        
        const found = abc.findIndex((isAccessibleRole) => isAccessibleRole)

        console.log({found});

        if(found !== -1){
            return next();
        }
        return res.redirect("/");
    }
}

module.exports = {
    accessibleRole,
}