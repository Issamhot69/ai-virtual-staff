export default function Landing({ onStart }) {
  const gold = "#D4A54A", panel = "#141209", border = "#262115", muted = "#9C9689";
  const wrap = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
  const card = { background: panel, border: `1px solid ${border}`, borderRadius: 14, padding: 22 };
  const cta = { background: "linear-gradient(135deg,#E8C57A,#B8862E)", color: "#1A1508", padding: "12px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" };

  const steps = ["Avatar", "Identité", "Activité", "Connaissances", "Fonctions", "Langues & lancement"];
  const plans = [
    { name: "Basic", price: "79€", features: ["Fonctions essentielles", "1 langue", "Support standard"] },
    { name: "Business", price: "149€", features: ["Fonctions avancées", "3 langues", "Support prioritaire"], featured: true },
    { name: "Pro", price: "249€", features: ["Toutes les fonctions", "9 langues", "Support prioritaire + intégrations"] },
    { name: "Premium", price: "Sur devis", features: ["Illimité", "Intégrations avancées", "Account manager dédié"] },
  ];

  return (
    <div style={{ background: "#0B0A08", color: "#EDE7D9", fontFamily: "Inter, ui-sans-serif, system-ui", minHeight: "100vh" }}>
      <div style={{ ...wrap, textAlign: "center", padding: "70px 24px 40px" }}>
        <div style={{ color: gold, letterSpacing: 3, fontSize: 12, fontWeight: 600 }}>VOTRE ASSISTANT IA, VOTRE ÉQUIPE VIRTUELLE</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 48, lineHeight: 1.15, margin: "16px 0", color: "#F6EFDD" }}>
          Un employé virtuel IA<br />taillé pour votre métier
        </h1>
        <p style={{ color: muted, fontSize: 17, maxWidth: 620, margin: "0 auto 28px" }}>
          Créez en 6 étapes un avatar parlant qui répond au téléphone et au chat, qualifie vos clients, prend des rendez-vous et travaille 24/7 — dans 9 langues.
        </p>
        <button style={cta} onClick={onStart}>Créer mon assistant gratuitement</button>
      </div>

      <div style={{ ...wrap, borderTop: `1px solid ${border}`, padding: "50px 24px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, textAlign: "center", color: "#F6EFDD", marginBottom: 6 }}>De la création à l'utilisation</h2>
        <p style={{ textAlign: "center", color: muted, fontSize: 13, marginBottom: 30 }}>Six étapes simples, aucune compétence technique requise.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ ...card, textAlign: "center", padding: "16px 10px" }}>
              <div style={{ color: gold, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: muted }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...wrap, borderTop: `1px solid ${border}`, padding: "50px 24px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, textAlign: "center", color: "#F6EFDD", marginBottom: 30 }}>Choisissez votre pack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((p) => (
            <div key={p.name} style={{ ...card, border: p.featured ? `1px solid ${gold}` : `1px solid ${border}` }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#F6EFDD", margin: "0 0 4px" }}>{p.name}</h3>
              <div style={{ fontSize: 24, fontWeight: 700, color: gold, margin: "10px 0" }}>{p.price}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12.5, color: muted }}>
                {p.features.map((f) => <li key={f} style={{ padding: "4px 0" }}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "50px 24px", borderTop: `1px solid ${border}` }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#F6EFDD", marginBottom: 20 }}>Prêt à créer votre employé virtuel ?</h2>
        <button style={cta} onClick={onStart}>Créer mon assistant</button>
      </div>

      <div style={{ textAlign: "center", padding: "24px", color: muted, fontSize: 12, borderTop: `1px solid ${border}` }}>
        AI Virtual Staff™ — Votre assistant IA, votre équipe virtuelle, votre avantage concurrentiel.
      </div>
    </div>
  );
}
