// Resalta una subcadena de un titular con el acento en gradiente morado (.text-gradient).
// El texto sigue viviendo en i18n; aquí solo se decide la palabra clave a resaltar.
// Si `em` no aparece en `text` (p. ej. cambió la copia), devuelve el texto completo sin
// romper nada — degradación segura. `em` distingue mayúsculas para ser predecible.
export default function GradientText({ text, em }: { text: string; em: string }) {
  const i = em ? text.indexOf(em) : -1;
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-gradient">{em}</span>
      {text.slice(i + em.length)}
    </>
  );
}
