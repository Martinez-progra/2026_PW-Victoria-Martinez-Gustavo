// pages/api/asistencia.js
import { AsistenciaController } from "@/controllers/asistenciaController";

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return AsistenciaController.obtenerAsistencias(req, res);
    case "POST":
      return AsistenciaController.registrarAsistencia(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}