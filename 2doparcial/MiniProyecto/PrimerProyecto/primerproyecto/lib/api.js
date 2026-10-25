
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const BACKEND_CAIDO = "El backend no está disponible. Por favor, inténtalo más tarde.";

export async function pedirJSON(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...opciones.headers },
    });
  } catch (error) {
    throw new Error(BACKEND_CAIDO);
  }

  let datos = null;
  try {
    datos = await res.json();
  } catch {
    datos = null;
  }

  if (!res.ok) {
    const mensaje = datos?.message || datos?.error || BACKEND_CAIDO;
    throw new Error(mensaje);
  }

  return datos; 
}