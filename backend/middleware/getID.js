const jwt = require('jsonwebtoken');

const getID = (req, res, next) => {
    const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        // console.log(verified);
        next();
};

module.exports = getID;