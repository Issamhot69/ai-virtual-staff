import { useState } from "react";
import {
  Check, ArrowRight, ArrowLeft, Sparkles, Phone, MessageSquare,
  Calendar, Target, Zap, Users, CreditCard, Bell, Plug, Rocket, Headphones,
} from "lucide-react";

const GOLD = "#D4A54A";
const PANEL = "#141209";
const BORDER = "#262115";

const STEPS = [
  { id: 1, label: "Avatar" },
  { id: 2, label: "Identité" },
  { id: 3, label: "Activité" },
  { id: 4, label: "Connaissances" },
  { id: 5, label: "Fonctions" },
  { id: 6, label: "Langues & lancement" },
];

const AVATARS = [
  { name: "Léa", tag: "Professionnelle" },
  { name: "Emma", tag: "Élégante" },
  { name: "Chloé", tag: "Chaleureuse" },
  { name: "Sophia", tag: "Moderne" },
  { name: "Isabella", tag: "Luxe" },
  { name: "Alex", tag: "Professionnel" },
  { name: "James", tag: "Charismatique" },
  { name: "Daniel", tag: "Sérieux" },
  { name: "Noah", tag: "Amical" },
  { name: "Ryan", tag: "Dynamique" },
];

const KNOWLEDGE = [
  { icon: "🌐", label: "Site web", note: "https://votre-site.com" },
  { icon: "📄", label: "Documents / PDF", note: "Menus, catalogues, tarifs..." },
  { icon: "🏷", label: "Produits & services", note: "Liste, descriptions, prix..." },
  { icon: "💬", label: "FAQ", note: "Questions / réponses" },
  { icon: "📚", label: "Base de connaissances", note: "Informations internes" },
  { icon: "✍", label: "Importation manuelle", note: "Ajoutez du contenu" },
];

const FUNCTIONS = [
  { icon: Phone, label: "Assistant téléphonique IA" },
  { icon: MessageSquare, label: "Chat / avatar parlant" },
  { icon: Calendar, label: "Prise de rendez-vous" },
  { icon: Target, label: "Qualification de prospects" },
  { icon: Zap, label: "Réponses automatiques" },
  { icon: Users, label: "Transfert vers humain" },
  { icon: CreditCard, label: "Commandes / paiements" },
  { icon: Bell, label: "Notifications & alertes" },
  { icon: Plug, label: "Intégrations (CRM, etc.)" },
];

const LANGUAGES = ["Français", "Anglais", "Espagnol", "Italien", "Allemand", "Arabe", "Portugais", "Chinois", "Russe"];

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: on ? GOLD : "#33301f", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: on ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: on ? "#1A1508" : "#8F8878", transition: "left 0.15s" }} />
    </button>
  );
}

