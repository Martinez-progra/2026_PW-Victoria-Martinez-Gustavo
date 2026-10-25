import { TallerController } from "../../../controllers/tallerController";

export default function handler(req, res) {
  if (req.method === "GET") {
    return TallerController.obtenerTalleresPorBoleta(req, res);
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ success: false, message: `Método ${req.method} no permitido` });
}
