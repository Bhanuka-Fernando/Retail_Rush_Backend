const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    console.log("auth")
    try {
        
        const token = req.headers['authorization'].split(" ")[1];
        console.log("auht",token)
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Auth failed",
                    success: false
                });
            } else {
                console.log("middlewarea");
                console.log(decoded.id);
                req.body.userID = decoded.id;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "Auth failed",
            success: false
        });
    }
};