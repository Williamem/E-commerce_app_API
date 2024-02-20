const validateBody = (schema) => {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            res.status(400).json({ error: validation.error.details[0].message });
        } else {
            next();
        }
    }
};

module.exports = validateBody;