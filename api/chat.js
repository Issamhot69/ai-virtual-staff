// Vercel Serverless Function
// POST /api/chat
// body: { persona: { name, description }, messages: [{ role: "user"|"assistant", content: string }] }
// Uses the ANTHROPIC_API_KEY environment variable (already configured in Vercel)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { persona, messages } = req.body || {};
  if (!persona || !messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Requête invalide." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY n'est pas configurée sur le serveur." });
    return;
  }

  const systemPrompt = `Tu es ${persona.name}, un compagnon IA personnel. ${persona.description}
Tu discutes naturellement avec la personne, comme un(e) ami(e) ou un(e) confident(e), en français (ou en Darija si la personne t'écrit en Darija).
Tu restes dans ton personnage à tout moment. Tes réponses sont chaleureuses, concises (quelques phrases, pas de longs pavés), et naturelles à l'oral.
Tu ne prétends jamais être humain, et si la personne exprime une vraie détresse (pas juste de l'ennui), tu l'encourages avec douceur à en parler à un proche ou un professionnel.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: "Erreur API Anthropic", detail: errText });
      return;
    }

    const data = await response.json();
    const textBlock = data.content?.find((b) => b.type === "text");
    const reply = textBlock?.text || "...";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", detail: String(err) });
  }
}
