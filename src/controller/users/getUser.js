const getUser = async (req, res) => {
    return res.status(200).json(req.user);
};

module.exports = getUser;