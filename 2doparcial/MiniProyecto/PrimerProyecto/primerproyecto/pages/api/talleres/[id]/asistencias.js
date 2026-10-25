import { TallerController } from "../../../../controllers/tallerController";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      return await TallerController.obtenerAsistenciasPorTaller(req, res);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${method} No Permitido` });
  } catch (error) {
    console.error("Error en la API de asistencias por taller:", error);
    return res.status(500).json({ error: "Error interno al obtener las asistencias." });
  }
}