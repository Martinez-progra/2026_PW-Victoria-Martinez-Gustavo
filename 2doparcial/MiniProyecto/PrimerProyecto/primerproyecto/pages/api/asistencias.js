import { TallerController } from "../../controllers/tallerController";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'POST') {
      return await TallerController.inscribirAlumno(req, res);
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${method} No Permitido` });
  } catch (error) {
    console.error("Error en la API de asistencias:", error);
    return res.status(500).json({ error: "Error interno al procesar la inscripción." });
  }
}