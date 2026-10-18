// pages/api/talleres.js

import { TallerController } from "@/controllers/tallerController";

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return TallerController.obtenerTalleres(req, res);
    case "POST":
      return TallerController.crearTaller(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}