import { motion } from 'framer-motion';
import { Shield, Globe, Users, ArrowRight, Check, Activity, Database, Lock, Fingerprint } from 'lucide-react';
import { SatelliteVisualization } from './SatelliteVisualization';

const features = [
  {
    icon: Database,
    title: "OSINT Basado en Evidencia",
    description: "Separamos observaciones pasivas de hallazgos verificados. Cada punto de dato tiene una cadena de custodia SHA-256.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Fingerprint,
    title: "AI Grounding (Cero Alucinaciones)",
    description: "Nuestra IA no puede generar un Hallazgo clasificado como VERIFICADO sin enlazarlo a un ID de evidencia real. Fin de los falsos positivos.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Lock,
    title: "Fronteras de Autorización",
    description: "Evaluación activa bloqueada criptográficamente si no existe un AuthorizationGrant válido, evitando intrusiones ilegales.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Globe,
    title: "Telemetría OSINT Global",
    description: "Rastreo de DNS pasivo, exposición de puertos y huellas dactilares de servidores desde múltiples puntos de presencia sin emitir alertas.",
    color: "from-green-500 to-emerald-500"
  }
];

const stats = [
  { value: "SHA-256", label: "Cadena de Custodia" },
  { value: "0", label: "Falsos Positivos IA" },
  { value: "STIX 2.1", label: "Interoperabilidad" },
  { value: "100%", label: "Cumplimiento Legal" },
];

const competitors = [
  { name: "Sistemas MISP Clásicos", evidence: false, aiGrounded: false, authGates: false, focus: "Comunidad/SIEM", highlight: false },
  { name: "OpenCTI", evidence: true, aiGrounded: false, authGates: false, focus: "Campañas/TTPs", highlight: false },
  { name: "Civil Sentry", evidence: true, aiGrounded: true, authGates: true, focus: "Exposición Externa", highlight: true },
];

