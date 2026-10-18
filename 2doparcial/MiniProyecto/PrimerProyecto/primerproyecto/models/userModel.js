
let usuariosDB = [
  { id: 1, nombre: "Gustavo Victoria", email: "gustavo@ipn.mx", rol: "Estudiante" }
];

export const UserModel = {
 
  getAll: () => {
    return usuariosDB;
  },

 
  getById: (id) => {
    return usuariosDB.find(user => user.id === Number(id));
  },


  create: (nuevoUsuario) => {
    const id = usuariosDB.length > 0 ? usuariosDB[usuariosDB.length - 1].id + 1 : 1;
    const usuarioConId = { id, ...nuevoUsuario };
    usuariosDB.push(usuarioConId);
    return usuarioConId;
  }
};