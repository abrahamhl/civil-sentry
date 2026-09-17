import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Globe, Lock, Fingerprint, Activity, Database, ChevronRight, Terminal, Server, Network } from 'lucide-react';
import { CyberGlobe } from './CyberGlobe';
import { useState, useEffect } from 'react';

const SmoothScrollLink = ({ href, children, className }: any) => {
  const handleClick = (e: any) => {
    e.preventDefault();
    const target = document.getElementById(href.replace('#', ''));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

// --- SIMULATORS ---

const LogStreamSimulator = () => {
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    const stream = [
      "INIT passive_dns_scan --target=defensa.gob",
      "[+] Resolving subdomains via Certificate Transparency...",
      "[+] Found: mail.defensa.gob (IP: 198.51.100.4)",
      "[+] Found: vpn.defensa.gob (IP: 198.51.100.5)",
      "INIT tls_banner_grab --stealth",
      "[!] WARNING: mail.defensa.gob exposing Exchange 2013",
      "[+] Hash evidence generated: 0x9f8a...b1c2",
      "SLEEP 30s..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-4), stream[i]]);
      i = (i + 1) % stream.length;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-purple-500/30 rounded-xl p-4 font-mono text-xs h-48 overflow-hidden flex flex-col justify-end shadow-inner">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
        <Terminal className="w-4 h-4 text-purple-500" />
        <span className="text-slate-400">node-01.recolector.pasivo</span>
      </div>
      {logs.map((log, idx) => (
        <div key={idx} className={`${log.includes('WARNING') ? 'text-amber-400' : log.includes('Hash') ? 'text-emerald-400' : 'text-slate-300'} mb-1 animate-pulse`}>
          {log}
        </div>
      ))}
    </div>
  );
};

const AIPipelineSimulator = () => {
  return (
    <div className="bg-black border border-blue-500/30 rounded-xl p-4 font-mono text-xs h-48 overflow-hidden relative shadow-inner">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
        <Server className="w-4 h-4 text-blue-500" />
        <span className="text-slate-400">motor-inferencia.ia</span>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2 items-start">
          <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 animate-ping" />
          <div className="text-slate-300">
            <span className="text-blue-400">ANALIZANDO EVIDENCIA:</span> 0x9f8a...b1c2<br/>
            <span className="text-slate-500">Correlacionando CVE database...</span>
          </div>
        </div>
        <div className="flex gap-2 items-start opacity-70">
          <div className="w-2 h-2 mt-1 rounded-full bg-emerald-500" />
          <div className="text-emerald-400">
            [GROUNDING CHECK PASS]<br/>
            <span className="text-slate-400">Hallazgo soportado por firma TLS criptográfica. 0% riesgo de alucinación.</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

// --- MAIN PAGE ---

export function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-purple-500/30 overflow-hidden relative">
      
      {/* Premium Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#020617]/90 backdrop-blur-xl border-white/5 py-4 shadow-2xl' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Shield className="w-6 h-6 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <span className="font-bold tracking-[0.2em] text-sm text-slate-200">CIVIL SENTRY</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-mono tracking-widest text-slate-400">
            <SmoothScrollLink href="#context" className="hover:text-purple-400 transition-colors">01. CONTEXTO</SmoothScrollLink>
            <SmoothScrollLink href="#mvp" className="hover:text-purple-400 transition-colors">02. EL MVP</SmoothScrollLink>
            <SmoothScrollLink href="#engine" className="hover:text-purple-400 transition-colors">03. MOTOR TÁCTICO</SmoothScrollLink>
            <button onClick={onEnterApp} className="px-6 py-2.5 bg-white text-black hover:bg-purple-500 hover:text-white rounded-none font-bold transition-all">
              INICIAR CONSOLA
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-80">
           <CyberGlobe />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
        
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-20 text-center max-w-5xl mx-auto px-4 mt-32"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black/50 border border-white/10 rounded-full text-slate-300 text-xs font-mono mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            VIGILANCIA PERIMETRAL DE ESTADO (OSINT)
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
            Inteligencia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-500">
              Basada en Evidencias.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Mapeamos la huella digital de la infraestructura crítica mediante recolección pasiva. Cero escaneos activos. Cero intrusión. Inteligencia CTI pura.
          </p>

          <SmoothScrollLink href="#context" className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
            <ChevronRight className="w-6 h-6 rotate-90 text-slate-400" />
          </SmoothScrollLink>
        </motion.div>
      </section>

      {/* Context & Storytelling */}
      <section id="context" className="relative py-32 px-4 z-20 bg-[#020617]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-purple-500/50" />
            <span className="font-mono text-xs tracking-[0.2em] text-purple-400">01. EL CONTEXTO</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight leading-tight">
            Las instituciones están ciegas ante su propia sombra digital.
          </h2>
          
          <div className="space-y-8 text-xl text-slate-400 font-light leading-relaxed">
            <p>
              Hoy en día, las administraciones públicas y corporaciones estratégicas invierten millones en fortificar sus redes internas, pero desconocen qué partes de su infraestructura están <strong className="text-white font-medium">expuestas a internet por error</strong> (servidores olvidados, DNS huérfanos, credenciales filtradas).
            </p>
            <p>
              El problema es que <strong className="text-white font-medium">auditar activamente estos perímetros roza la ilegalidad</strong> si no hay autorizaciones firmadas. Los atacantes no tienen esa restricción: usan OSINT (Inteligencia de Fuentes Abiertas) para cartografiar el objetivo sin tocarlo.
            </p>
            <div className="p-8 border-l-4 border-purple-500 bg-white/5 rounded-r-2xl">
              <p className="text-white italic">
                "Civil Sentry nace para democratizar las capacidades de inteligencia de estado. Utilizamos las mismas técnicas OSINT no intrusivas que los adversarios, pero para defender."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The MVP Explained (Simulators) */}
      <section id="mvp" className="relative py-32 px-4 z-20 border-t border-white/5 bg-slate-950/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono text-xs tracking-[0.2em] text-blue-400">02. EL PRODUCTO MÍNIMO VIABLE (MVP)</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">¿Qué hace la V1 hoy?</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                El MVP de Civil Sentry es un <strong>motor automatizado de cartografía perimetral</strong>. A través de un simple dominio objetivo, la plataforma orquesta recolectores pasivos que peinan internet sin enviar un solo paquete directo al servidor.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded bg-blue-500/20"><Network className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <strong className="block text-white mb-1">1. Descubrimiento Pasivo</strong>
                    <span className="text-slate-400 text-sm">Rastreamos certificados TLS públicos y bases de datos WHOIS para encontrar subdominios y activos olvidados.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded bg-purple-500/20"><Database className="w-5 h-5 text-purple-400" /></div>
                  <div>
                    <strong className="block text-white mb-1">2. Ingesta Criptográfica</strong>
                    <span className="text-slate-400 text-sm">Cada activo encontrado se hashea. Construimos una cadena de custodia inmutable de cada hallazgo.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded bg-emerald-500/20"><Activity className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <strong className="block text-white mb-1">3. IA 'Zero Hallucinations'</strong>
                    <span className="text-slate-400 text-sm">Nuestro agente LLM evalúa los metadatos, pero el sistema bloquea cualquier conclusión que no esté anclada a una evidencia real (Grounding).</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bento Box Simulators */}
            <div className="grid gap-4">
              <div className="bg-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2"><Globe className="w-4 h-4"/> SIMULADOR: RECOLECTOR OSINT</h3>
                <LogStreamSimulator />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <h3 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2"><Lock className="w-4 h-4"/> EVIDENCIAS</h3>
                  <div className="text-3xl font-light text-white mb-1">2,041</div>
                  <div className="text-xs text-emerald-400 font-mono">+124 en última hora</div>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                   <h3 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4"/> IA PIPELINE</h3>
                   <AIPipelineSimulator />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch CTA */}
      <section id="engine" className="relative py-32 px-4 z-20 bg-[#020617] border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3)] rotate-3">
             <Shield className="w-12 h-12 text-white -rotate-3" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Invierte en Defensa Soberana.
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed font-light">
            Civil Sentry está listo para despliegues piloto en el sector gubernamental. CTI avanzado sin riesgos legales, gestionado por Inteligencia Artificial estructurada.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onEnterApp}
              className="px-10 py-5 bg-white text-black rounded-sm text-sm font-bold tracking-widest uppercase hover:bg-purple-500 hover:text-white transition-all w-full sm:w-auto"
            >
              PROBAR CONSOLA TÁCTICA
            </button>
            <a
              href="mailto:inversores@civil-sentry.com"
              className="px-10 py-5 bg-transparent border border-slate-700 hover:border-slate-400 text-white rounded-sm text-sm font-bold tracking-widest uppercase transition-all w-full sm:w-auto"
            >
              SOLICITAR DUE DILIGENCE
            </a>
          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-xs font-mono text-slate-600 bg-black">
        © 2026 CIVIL SENTRY (OSINT PLATFORM). ENCRYPTED CHANNEL.
      </footer>
    </div>
  );
}