export function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-purple-500/30 font-sans">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4" />
              <span className="font-mono tracking-widest uppercase">Evidence-Driven Cyber Awareness</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Civil Sentry
              </span>
            </h1>

            <p className="text-2xl md:text-4xl text-slate-300 mb-6 font-light max-w-4xl mx-auto">
              Inteligencia OSINT que puedes probar en un juzgado.
            </p>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Plataforma de exposición externa diseñada para administraciones públicas. Separamos la observación pasiva del ataque activo mediante barreras de autorización estrictas y pruebas criptográficas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <motion.button
                onClick={onEnterApp}
                className="group relative px-8 py-4 bg-purple-600 rounded-lg text-lg font-bold shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2 text-white">
                  INICIAR ESCANEO SINTÉTICO
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.a
                href="#pitch"
                className="px-8 py-4 bg-slate-900 border border-slate-700 rounded-lg text-lg font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all text-slate-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Auditoría de Seguridad
              </motion.a>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.8 }}
                  className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 text-left hover:border-purple-500/30 transition-colors"
                >
                  <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Satellite Visualization Section */}
      <section className="relative py-32 px-4 z-10 border-t border-slate-800 bg-slate-950/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-purple-400 text-xs font-mono mb-6 uppercase tracking-widest">
                <Globe className="w-3 h-3" /> Red Global de Recolección OSINT
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Mapeo de Exposición Perimetral
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
                Nuestros nodos pasivos escanean y triangulan la huella digital de tu infraestructura a nivel global. Las observaciones se capturan de forma no intrusiva y se inyectan en la tubería de evidencias inmutables.
              </p>
            </div>

            <SatelliteVisualization />
          </motion.div>
        </div>
      </section>

      {/* OSINT Técnicas & Ópticas */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-blue-400 text-xs font-mono mb-6 uppercase tracking-widest">
              <Shield className="w-3 h-3" /> OSINT Basado en Evidencias
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              De la Observación a la Certeza
            </h2>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Civil Sentry proporciona herramientas claras para los analistas de seguridad, automatizando la recolección de inteligencia sin cruzar la línea de la legalidad hacia ataques activos no autorizados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Óptica Analista OSINT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 p-10 rounded-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-full">
                  <Globe className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold">Óptica: Analista CTI</h3>
              </div>
              <ul className="space-y-6 text-slate-300">
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-purple-500 shrink-0" />
                  <span><strong>Recolectores Pasivos:</strong> Resolución de DNS en tiempo real, búsqueda WHOIS inversa y escaneo pasivo de banners TLS.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-purple-500 shrink-0" />
                  <span><strong>Pipeline de Evidencias:</strong> Todos los datos en crudo se guardan con hash SHA-256 en el instante de captura para auditorías de cumplimiento.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-purple-500 shrink-0" />
                  <span><strong>Generación de Nivel de Confianza:</strong> Diferenciación tipificada entre HALLAZGO SOPORTADO, VERIFICADO, o SIMPLEMENTE INFERIDO.</span>
                </li>
              </ul>
            </motion.div>

            {/* Óptica CISO */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 p-10 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Lock className="w-64 h-64 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-4 bg-blue-500/20 rounded-full">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Óptica: CISO y Cumplimiento</h3>
              </div>
              <ul className="space-y-6 text-slate-300 relative z-10">
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-blue-500 shrink-0" />
                  <span><strong>Barreras de Autorización Estrictas:</strong> El sistema rechaza iniciar escaneos activos sin un objeto `AuthorizationGrant` firmado criptográficamente.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-blue-500 shrink-0" />
                  <span><strong>Exportación STIX-Ready:</strong> Genera informes de inteligencia de amenazas estructurados listos para ser consumidos por tu SIEM corporativo.</span>
                </li>
                <li className="flex gap-4">
                  <Check className="w-6 h-6 text-blue-500 shrink-0" />
                  <span><strong>Zero Hallucinaciones IA:</strong> Garantía de que ningún agente autónomo inyecte hallazgos inventados en tus informes de exposición.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Differentiation & Competitors */}
      <section id="pitch" className="relative py-32 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Madurez CTI
            </h2>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Herramientas como MISP o OpenCTI asumen inteligencia compartida sobre actores de amenazas. Civil Sentry mapea exclusivamente tu propia exposición externa respaldada por evidencias.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-32"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-sm font-mono tracking-widest text-slate-400">
                    <th className="px-8 py-6 uppercase">Sistema</th>
                    <th className="px-8 py-6 text-center uppercase">Cadena Evidencias</th>
                    <th className="px-8 py-6 text-center uppercase">IA Basada en Evidencia</th>
                    <th className="px-8 py-6 text-center uppercase">Barreras Autorización</th>
                    <th className="px-8 py-6 text-right uppercase">Enfoque Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {competitors.map((comp) => (
                    <tr
                      key={comp.name}
                      className={`transition-colors hover:bg-slate-800/50 ${comp.highlight ? 'bg-purple-900/10' : ''}`}
                    >
                      <td className="px-8 py-6 font-medium text-lg flex items-center gap-3">
                        {comp.name}
                        {comp.highlight && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30 font-mono">NEXT-GEN</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {comp.evidence ? <Check className="w-6 h-6 text-purple-400 mx-auto" /> : <span className="text-slate-600 font-mono">NO</span>}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {comp.aiGrounded ? <Check className="w-6 h-6 text-purple-400 mx-auto" /> : <span className="text-slate-600 font-mono">NO</span>}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {comp.authGates ? <Check className="w-6 h-6 text-purple-400 mx-auto" /> : <span className="text-slate-600 font-mono">NO</span>}
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-lg">
                        <span className={comp.highlight ? 'text-purple-400 font-bold' : 'text-slate-500'}>{comp.focus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-10 rounded-3xl hover:border-slate-700 transition-colors"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Pitch CTA */}
      <section className="relative py-32 px-4 z-10 border-t border-slate-800 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-purple-500/30 rounded-[3rem] p-16 relative overflow-hidden"
          >
            {/* Tech grid overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <Shield className="w-20 h-20 mx-auto mb-8 text-purple-400 relative z-10" />
            <h2 className="text-5xl font-extrabold mb-6 relative z-10 tracking-tight">
              Eleva tu Seguridad con Inteligencia
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Buscamos administraciones públicas interesadas en programas piloto gratuitos de 30 días para auditar su exposición perimetral.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <motion.button
                onClick={onEnterApp}
                className="px-10 py-5 bg-white text-slate-950 rounded-xl text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lanzar Análisis Sintético
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <a
                href="mailto:inversores@civil-sentry.com"
                className="px-10 py-5 bg-transparent border-2 border-slate-700 rounded-xl text-lg font-bold hover:bg-slate-800 hover:border-slate-600 transition-all text-white"
              >
                Contactar Ventas
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-900 py-12 px-4 z-10 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-600 font-mono">
          <div>
            © 2026 Civil Sentry. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-8">
            <a href="https://github.com/abrahamhl/civil-sentry" className="hover:text-purple-400 transition-colors">Repositorio Core</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Metodología CTI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
