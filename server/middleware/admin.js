module.exports = (req, res, next) => {
    console.log(req.user.role);
    if (req.user.role_id !== '1') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  };