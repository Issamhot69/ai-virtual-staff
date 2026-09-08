import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Sparkles } from "lucide-react";

const GOLD = "#D4A54A";
const BG = "#0B0A08";
const PANEL = "#141209";
const BORDER = "#262115";

const PERSONAS = [
  { name: "Yasmine", tag: "Amie à l'écoute", description: "Tu écoutes sans juger, tu poses des questions douces, tu es réconfortante et présente pour la personne, surtout le soir." },
  { name: "Karim", tag: "Coach motivant", description: "Tu encourages la personne à avancer sur ses objectifs, tu es énergique, direct mais bienveillant, tu célèbres les petites victoires." },
  { name: "Nadia", tag: "Professeure patiente", description: "Tu expliques les choses simplement, tu aimes qu'on te pose des questions, tu es curieuse et pédagogue." },
  { name: "Sami", tag: "Confident calme", description: "Tu es posé, tu prends le temps, tu aides la personne à réfléchir à voix haute sans jamais la presser." },
];

function initials(name) { return name.slice(0, 2).toUpperCase(); }

export default function FriendAI() {
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startChat = (p) => {
    setPersona(p);
    setMessages([{ role: "assistant", content: `Salut, je suis ${p.name}. ${p.tag.toLowerCase()} — de quoi as-tu envie de parler aujourd'hui ?` }]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, messages: newMessages }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: `⚠️ ${data.error || "Erreur"}` }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Impossible de contacter le serveur." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!persona) {
    return (
      <div style={{ background: BG, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui", color: "#EDE7D9", padding: "40px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Sparkles size={20} color={GOLD} />
            <span style={{ letterSpacing: 2, fontSize: 12, color: GOLD, fontWeight: 600 }}>FRIEND AI</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, margin: "4px 0 6px", color: "#F6EFDD" }}>Choisissez votre compagnon</h1>
          <p style={{ color: "#9C9689", fontSize: 14, marginBottom: 28 }}>Chaque compagnon a sa propre personnalité. Vous pourrez en changer à tout moment.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {PERSONAS.map((p) => (
              <div key={p.name} onClick={() => startChat(p)} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08" }}>{initials(p.name)}</div>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#F6EFDD" }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: GOLD }}>{p.tag}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: "#9C9689", lineHeight: 1.5 }}>{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui", color: "#EDE7D9", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setPersona(null)} style={{ background: "transparent", border: "none", color: "#9C9689", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08", fontSize: 13 }}>{initials(persona.name)}</div>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#F6EFDD" }}>{persona.name}</div>
          <div style={{ fontSize: 10.5, color: GOLD }}>{persona.tag}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
            <div style={{
              maxWidth: "75%", padding: "10px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.5,
              background: m.role === "user" ? "linear-gradient(135deg,#E8C57A,#B8862E)" : PANEL,
              color: m.role === "user" ? "#1A1508" : "#EDE7D9",
              border: m.role === "user" ? "none" : `1px solid ${BORDER}`,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14 }}>
            <div style={{ padding: "10px 14px", borderRadius: 14, background: PANEL, border: `1px solid ${BORDER}`, fontSize: 13, color: "#9C9689" }}>
              {persona.name} écrit...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}`, padding: 16 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Écrivez un message..."
            style={{ flex: 1, background: "#0F0D08", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", color: "#F6EFDD", fontSize: 14 }}
          />
          <button onClick={send} disabled={loading} style={{ background: "linear-gradient(135deg,#E8C57A,#B8862E)", border: "none", borderRadius: 10, padding: "0 18px", color: "#1A1508", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
