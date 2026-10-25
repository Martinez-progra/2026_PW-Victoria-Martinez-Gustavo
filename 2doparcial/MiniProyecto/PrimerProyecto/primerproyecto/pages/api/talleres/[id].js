

import { TallerController } from "../../../controllers/tallerController";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Cambia "obtenerTallerPorId" por el nombre exacto que tengas en tu controlador
      return await TallerController.obtenerPorId(req, res); 
    }
    
    if (method === 'PUT' || method === 'PATCH') {
      return await TallerController.actualizarTaller(req, res);
    }

    if (method === 'DELETE') {
      return await TallerController.eliminarTaller(req, res);
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Método ${method} No Permitido` });
  } catch (error) {
    console.error("Error en la API de taller por ID:", error);
    return res.status(500).json({ error: "Error interno en el servidor al procesar el taller." });
  }
}