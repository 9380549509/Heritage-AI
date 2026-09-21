import { Router, type IRouter } from "express";
import {
  AnalyzeHeritageImageBody,
  AnalyzeHeritageImageResponse,
  ExplainHeritageImageBody,
  ExplainHeritageImageResponse,
  ListHeritageSitesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const supportedSites = [
  {
    name: "Badami Cave Temples",
    region: "Bagalkot district",
    period: "6th century CE",
    accent: "Rock-cut sanctuaries",
  },
  {
    name: "Pattadakal",
    region: "Bagalkot district",
    period: "7th–8th century CE",
    accent: "Chalukyan temple ensemble",
  },
  {
    name: "Aihole",
    region: "Bagalkot district",
    period: "5th–8th century CE",
    accent: "Early temple experimentation",
  },
  {
    name: "Mahakuta",
    region: "Bagalkot district",
    period: "6th–8th century CE",
    accent: "Shaiva temple complex",
  },
  {
    name: "Banashankari",
    region: "Bagalkot district",
    period: "8th century CE",
    accent: "Dravidian shrine tradition",
  },
  {
    name: "Kudalasangama",
    region: "Bagalkot district",
    period: "12th century CE",
    accent: "Basavanna pilgrimage site",
  },
];

const analysisPrompt = (language: string) => `
You are Heritage AI, a careful Karnataka heritage guide. Analyze the supplied monument photograph.
Return ONLY valid JSON with exactly these keys:
monument_name, confidence, location, historical_period, historical_significance, architecture,
interesting_facts, best_time_to_visit, nearby_attractions, description, reason_for_identification.
confidence must be a number from 0 to 100. interesting_facts and nearby_attractions must be arrays of strings.
Answer all text in ${language}. If the image is unclear, does not show a monument, or is not reasonably
identifiable as a supported Karnataka heritage site, set monument_name to "Unknown", confidence to 0,
and explain that a clearer image is needed in reason_for_identification. Never confidently invent a site.
Consider these target sites when relevant: ${supportedSites.map((site) => site.name).join(", ")}.
`;

const explanationPrompt = (language: string) => `
You are Heritage AI, explaining architecture in a Karnataka monument photograph for a curious traveler.
Return ONLY valid JSON with exactly these keys:
title, summary, features, note.
features must be an array of objects with exactly feature and explanation string keys.
Answer all text in ${language}. Describe only visible or cautiously inferable features; if the image is
unclear, say so in note rather than inventing details.
`;

function stripJsonFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function askGemini(
  imageBase64: string,
  mimeType: string,
  prompt: string,
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned no usable content");
  }

  return JSON.parse(stripJsonFence(text));
}

router.get("/heritage/sites", (_req, res): void => {
  res.json(ListHeritageSitesResponse.parse(supportedSites));
});

router.post("/heritage/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeHeritageImageBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid heritage image request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const result = await askGemini(
      parsed.data.image_base64,
      parsed.data.mime_type,
      analysisPrompt(parsed.data.language),
    );
    res.json(AnalyzeHeritageImageResponse.parse(result));
  } catch (error) {
    req.log.error({ err: error }, "Heritage image analysis failed");
    res.status(502).json({ error: "The heritage guide could not analyze this image right now." });
  }
});

router.post("/heritage/explain", async (req, res): Promise<void> => {
  const parsed = ExplainHeritageImageBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid heritage explanation request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const result = await askGemini(
      parsed.data.image_base64,
      parsed.data.mime_type,
      explanationPrompt(parsed.data.language),
    );
    res.json(ExplainHeritageImageResponse.parse(result));
  } catch (error) {
    req.log.error({ err: error }, "Heritage image explanation failed");
    res.status(502).json({ error: "The heritage guide could not explain this image right now." });
  }
});

export default router;