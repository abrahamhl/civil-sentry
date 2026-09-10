import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Globe, ArrowRight, Check, Activity, Database, Lock, Fingerprint, Menu } from 'lucide-react';
import { CyberGlobe } from './CyberGlobe';
import { useState, useEffect } from 'react';

const features = [
  {
    title: "Triangulación Criptográfica",
    description: "Cada observación OSINT genera un hash inmutable. Si un agente de IA intenta alucinar un hallazgo sin evidencia criptográfica subyacente, el orquestador lo rechaza instantáneamente.",
    icon: Database,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Autorización Basada en Firmas",
    description: "Nunca cruzamos la línea hacia el ataque activo. Las pruebas dinámicas están bloqueadas criptográficamente hasta que la administración firma y provee un AuthorizationGrant.",
    icon: Lock,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Mapeo de Huella Digital STIX",
    description: "Desde DNS huérfanos hasta repositorios filtrados. Todos los artefactos se estructuran en grafos STIX 2.1 nativos para ingesta directa en el SIEM gubernamental.",
    icon: Fingerprint,
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Zero Hallucinaciones",
    description: "El pipeline de IA está atado a la realidad (Grounding). Solo correlaciona CVEs reales sobre banners reales interceptados en la recolección pasiva.",
    icon: Activity,
    color: "from-emerald-500 to-teal-500"
  }
];

const competitors = [
  { name: 'Civil Sentry', evidence: true, aiGrounded: true, authGates: true, focus: 'Auditoría Perimetral', highlight: true },
  { name: 'MISP / OpenCTI', evidence: false, aiGrounded: false, authGates: false, focus: 'Compartir IOCs', highlight: false },
  { name: 'Shodan / Censys', evidence: false, aiGrounded: false, authGates: false, focus: 'Indexación Bruta', highlight: false },
];

export function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-hidden relative">
      
      {/* Premium Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Shield className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <span className="font-bold text-xl tracking-tight">CIVIL SENTRY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-slate-300">
            <a href="#mapeo" className="hover:text-purple-400 transition-colors">OSINT LEO</a>
            <a href="#opticas" className="hover:text-purple-400 transition-colors">EVIDENCIAS</a>
            <a href="#madurez" className="hover:text-purple-400 transition-colors">MADUREZ CTI</a>
            <button onClick={onEnterApp} className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              INICIAR CONSOLA
            </button>
          </div>
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-slate-300" />
          </div>
        </div>
      </nav>

      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <motion.div 
          style={{ y: y1, opacity }}
          className="text-center max-w-5xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-mono mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              EVIDENCE-DRIVEN CYBER SITUATIONAL AWARENESS
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
              Inteligencia <br className="hidden md:block" />
              Basada en Evidencias.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Plataforma de mapeo OSINT paramétrico diseñada para auditar infraestructuras críticas del estado sin cruzar la línea del ataque activo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onEnterApp}
                className="group relative px-8 py-4 bg-white text-slate-950 rounded-xl text-lg font-bold overflow-hidden transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Desplegar Analista IA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <a 
                href="#pitch"
                className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl text-lg font-bold text-white transition-colors"
              >
                Auditoría CTI
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CyberGlobe 3D OSINT Visualizer */}
      <section id="mapeo" className="relative py-32 px-4 z-10 border-t border-slate-800 bg-slate-950/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="mb-16 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-purple-400 text-xs font-mono mb-6 uppercase tracking-widest">
                <Globe className="w-3 h-3" /> Red Global OSINT LEO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Mapeo Perimetral Vía Satélite
              </h2>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed mb-8">
                Nuestros nodos virtuales (satélites de escaneo pasivo) triangulan la huella digital de tu infraestructura a nivel global.
              </p>
              
              <ul className="space-y-4 text-slate-300 font-mono text-sm">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500"/> Escaneo BGP y ASN Global</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500"/> Fingerprinting de Banners TLS</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500"/> Resolución Inversa Constante</li>
              </ul>
            </div>

            <div className="relative">
              <CyberGlobe />
            </div>
          </motion.div>
        </div>
      </section>

      {/* OSINT Técnicas & Ópticas */}
      <section id="opticas" className="relative py-32 px-4 z-10">
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
      <section id="madurez" className="relative py-32 px-4 z-10">
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
      <section id="pitch" className="relative py-32 px-4 z-10 border-t border-slate-800 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950">
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
