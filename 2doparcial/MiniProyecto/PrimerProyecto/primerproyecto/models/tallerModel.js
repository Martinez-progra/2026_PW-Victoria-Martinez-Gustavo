// pages/api/usuarios.js

let talleresDB = [
  { id: 1, nombre: "Programación Web con Next.js", descripcion: "Introducción al desarrollo frontend moderno", cupo: 25 },
  { id: 2, nombre: "Administración de Bases de Datos MySQL", descripcion: "Consultas avanzadas y relaciones", cupo: 20 }
];

export const TallerModel = {
  
  getAll: () => {
    return talleresDB;
  },

 
  getById: (id) => {
    return talleresDB.find(taller => taller.id === Number(id));
  },

  
  create: (nuevoTaller) => {
    const id = talleresDB.length > 0 ? talleresDB[talleresDB.length - 1].id + 1 : 1;
    const tallerConId = { id, ...nuevoTaller };
    talleresDB.push(tallerConId);
    return tallerConId;
  }
};