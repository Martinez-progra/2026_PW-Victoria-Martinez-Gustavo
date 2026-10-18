// models/asistenciaModel.js

// Simulación de una base de datos local para Asistencias
let asistenciasDB = [
  { id: 1, usuarioId: 1, tallerId: 1, fecha: "2026-10-17", estado: "Presente" }
];

export const AsistenciaModel = {
  
  getAll: () => {
    return asistenciasDB;
  },

  
  getByUser: (usuarioId) => {
    return asistenciasDB.filter(a => a.usuarioId === Number(usuarioId));
  },


  create: (nuevaAsistencia) => {
    const id = asistenciasDB.length > 0 ? asistenciasDB[asistenciasDB.length - 1].id + 1 : 1;
    const asistenciaConId = { 
      id, 
      fecha: new Date().toISOString().split('T')[0], 
      ...nuevaAsistencia 
    };
    asistenciasDB.push(asistenciaConId);
    return asistenciaConId;
  }
};