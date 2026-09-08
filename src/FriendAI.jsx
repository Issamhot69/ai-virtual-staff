import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Sparkles, Volume2, VolumeX } from "lucide-react";

const GOLD = "#D4A54A";
const BG = "#0B0A08";
const PANEL = "#141209";
const BORDER = "#262115";

const PERSONAS = [
  { name: "Yasmine", tag: "Amie à l'écoute", photo: "https://randomuser.me/api/portraits/women/44.jpg", gender: "female", description: "Tu écoutes sans juger, tu poses des questions douces, tu es réconfortante et présente pour la personne, surtout le soir." },
  { name: "Karim", tag: "Coach motivant", photo: "https://randomuser.me/api/portraits/men/32.jpg", gender: "male", description: "Tu encourages la personne à avancer sur ses objectifs, tu es énergique, direct mais bienveillant, tu célèbres les petites victoires." },
  { name: "Nadia", tag: "Professeure patiente", photo: "https://randomuser.me/api/portraits/women/68.jpg", gender: "female", description: "Tu expliques les choses simplement, tu aimes qu'on te pose des questions, tu es curieuse et pédagogue." },
  { name: "Sami", tag: "Confident calme", photo: "https://randomuser.me/api/portraits/men/76.jpg", gender: "male", description: "Tu es posé, tu prends le temps, tu aides la personne à réfléchir à voix haute sans jamais la presser." },
];

function initials(name) { return name.slice(0, 2).toUpperCase(); }

function useAnimationStyles() {
  useEffect(() => {
    if (document.getElementById("friendai-anim-styles")) return;
    const style = document.createElement("style");
    style.id = "friendai-anim-styles";
    style.textContent = `
      @keyframes fa-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes fa-blink {
        0%, 92%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.05); }
      }
      @keyframes fa-mouth-talk {
        0%, 100% { transform: scaleY(0.35); }
        25% { transform: scaleY(1); }
        50% { transform: scaleY(0.5); }
        75% { transform: scaleY(0.85); }
      }
      @keyframes fa-mouth-idle {
        0%, 100% { transform: scaleY(0.15); }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

function LivingAvatar({ persona, size = 120, speaking = false }) {
  const [failed, setFailed] = useState(false);
  const dim = { width: size, height: size, borderRadius: "50%" };

  if (!persona.photo || failed) {
    return (
      <div style={{ ...dim, background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08", fontSize: size * 0.32 }}>
        {initials(persona.name)}
      </div>
    );
  }

  const eyeY = size * 0.42;
  const eyeSpacing = size * 0.16;
  const eyeW = size * 0.1;
  const eyeH = size * 0.045;
  const mouthY = size * 0.68;
  const mouthW = size * 0.16;
  const mouthH = size * 0.05;

  return (
    <div style={{ position: "relative", width: size, height: size, animation: "fa-breathe 3.4s ease-in-out infinite" }}>
      <img
        src={persona.photo}
        alt={persona.name}
        onError={() => setFailed(true)}
        style={{ ...dim, objectFit: "cover", border: `2px solid ${GOLD}`, display: "block" }}
      />
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            top: eyeY,
            left: `calc(50% + ${side * eyeSpacing}px - ${eyeW / 2}px)`,
            width: eyeW,
            height: eyeH,
            borderRadius: eyeH,
            background: "rgba(10,8,4,0.55)",
            animation: "fa-blink 4.5s ease-in-out infinite",
            animationDelay: side === 1 ? "0.05s" : "0s",
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: mouthY,
          left: `calc(50% - ${mouthW / 2}px)`,
          width: mouthW,
          height: mouthH,
          borderRadius: "40%",
          background: "rgba(60,20,20,0.55)",
          animation: speaking ? "fa-mouth-talk 0.42s ease-in-out infinite" : "fa-mouth-idle 1s linear infinite",
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function Avatar({ persona, size = 46, fontSize = 15 }) {
  const [failed, setFailed] = useState(false);
  const dim = { width: size, height: size, borderRadius: "50%", flexShrink: 0 };
  if (persona.photo && !failed) {
    return (
      <img
        src={persona.photo}
        alt={persona.name}
        onError={() => setFailed(true)}
        style={{ ...dim, objectFit: "cover", border: "2px solid #D4A54A" }}
      />
    );
  }
  return (
    <div style={{ ...dim, background: "linear-gradient(135deg,#D4A54A,#8A6A28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: "#0B0A08", fontSize }}>
      {initials(persona.name)}
    </div>
  );
}

function pickVoice(gender) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const frVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("fr"));
  const pool = frVoices.length ? frVoices : voices;
  if (!pool.length) return null;
  const femaleHints = ["female", "amelie", "audrey", "marie", "julie", "celine", "zira"];
  const maleHints = ["male", "thomas", "nicolas", "daniel", "guillaume"];
  const hints = gender === "female" ? femaleHints : maleHints;
  const match = pool.find((v) => hints.some((h) => v.name.toLowerCase().includes(h)));
  return match || pool[0];
}

export default function FriendAI() {
  useAnimationStyles();
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => window.speechSynthesis?.cancel();
  }, []);

  const speak = (text, gender) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.rate = 1;
    utter.pitch = gender === "female" ? 1.05 : 0.95;
    const voice = pickVoice(gender);
    if (voice) utter.voice = voice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const startChat = (p) => {
    setPersona(p);
    const greeting = `Salut, je suis ${p.name}. ${p.tag.toLowerCase()} — de quoi as-tu envie de parler aujourd'hui ?`;
    setMessages([{ role: "assistant", content: greeting }]);
    if (voiceOn) speak(greeting, p.gender);
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
        if (voiceOn) speak(data.reply, persona.gender);
      } else {
        setMessages([...newMessages, { role: "assistant", content: `⚠️ ${data.error || "Erreur"}` }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Impossible de contacter le serveur." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (voiceOn) { window.speechSynthesis?.cancel(); setSpeaking(false); }
    setVoiceOn(!voiceOn);
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
          <p style={{ color: "#9C9689", fontSize: 14, marginBottom: 28 }}>Chaque compagnon a sa propre personnalité et sa propre voix. Vous pourrez en changer à tout moment.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {PERSONAS.map((p) => (
              <div key={p.name} onClick={() => startChat(p)} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Avatar persona={p} size={46} />
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
        <button onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false); setPersona(null); }} style={{ background: "transparent", border: "none", color: "#9C9689", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={18} />
        </button>
        <Avatar persona={persona} size={36} fontSize={13} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#F6EFDD" }}>{persona.name}</div>
          <div style={{ fontSize: 10.5, color: GOLD }}>{speaking ? "parle..." : persona.tag}</div>
        </div>
        <button onClick={toggleVoice} title={voiceOn ? "Couper la voix" : "Activer la voix"} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 8, color: voiceOn ? GOLD : "#9C9689", cursor: "pointer", display: "flex" }}>
          {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "28px 20px 8px" }}>
        <LivingAvatar persona={persona} size={140} speaking={speaking} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14, gap: 8 }}>
            {m.role === "assistant" && <Avatar persona={persona} size={28} fontSize={10} />}
            <div style={{
              maxWidth: "70%", padding: "10px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.5,
              background: m.role === "user" ? "linear-gradient(135deg,#E8C57A,#B8862E)" : PANEL,
              color: m.role === "user" ? "#1A1508" : "#EDE7D9",
              border: m.role === "user" ? "none" : `1px solid ${BORDER}`,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14, gap: 8 }}>
            <Avatar persona={persona} size={28} fontSize={10} />
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
