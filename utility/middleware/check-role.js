function checkRole(role) {
        return (req, res, next) => {
            if (role && role !== req.userData.role) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            next();
        }
}

module.exports = {
    checkRole
}