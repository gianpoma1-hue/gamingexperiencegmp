import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import { datosContacto } from "@/lib/contactInfo";

const ACTUALIZADA = "6 de noviembre de 2026";

const secciones: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "Quién es el responsable",
    contenido: (
      <p>
        El responsable de tus datos es GMP Gaming (gmpgaming.com), plataforma de
        torneos online de videojuegos con base en Argentina. Por cualquier
        consulta sobre privacidad escribinos a{" "}
        <a href={`mailto:${datosContacto.email}`} className="text-red-500 hover:underline">
          {datosContacto.email}
        </a>
        .
      </p>
    ),
  },
  {
    titulo: "Qué datos recopilamos",
    contenido: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-zinc-200">Al registrarte:</strong> nombre,
          nombre de usuario, email y contraseña (la contraseña se guarda cifrada;
          nadie de GMP Gaming puede verla).
        </li>
        <li>
          <strong className="text-zinc-200">En tu perfil:</strong> plataforma de
          juego y foto de perfil, si decidís subirla.
        </li>
        <li>
          <strong className="text-zinc-200">Al inscribirte a un torneo:</strong>{" "}
          nombre del equipo, escudo, ID de juego (por ejemplo, de Truco Blyts) y
          el estado de tu pago de inscripción.
        </li>
        <li>
          <strong className="text-zinc-200">Mientras jugás:</strong> resultados,
          estadísticas, posiciones en el ranking, mensajes que enviás en los
          chats de la plataforma y reportes de resultados.
        </li>
        <li>
          <strong className="text-zinc-200">Datos de navegación:</strong>{" "}
          información técnica y de uso del sitio recopilada mediante cookies de
          Google Analytics y Google Ads (páginas visitadas, dispositivo,
          ubicación aproximada).
        </li>
      </ul>
    ),
  },
  {
    titulo: "Para qué los usamos",
    contenido: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Crear y administrar tu cuenta.</li>
        <li>Organizar los torneos: inscripciones, llaves, horarios, resultados y premios.</li>
        <li>Verificar los pagos de inscripción y pagar los premios.</li>
        <li>Enviarte avisos sobre tus torneos, partidos y mensajes.</li>
        <li>Armar el ranking y las estadísticas públicas.</li>
        <li>Medir el uso del sitio, mejorarlo y medir nuestras campañas publicitarias.</li>
        <li>Prevenir trampas, fraudes y usos indebidos de la plataforma.</li>
      </ul>
    ),
  },
  {
    titulo: "Qué es público",
    contenido: (
      <p>
        Tu nombre de usuario, foto de perfil, nombre y escudo de equipo,
        resultados, estadísticas y posición en el ranking se muestran
        públicamente en el sitio. Tu email y tu contraseña nunca se muestran a
        otros usuarios.
      </p>
    ),
  },
  {
    titulo: "Con quién los compartimos",
    contenido: (
      <>
        <p>No vendemos tus datos. Solo los compartimos con los servicios que necesitamos para que la plataforma funcione:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li><strong className="text-zinc-200">Supabase:</strong> base de datos, cuentas de usuario y almacenamiento de imágenes.</li>
          <li><strong className="text-zinc-200">Vercel:</strong> alojamiento del sitio web.</li>
          <li><strong className="text-zinc-200">Google (Analytics y Ads):</strong> estadísticas de uso y medición de publicidad.</li>
        </ul>
        <p className="mt-3">
          Estos servicios pueden almacenar datos en servidores fuera de
          Argentina. También podemos compartir datos si una autoridad competente
          lo exige por ley.
        </p>
      </>
    ),
  },
  {
    titulo: "Cookies",
    contenido: (
      <p>
        Usamos cookies propias para mantener tu sesión iniciada y cookies de
        Google para estadísticas y publicidad. Podés bloquear o borrar las
        cookies desde la configuración de tu navegador; si bloqueás las propias,
        no vas a poder iniciar sesión.
      </p>
    ),
  },
  {
    titulo: "Cuánto tiempo los guardamos",
    contenido: (
      <p>
        Guardamos tus datos mientras tengas una cuenta activa. Los resultados de
        torneos ya jugados pueden conservarse como parte del historial de la
        competencia. Si pedís que borremos tu cuenta, eliminamos tus datos
        personales, salvo lo que debamos conservar por obligaciones legales o
        contables.
      </p>
    ),
  },
  {
    titulo: "Tus derechos",
    contenido: (
      <>
        <p>
          Podés pedir en cualquier momento acceder a tus datos, corregirlos,
          actualizarlos o eliminarlos, escribiendo a{" "}
          <a href={`mailto:${datosContacto.email}`} className="text-red-500 hover:underline">
            {datosContacto.email}
          </a>{" "}
          desde el email de tu cuenta. Te respondemos dentro de los plazos de la
          Ley 25.326 de Protección de los Datos Personales.
        </p>
        <p className="mt-3">
          La Agencia de Acceso a la Información Pública (AAIP), órgano de
          control de la Ley 25.326, tiene la atribución de atender las denuncias
          y reclamos que se presenten por incumplimiento de las normas sobre
          protección de datos personales.
        </p>
      </>
    ),
  },
  {
    titulo: "Menores de edad",
    contenido: (
      <p>
        Si sos menor de 18 años necesitás autorización de tu madre, padre o
        tutor para registrarte y participar de torneos con inscripción paga.
      </p>
    ),
  },
  {
    titulo: "Seguridad",
    contenido: (
      <p>
        Protegemos tus datos con conexiones cifradas (HTTPS), contraseñas
        cifradas y permisos de acceso por usuario en la base de datos. Ningún
        sistema es 100% infalible, pero si detectamos un problema que afecte tus
        datos te lo vamos a informar.
      </p>
    ),
  },
  {
    titulo: "Cambios en esta política",
    contenido: (
      <p>
        Podemos actualizar esta política. Si hacemos cambios importantes, lo
        avisaremos en el sitio. La fecha de la última actualización figura al
        principio de esta página.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-24 lg:pt-36 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-6xl font-black text-center">
            Política de <span className="text-red-600">Privacidad</span>
          </h1>

          <p className="text-zinc-400 text-center text-base sm:text-lg mt-6 leading-7 sm:leading-8">
            Qué datos recopilamos, para qué los usamos y cómo podés controlarlos.
          </p>
          <p className="text-zinc-500 text-center text-sm mt-2">
            Última actualización: {ACTUALIZADA}
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
