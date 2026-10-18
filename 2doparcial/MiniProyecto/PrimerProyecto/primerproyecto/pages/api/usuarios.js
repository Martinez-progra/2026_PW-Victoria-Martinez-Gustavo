// pages/api/usuarios.js
import { UserController } from "@/controllers/userController";

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return UserController.obtenerUsuarios(req, res);
    case "POST":
      return UserController.crearUsuario(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Método ${method} no permitido`);
  }
}