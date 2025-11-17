// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { CATALOG } from './catalog.js';
import { SYSTEM, USER_SCHEMA } from './prompt.js';

// --- Fallback recommender: works without OpenAI --- //
function normalize(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function scoreNameMatch(input, item) {
    const a = new Set(normalize(input).split(' '));
    const b = new Set(normalize(`${item.brand} ${item.name}`).split(' '));
    let overlap = 0;
    for (const w of a) if (b.has(w)) overlap++;
    return overlap / Math.max(1, a.size);
}
function fallbackRecommend(userPerfumes, catalog) {
    // 1) score by name similarity
    const scores = catalog.map(c => ({
        item: c,
        score: Math.max(...userPerfumes.map(u => scoreNameMatch(u, c)))
    })).sort((x, y) => y.score - x.score);

    // 2) preference summary (families/notes/vibe from the top 3 scored)
    const top = scores.slice(0, 3).map(s => s.item);
    const families = [...new Set(top.map(t => t.family))];
    const dominantNotes = [...new Set(top.flatMap(t => t.notes || []))].slice(0, 12);
    const vibe = [...new Set(top.flatMap(t => t.vibe || []))].slice(0, 8);

    // 3) build a simple blend from the top 2–3 if they’re not identical
    const unique = [];
    for (const s of scores) {
        if (!unique.find(u => u.item.id === s.item.id)) unique.push(s);
        if (unique.length === 3) break;
    }
    let rec;
    if (unique.length >= 2 && (unique[0].score + unique[1].score) > 0.5) {
        const items = unique.length === 3
            ? [
                { id: unique[0].item.id, name: unique[0].item.name, percent: 50 },
                { id: unique[1].item.id, name: unique[1].item.name, percent: 30 },
                { id: unique[2].item.id, name: unique[2].item.name, percent: 20 }
            ]
            : [
                { id: unique[0].item.id, name: unique[0].item.name, percent: 60 },
                { id: unique[1].item.id, name: unique[1].item.name, percent: 40 }
            ];
        rec = {
            type: 'blend',
            items,
            rationale: 'Offline blend based on closest name matches and complementary families/notes.'
        };
    } else {
        rec = {
            type: 'single',
            items: [{ id: unique[0].item.id, name: unique[0].item.name, percent: 100 }],
            rationale: 'Offline pick based on closest name match.'
        };
    }

    return {
        preferenceSummary: { families, dominantNotes, vibe },
        recommendation: rec
    };
}


const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';
const ALLOW_WEB = String(process.env.ALLOW_WEB_SEARCH || 'false').toLowerCase() === 'true';

app.get('/api/health', (_, res) => res.json({ ok: true }));

// server/index.js  (only the /api/analyze handler body changes)
app.post('/api/analyze', async (req, res) => {
    try {
        const { perfumes = [] } = req.body;
        const cleaned = perfumes.filter(Boolean).slice(0, 3);
        if (cleaned.length === 0) {
            return res.status(400).json({ error: 'Provide at least one perfume name.' });
        }

        const messages = [
            { role: 'system', content: SYSTEM },
            {
                role: 'user',
                content:
                    `User inputs: ${JSON.stringify(cleaned)}\n\n` +
                    `CATALOG (JSON): ${JSON.stringify(CATALOG)}\n\n` +
                    `${USER_SCHEMA}\n\n` +
                    `Return the result by CALLING the function "produce_recommendation" exactly once.`
            }
        ];

        // Function tool enforces a valid JSON object without response_format/text_format
        const functionTool = {
            name: 'produce_recommendation', // <-- this is required
            type: 'function',
            function: {
                name: 'produce_recommendation',
                description: 'Return user preference summary and final recommendation.',
                parameters: {
                    type: 'object',
                    properties: {
                        preferenceSummary: {
                            type: 'object',
                            properties: {
                                families: { type: 'array', items: { type: 'string' } },
                                dominantNotes: { type: 'array', items: { type: 'string' } },
                                vibe: { type: 'array', items: { type: 'string' } }
                            },
                            required: ['families', 'dominantNotes', 'vibe']
                        },
                        recommendation: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', enum: ['blend', 'single'] },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            name: { type: 'string' },
                                            percent: { type: 'number' }
                                        },
                                        required: ['id', 'name', 'percent']
                                    },
                                    minItems: 1,
                                    maxItems: 3
                                },
                                rationale: { type: 'string' }
                            },
                            required: ['type', 'items', 'rationale']
                        }
                    },
                    required: ['preferenceSummary', 'recommendation'],
                    additionalProperties: false
                }
            }
        };


        const tools = [functionTool];
        // optionally allow web lookup
        if (ALLOW_WEB) tools.push({ type: 'web_search' });

        const resp = await openai.responses.create({
            model: MODEL,
            // either of these are fine; `input` is the canonical field
            input: messages,
            tools,
            tool_choice: 'auto'
        });

        // Extract the function call payload
        let result = null;
        const first = resp.output?.[0];
        const content = first?.content || [];
        for (const part of content) {
            if (part.type === 'tool_call' && part.name === 'produce_recommendation') {
                result = JSON.parse(part.arguments);
                break;
            }
        }
        // Fallback: if model printed JSON as text instead of calling the tool
        if (!result) {
            const text = resp.output_text || '';
            result = JSON.parse(text);
        }

        return res.json({ result });
    } catch (err) {
        const code = err?.status || err?.response?.status;
        // If quota/rate limit, use the offline recommender so the UI still works
        if (code === 429) {
            const result = fallbackRecommend(req.body.perfumes || [], CATALOG);
            return res.json({ result, offline: true });
        }
        console.error(err);
        const message = err?.response?.data?.error?.message || err.message || 'Unknown error';
        res.status(500).json({ error: message });
    }
});


const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});


