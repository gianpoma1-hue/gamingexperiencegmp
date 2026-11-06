import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import { datosContacto } from "@/lib/contactInfo";

const ACTUALIZADOS = "6 de noviembre de 2026";

const linkClase = "text-red-500 hover:underline";

const secciones: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "Qué es GMP Gaming",
    contenido: (
      <p>
        GMP Gaming (Gaming Experience GMP) es una plataforma de torneos online de
        videojuegos, como EA SPORTS FC, Counter-Strike 2 y Truco Blyts, entre
        otros. Al usar el sitio gmpgaming.com y participar de nuestros torneos,
        aceptás estos términos y condiciones.
      </p>
    ),
  },
  {
    titulo: "Tu cuenta",
    contenido: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Tenés que registrarte con datos verdaderos. Cada persona puede tener una sola cuenta.</li>
        <li>Sos responsable de cuidar tu contraseña y de todo lo que se haga desde tu cuenta.</li>
        <li>No podés prestar, vender ni compartir tu cuenta, ni jugar en nombre de otra persona.</li>
        <li>
          Si sos menor de 18 años necesitás autorización de tu madre, padre o
          tutor para registrarte y participar de torneos con inscripción paga.
        </li>
      </ul>
    ),
  },
  {
    titulo: "Inscripción y pagos",
    contenido: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Cada torneo informa su costo de inscripción, cupos, fecha, horario,
          modalidad y premios.
        </li>
        <li>
          La inscripción se paga por transferencia bancaria a los datos que se
          muestran al inscribirte. Tu lugar en el torneo queda confirmado recién
          cuando la organización verifica el pago.
        </li>
        <li>
          La organización puede cerrar las inscripciones antes de la fecha,
          reprogramar o cancelar un torneo por causas de fuerza mayor o falta de
          participantes, y en ese caso lo informará a los inscriptos.
        </li>
        <li>
          Si la organización cancela un torneo, te devolvemos el total de la
          inscripción por transferencia bancaria.
        </li>
      </ul>
    ),
  },
  {
    titulo: "Premios",
    contenido: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Los premios de cada torneo son los publicados en su página al momento de inscribirte.</li>
        <li>
          Los premios en dinero se pagan por transferencia bancaria a una cuenta
          a nombre del ganador (o del capitán, en torneos por equipos).
        </li>
        <li>
          Antes de entregar un premio, la organización puede pedir que el
          ganador confirme su identidad.
        </li>
        <li>
          Los premios que consisten en una inscripción gratuita no se pueden
          canjear por dinero ni transferir a otra persona.
        </li>
        <li>
          Si un ganador es descalificado por incumplir las reglas, pierde el
          premio.
        </li>
      </ul>
    ),
  },
  {
    titulo: "Juego limpio y conducta",
    contenido: (
      <>
        <p>Está prohibido:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>usar trampas, hacks, bugs o cualquier programa que dé ventaja;</li>
          <li>arreglar resultados o ponerse de acuerdo con el rival;</li>
          <li>insultar, discriminar, amenazar o acosar a otros jugadores o a la organización;</li>
          <li>reportar resultados falsos o editar capturas de pantalla.</li>
        </ul>
        <p className="mt-3">
          Según la gravedad, la organización puede dar el partido por perdido,
          descalificar al jugador o al equipo, o suspender la cuenta.
        </p>
      </>
    ),
  },
  {
    titulo: "Resultados y reclamos",
    contenido: (
      <p>
        Los resultados se reportan en la llave del torneo dentro del sitio. Los
        reclamos se hacen a la organización con pruebas (capturas o videos).
        Cada torneo se rige por su{" "}
        <Link href="/reglamento" className={linkClase}>
          reglamento
        </Link>
        , y ante cualquier situación no prevista decide la organización.
      </p>
    ),
  },
  {
    titulo: "Contenido que subís",
    contenido: (
      <p>
        Las fotos de perfil, escudos, nombres de equipo y mensajes que
        publiques no pueden ser ofensivos ni violar derechos de terceros. La
        organización puede quitar cualquier contenido que no cumpla con esto.
      </p>
    ),
  },
  {
    titulo: "Marcas de los juegos",
    contenido: (
      <p>
        Los nombres, logos e imágenes de los videojuegos pertenecen a sus
        respectivos dueños. GMP Gaming es una plataforma independiente y no está
        afiliada ni patrocinada por esas empresas.
      </p>
    ),
  },
  {
    titulo: "Limitación de responsabilidad",
    contenido: (
      <p>
        GMP Gaming no es responsable por fallas de los servidores de los
        juegos, de las consolas o de la conexión a internet de los
        participantes. Si un problema técnico afecta un partido, la organización
        decide cómo seguir (repetir el partido, continuarlo o resolverlo según
        el reglamento).
      </p>
    ),
  },
  {
    titulo: "Privacidad",
    contenido: (
      <p>
        El uso de tus datos personales se explica en nuestra{" "}
        <Link href="/privacidad" className={linkClase}>
          Política de Privacidad
        </Link>
        .
      </p>
    ),
  },
  {
    titulo: "Cambios en estos términos",
    contenido: (
      <p>
        Podemos actualizar estos términos cuando sea necesario. Los cambios
        rigen desde su publicación en esta página y no afectan a los torneos que
        ya estaban en curso.
      </p>
    ),
  },
  {
    titulo: "Contacto y ley aplicable",
    contenido: (
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Por
        cualquier consulta escribinos a{" "}
        <a href={`mailto:${datosContacto.email}`} className={linkClase}>
          {datosContacto.email}
        </a>{" "}
        o por nuestros{" "}
        <Link href="/contacto" className={linkClase}>
          canales de contacto
        </Link>
        .
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-24 lg:pt-36 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-6xl font-black text-center">
            Términos y <span className="text-red-600">Condiciones</span>
          </h1>

          <p className="text-zinc-400 text-center text-base sm:text-lg mt-6 leading-7 sm:leading-8">
            Las reglas para usar GMP Gaming y participar de nuestros torneos.
          </p>
          <p className="text-zinc-500 text-center text-sm mt-2">
            Última actualización: {ACTUALIZADOS}
          </p>

          <div className="mt-12 lg:mt-16 space-y-6 lg:space-y-8">
            {secciones.map((s) => (
              <div
                key={s.titulo}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8"
              >
                <h2 className="text-xl lg:text-2xl font-bold mb-4">{s.titulo}</h2>
                <div className="text-zinc-400 leading-7 lg:leading-8">{s.contenido}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
