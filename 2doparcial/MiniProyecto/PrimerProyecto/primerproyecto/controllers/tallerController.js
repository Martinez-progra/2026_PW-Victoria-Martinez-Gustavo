
import { TallerModel } from "../models/tallerModel"; // <-- Usa ruta relativa en lugar de @/
import { AsistenciaModel } from "../models/asistenciaModel";
import { validarBoleta } from "../lib/validaciones";

export const TallerController = {
  obtenerTalleres: (req, res) => {
    try {
      const talleres = TallerModel.getAll();
      return res.status(200).json({ success: true, data: talleres });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener los talleres" });
    }
  },

  crearTaller: (req, res) => {
    try {
      const { nombre, descripcion, cupo } = req.body;

      if (!nombre) {
        return res.status(400).json({ success: false, message: "El nombre del taller es obligatorio" });
      }

      const nuevoTaller = TallerModel.create({
        nombre,
        descripcion: descripcion || "",
        cupo: cupo || 15
      });

      return res.status(201).json({ success: true, data: nuevoTaller });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al crear el taller" });
    }
  },

  obtenerPorId: (req, res) => {
    try {
      const { id } = req.query;
      const talleres = TallerModel.getAll();
      
      const taller = talleres.find((t) => t.id == id); 

      if (!taller) {
        return res.status(404).json({ success: false, message: "Taller no encontrado" });
      }
      return res.status(200).json({ success: true, data: taller });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener el taller" });
    }
  },

  obtenerAsistenciasPorTaller: (req, res) => {
    try {
      const { id } = req.query;
      const asistencias = AsistenciaModel.getAll().filter(
        (asistencia) => Number(asistencia.taller_id ?? asistencia.tallerId) === Number(id)
      );

      return res.status(200).json({ success: true, data: asistencias });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener las asistencias del taller" });
    }
  },

  obtenerTalleresPorBoleta: (req, res) => {
    try {
      const { boleta } = req.query;
      const errorBoleta = validarBoleta(typeof boleta === "string" ? boleta.trim() : "");

      if (errorBoleta) {
        return res.status(400).json({ success: false, message: errorBoleta });
      }

      const talleres = TallerModel.getAll();
      const asistencias = AsistenciaModel.getAll().filter(
        (asistencia) => asistencia.boleta === boleta.trim()
      );
      const inscritos = asistencias
        .map((asistencia) => {
          const tallerId = Number(asistencia.taller_id ?? asistencia.tallerId);
          const taller = talleres.find((item) => Number(item.id) === tallerId);

          if (!taller) return null;

          return {
            ...taller,
            nombre_taller: taller.nombre,
            nombre_alumno: asistencia.nombre_alumno,
            boleta: asistencia.boleta
          };
        })
        .filter(Boolean);

      return res.status(200).json({ success: true, data: inscritos });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener los talleres del alumno" });
    }
  },

  inscribirAlumno: (req, res) => {
    try {
      const { taller_id, nombre_alumno, boleta } = req.body || {};
      const tallerId = Number(taller_id);
      const nombre = typeof nombre_alumno === "string" ? nombre_alumno.trim() : "";
      const boletaLimpia = typeof boleta === "string" ? boleta.trim() : "";

      if (!Number.isInteger(tallerId) || tallerId <= 0 || !nombre) {
        return res.status(400).json({ success: false, message: "El taller y el nombre del alumno son obligatorios" });
      }

      const errorBoleta = validarBoleta(boletaLimpia);
      if (errorBoleta) {
        return res.status(400).json({ success: false, message: errorBoleta });
      }

      const taller = TallerModel.getAll().find((item) => Number(item.id) === tallerId);
      if (!taller) {
        return res.status(404).json({ success: false, message: "Taller no encontrado" });
      }

      const asistencias = AsistenciaModel.getAll().filter(
        (asistencia) => Number(asistencia.taller_id ?? asistencia.tallerId) === tallerId
      );

      if (asistencias.some((asistencia) => asistencia.boleta === boletaLimpia)) {
        return res.status(409).json({ success: false, message: "Esa boleta ya está inscrita en este taller." });
      }

      if (asistencias.length >= Number(taller.cupo)) {
        return res.status(409).json({ success: false, message: "El taller ya no tiene lugares." });
      }

      const nuevaAsistencia = AsistenciaModel.create({
        taller_id: tallerId,
        nombre_alumno: nombre,
        boleta: boletaLimpia
      });

      return res.status(201).json({ success: true, data: nuevaAsistencia });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al procesar la inscripción" });
    }
  }
};