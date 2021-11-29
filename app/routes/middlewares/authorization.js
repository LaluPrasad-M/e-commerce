const jwt = require("jsonwebtoken");

const db = require("../../../config/mongo");
const collections = require("../../../data/collections");
const { JWT_KEY } = require("../../../config/authenticationConfig");

exports.check_authentication = async (req, res, next) => {
    try {
        const token =
            req.query.token ||
            req.body.token ||
            req.headers["x-access-token"] ||
            await req.flash("token")[0];
        if (token) {
            req.flash("token", token);
            const decoded = await jwt.verify(token, JWT_KEY);
            const user = await db.getDb().db().collection(collections.users).findOne({ email: decoded.email });
            if (user) {
                if (!user.last_logout || user.last_logout.getTime() <= user.last_login.getTime()) {
                    req.user = {
                        user_code: user.user_code,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        dob: user.dob,
                        manager: user.manager,
                        role_code: user.role_code,
                        created_on: user.created_on,
                        last_login: user.last_login,
                        last_updated_on: user.last_updated_on,
                        last_logout: user.last_logout
                    }
                    return next();
                }
            }
        }
        next(new Error("Please login"));
    } catch (err) {
        next(err)
    }
};
