// Reglas de contraseña (registro y "restablecer contraseña").
// Supabase debe tener las mismas: Authentication › Sign In / Providers › Email
// (mínimo 8 caracteres, letras y números).

const MUY_COMUNES = new Set([
  "12345678", "123456789", "1234567890", "password", "password1", "contraseña",
  "qwerty123", "11111111", "00000000", "abc12345", "asdf1234", "iloveyou",
  "futbol123", "boca1234", "river123", "gmpgaming", "gmpgaming1",
]);

// Devuelve el error a mostrar, o null si la contraseña sirve
export function errorPassword(password: string): string | null {
  if (password.length < 8) return "La contraseña tiene que tener al menos 8 caracteres.";
  if (!/[a-zA-ZñÑ]/.test(password) || !/\d/.test(password))
    return "La contraseña tiene que tener letras y números.";
  if (MUY_COMUNES.has(password.toLowerCase()))
    return "Esa contraseña es muy fácil de adivinar. Elegí otra.";
  return null;
}
