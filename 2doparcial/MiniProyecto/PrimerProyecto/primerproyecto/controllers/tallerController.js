// controllers/tallerController.js
import { TallerModel } from "@/models/tallerModel";

export const TallerController = {
 
  obtenerTalleres: (req, res) => {
    try {
      const talleres = TallerModel.getAll();
      return res.status(200).json({ success: true, data: talleres });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener los talleres" });
    }
  },

  
  crearTaller: (req, res) => {
    try {
      const { nombre, descripcion, cupo } = req.body;

      if (!nombre) {
        return res.status(400).json({ success: false, message: "El nombre del taller es obligatorio" });
      }

      const nuevoTaller = TallerModel.create({
        nombre,
        descripcion: descripcion || "",
        cupo: cupo || 15
      });

      return res.status(201).json({ success: true, data: nuevoTaller });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al crear el taller" });
    }
  }
};