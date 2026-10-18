
import { UserModel } from "@/models/userModel";

export const UserController = {
 
  obtenerUsuarios: (req, res) => {
    try {
      const usuarios = UserModel.getAll();
      return res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener usuarios" });
    }
  },

  
  crearUsuario: (req, res) => {
    try {
      const { nombre, email, rol } = req.body;
      
      if (!nombre || !email) {
        return res.status(400).json({ success: false, message: "Nombre y email son obligatorios" });
      }

      const nuevoUsuario = UserModel.create({ nombre, email, rol: rol || "Estudiante" });
      return res.status(201).json({ success: true, data: nuevoUsuario });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al crear el usuario" });
    }
  }
};