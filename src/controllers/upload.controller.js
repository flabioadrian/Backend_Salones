import cloudinary from '../utils/cloudinary.js';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No se seleccionó ningún archivo" });
        }

        // Usamos upload_stream para subir archivos directamente desde la memoria (buffer)
        const stream = cloudinary.uploader.upload_stream(
            { folder: "tenex_reservas/salones" }, // Carpeta organizada en tu Cloudinary
            (error, result) => {
                if (error) return res.status(500).json({ error: error.message });
                
                // Retornamos la URL segura para que el frontend la use
                res.status(200).json({ 
                    url: result.secure_url,
                    public_id: result.public_id 
                });
            }
        );

        stream.end(req.file.buffer);

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al subir imagen" });
    }
};