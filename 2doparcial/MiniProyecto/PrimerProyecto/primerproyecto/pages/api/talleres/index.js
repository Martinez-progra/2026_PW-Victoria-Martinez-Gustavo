

import { TallerController } from "../../../controllers/tallerController";

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return TallerController.obtenerTalleres(req, res);
  }
  
  if (method === 'POST') {
    return TallerController.crearTaller(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Método ${method} No Permitido`);
}