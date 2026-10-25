
let talleres = [
  { id: 1, nombre: "Programación Web con Next.js", instructor: "Por confirmar", fecha: "2026-11-15", cupo: 25 },
  { id: 2, nombre: "Administración de Bases de Datos MySQL", instructor: "Por confirmar", fecha: "2026-11-20", cupo: 20 }
];

export const TallerModel = {
  getAll: () => {
    return talleres;
  },

  create: (nuevoTaller) => {
    // Generamos un ID único asegurando que sea numérico o de tipo consistente
    const id = talleres.length > 0 ? Number(talleres[talleres.length - 1].id) + 1 : 1;
    const tallerConId = { id, ...nuevoTaller };
    talleres.push(tallerConId);
    return tallerConId;
  }
};