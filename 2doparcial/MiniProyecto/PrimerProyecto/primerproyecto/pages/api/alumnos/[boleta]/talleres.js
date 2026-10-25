
import { TallerController } from "../../../../controllers/tallerController";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      return TallerController.obtenerTalleresPorBoleta(req, res);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${method} No Permitido` });
  } catch (error) {
    console.error("Error en la API de perfil del alumno:", error);
    return res.status(500).json({ error: "Error interno al obtener los talleres del alumno." });
  }
}