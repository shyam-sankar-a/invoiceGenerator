import { ADMIN, USER } from '../constants/index.js';

const ROLES = {
    Admin: ADMIN,
    Usetr: USER
};

const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user && !req.roles) {
            res.status(401);
            throw new Error("You are not authorized to use our platform")
        }

        const arrRoles = [...allowedRoles];

        const roleFound = req.roles.map(role => arrRoles.includes(role)).find(value => value === true);

        if (!roleFound) {
            res.status(401);
            throw new Error("You are not authorized to perform this request");
        }
    }
}

export { ROLES, checkRoles }