function initials(name) { return name.slice(0, 2).toUpperCase(); }

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [identity, setIdentity] = useState({ name: "Léa", personality: "Chaleureuse, élégante, professionnelle", tone: "Naturel, positif, rassurant" });
  const [activity, setActivity] = useState("Je possède un restaurant italien à Casablanca. Je veux que mon assistant réponde aux appels, prenne les réservations, présente notre menu, donne les prix, réponde aux questions fréquentes et soit disponible 24/7.");
  const [knowledge, setKnowledge] = useState({});
  const [functions, setFunctions] = useState({
    "Assistant téléphonique IA": true, "Chat / avatar parlant": true, "Prise de rendez-vous": true,
    "Qualification de prospects": false, "Réponses automatiques": true, "Transfert vers humain": true,
    "Commandes / paiements": false, "Notifications & alertes": true, "Intégrations (CRM, etc.)": false,
  });
  const [languages, setLanguages] = useState(["Français"]);
  const [published, setPublished] = useState(false);
  const [persona, setPersona] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const analyzeActivity = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    setPersona(null);
    try {
      const res = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(data.error || "Erreur lors de l'analyse.");
      } else {
        setPersona(data.persona);
      }
    } catch (e) {
      setAnalyzeError("Impossible de contacter le serveur.");
    } finally {
      setAnalyzing(false);
    }
  };

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const toggleLang = (l) => setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  return (
    <div style={{ background: "#0B0A08", minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui", color: "#EDE7D9", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Sparkles size={20} color={GOLD} />
          <span style={{ letterSpacing: 2, fontSize: 12, color: GOLD, fontWeight: 600 }}>AI VIRTUAL STAFF™</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, margin: "4px 0 24px", color: "#F6EFDD" }}>Créer votre assistant</h1>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px" }}>
          {STEPS.map((s) => {
            const active = s.id === step;
            const done = s.id < step;
            return (
              <div key={s.id} onClick={() => setStep(s.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: active || done ? 1 : 0.5 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: done ? GOLD : "transparent", border: active ? `2px solid ${GOLD}` : `1px solid ${BORDER}`, color: done ? "#1A1508" : active ? GOLD : "#8F8878" }}>
                  {done ? <Check size={13} /> : s.id}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? GOLD : "#C9C2B2" }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 26, minHeight: 380 }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 4px", color: "#F6EFDD" }}>1. Choisissez votre avatar</h2>
              <p style={{ color: "#9C9689", fontSize: 13, marginBottom: 20 }}>Sélectionnez l'avatar qui représentera votre assistant.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {AVATARS.map((a) => {
                  const active = avatar.name === a.name;
                  return (
                    <div key={a.name} onClick={() => setAvatar(a)} style={{ border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, background: active ? "rgba(212,165,74,0.08)" : "transparent", borderRadius: 12, padding: 12, textAlign: "center", cursor: "pointer" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 8px", background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08", fontSize: 16 }}>{initials(a.name)}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F6EFDD" }}>{a.name}</div>
                      <div style={{ fontSize: 10.5, color: "#8F8878" }}>{a.tag}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 26 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 10px", background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08", fontSize: 32 }}>{initials(avatar.name)}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#F6EFDD" }}>{avatar.name}</div>
              </div>
              <div>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 16px", color: "#F6EFDD" }}>2. Définissez l'identité</h2>
                <label style={{ fontSize: 12, color: "#9C9689" }}>Nom de l'assistant</label>
                <input value={identity.name} onChange={(e) => setIdentity({ ...identity, name: e.target.value })} style={{ width: "100%", background: "#0F0D08", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: "#F6EFDD", margin: "6px 0 14px", fontSize: 13 }} />
                <label style={{ fontSize: 12, color: "#9C9689" }}>Personnalité</label>
                <input value={identity.personality} onChange={(e) => setIdentity({ ...identity, personality: e.target.value })} style={{ width: "100%", background: "#0F0D08", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: "#F6EFDD", margin: "6px 0 14px", fontSize: 13 }} />
                <label style={{ fontSize: 12, color: "#9C9689" }}>Ton de communication</label>
                <input value={identity.tone} onChange={(e) => setIdentity({ ...identity, tone: e.target.value })} style={{ width: "100%", background: "#0F0D08", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: "#F6EFDD", margin: "6px 0", fontSize: 13 }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 4px", color: "#F6EFDD" }}>3. Décrivez votre activité</h2>
              <p style={{ color: "#9C9689", fontSize: 13, marginBottom: 16 }}>Avec vos propres mots — l'IA en déduit rôle, objectifs et comportement.</p>
              <textarea value={activity} onChange={(e) => setActivity(e.target.value)} rows={6} style={{ width: "100%", background: "#0F0D08", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, color: "#F6EFDD", fontSize: 13, lineHeight: 1.6, resize: "vertical" }} />
              <button onClick={analyzeActivity} disabled={analyzing} style={{ marginTop: 14, background: "linear-gradient(135deg,#E8C57A,#B8862E)", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, color: "#1A1508", fontSize: 13, cursor: analyzing ? "default" : "pointer", opacity: analyzing ? 0.7 : 1 }}>
                {analyzing ? "Analyse en cours..." : "Analyser avec l'IA +"}
              </button>

              {analyzeError && (
                <div style={{ marginTop: 14, fontSize: 12.5, color: "#E8A0A0", border: "1px solid #4A2626", borderRadius: 8, padding: 12 }}>
                  {analyzeError}
                </div>
              )}

              {!persona && !analyzeError && (
                <div style={{ marginTop: 18, fontSize: 12.5, color: "#C9C2B2" }}>L'IA va comprendre et générer : rôle de l'assistant, objectifs principaux, tâches et responsabilités, ton et comportement adaptés.</div>
              )}

              {persona && (
                <div style={{ marginTop: 18, border: `1px solid ${GOLD}`, borderRadius: 10, padding: 16, background: "rgba(212,165,74,0.06)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F6EFDD", marginBottom: 6 }}>Rôle</div>
                  <div style={{ fontSize: 12.5, color: "#C9C2B2", marginBottom: 14 }}>{persona.role}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F6EFDD", marginBottom: 6 }}>Objectifs</div>
                  <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 12.5, color: "#C9C2B2" }}>
                    {persona.objectifs?.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F6EFDD", marginBottom: 6 }}>Tâches</div>
                  <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 12.5, color: "#C9C2B2" }}>
                    {persona.taches?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F6EFDD", marginBottom: 6 }}>Ton</div>
                  <div style={{ fontSize: 12.5, color: "#C9C2B2" }}>{persona.ton}</div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 4px", color: "#F6EFDD" }}>4. Importez vos connaissances</h2>
              <p style={{ color: "#9C9689", fontSize: 13, marginBottom: 18 }}>Plus d'informations = réponses plus précises.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {KNOWLEDGE.map((k) => {
                  const active = !!knowledge[k.label];
                  return (
                    <div key={k.label} onClick={() => setKnowledge({ ...knowledge, [k.label]: !active })} style={{ border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: 12, padding: 14, cursor: "pointer", background: active ? "rgba(212,165,74,0.06)" : "transparent" }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#F6EFDD" }}>{k.label}</div>
                      <div style={{ fontSize: 11, color: "#8F8878" }}>{k.note}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 4px", color: "#F6EFDD" }}>5. Choisissez les fonctions</h2>
              <p style={{ color: "#9C9689", fontSize: 13, marginBottom: 18 }}>Activez uniquement ce dont vous avez besoin.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {FUNCTIONS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Icon size={16} color={GOLD} />
                        <span style={{ fontSize: 13, color: "#EDE7D9" }}>{f.label}</span>
                      </div>
                      <Toggle on={!!functions[f.label]} onClick={() => setFunctions({ ...functions, [f.label]: !functions[f.label] })} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: "0 0 4px", color: "#F6EFDD" }}>6. Langues & lancement</h2>
              <p style={{ color: "#9C9689", fontSize: 13, marginBottom: 18 }}>Choisissez les langues, la voix, et publiez votre assistant.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 22 }}>
                {LANGUAGES.map((l) => {
                  const active = languages.includes(l);
                  return (
                    <div key={l} onClick={() => toggleLang(l)} style={{ border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, background: active ? "rgba(212,165,74,0.08)" : "transparent", borderRadius: 10, padding: "10px 8px", textAlign: "center", cursor: "pointer", fontSize: 12.5, color: active ? "#F6EFDD" : "#9C9689" }}>{l}</div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <button onClick={() => setPublished(true)} style={{ flex: 1, background: "linear-gradient(135deg,#E8C57A,#B8862E)", border: "none", borderRadius: 10, padding: "14px 20px", fontWeight: 700, color: "#1A1508", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {published ? "Assistant publié" : "Publier mon assistant"}
                  {published ? <Check size={16} /> : <Rocket size={16} />}
                </button>
                <button style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 20px", color: "#C9C2B2", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <Headphones size={15} /> Tester mon assistant
                </button>
              </div>
              {published && (
                <div style={{ marginTop: 20, padding: 16, borderRadius: 10, border: `1px solid ${GOLD}`, background: "rgba(212,165,74,0.06)", fontSize: 13, color: "#F6EFDD" }}>
                  {identity.name} est en ligne, disponible 24/7 dans {languages.length} langue{languages.length > 1 ? "s" : ""} — prêt à répondre à vos clients.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={goBack} disabled={step === 1} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 20px", color: step === 1 ? "#4A4636" : "#C9C2B2", fontSize: 13, cursor: step === 1 ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={15} /> Retour
          </button>
          {step < 6 && (
            <button onClick={goNext} style={{ background: "linear-gradient(135deg,#E8C57A,#B8862E)", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, color: "#1A1508", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              Suivant <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
