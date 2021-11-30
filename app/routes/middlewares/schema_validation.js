exports.schema_validator = schema => {
    return async (req, res, next) => {
        try {
            req.body = await schema.validate(req.body);
            next()
        } catch (err) {
            next(err)
        }
    }
}