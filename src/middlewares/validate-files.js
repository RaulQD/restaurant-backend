

export const validatefiles = (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ message: 'No se cargo ningun Archivo.' });
        return;
    }
    next();
}