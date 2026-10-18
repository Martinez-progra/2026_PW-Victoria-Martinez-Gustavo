// controllers/asistenciaController.js
import { AsistenciaModel } from "@/models/asistenciaModel";

export const AsistenciaController = {
  
  obtenerAsistencias: (req, res) => {
    try {
      const asistencias = AsistenciaModel.getAll();
      return res.status(200).json({ success: true, data: asistencias });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener los registros de asistencia" });
    }
  },

 
  registrarAsistencia: (req, res) => {
    try {
      const { usuarioId, tallerId, estado } = req.body;

      if (!usuarioId || !tallerId) {
        return res.status(400).json({ success: false, message: "El usuarioId y el tallerId son obligatorios" });
      }

      const nuevaAsistencia = AsistenciaModel.create({
        usuarioId,
        tallerId,
        estado: estado || "Presente"
      });

      return res.status(201).json({ success: true, data: nuevaAsistencia });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al registrar la asistencia" });
    }
  }
};