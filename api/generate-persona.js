// Vercel Serverless Function
// POST /api/generate-persona
// body: { activity: string }
// Uses the ANTHROPIC_API_KEY environment variable (set in Vercel project settings)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { activity } = req.body || {};
  if (!activity || typeof activity !== "string" || activity.trim().length < 10) {
    res.status(400).json({ error: "Merci de décrire votre activité (au moins quelques phrases)." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY n'est pas configurée sur le serveur." });
    return;
  }

  const systemPrompt = `Tu es un générateur de persona pour un assistant IA d'entreprise.
À partir de la description d'activité fournie par l'utilisateur, réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, au format exact suivant:
{
  "role": "une phrase décrivant le rôle de l'assistant",
  "objectifs": ["objectif 1", "objectif 2", "objectif 3"],
  "taches": ["tâche 1", "tâche 2", "tâche 3", "tâche 4"],
  "ton": "description courte du ton et comportement adapté"
}`;

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
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: activity }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: "Erreur API Anthropic", detail: errText });
      return;
    }

    const data = await response.json();
    const textBlock = data.content?.find((b) => b.type === "text");
    const raw = textBlock?.text || "{}";

    let persona;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      persona = JSON.parse(cleaned);
    } catch (e) {
      res.status(502).json({ error: "Réponse IA invalide", raw });
      return;
    }

    res.status(200).json({ persona });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", detail: String(err) });
  }
}
