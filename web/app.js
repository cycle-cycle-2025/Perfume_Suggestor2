const $ = (id) => document.getElementById(id);
const fillEl = $('fill');
const statusEl = $('status');
const prefEl = $('pref');
const prefTagsEl = $('pref-tags');
const recEl = $('rec');
const blendEl = $('blend');
const jsonEl = $('json');

function setFill(percent) {
    // percent: 0–100
    const minH = 6; // keep a little visual base
    fillEl.style.height = `${minH + (percent * 0.75)}%`;
}

function tagsHtml(list) {
    return (list || []).map(t => `<span class="tag">${t}</span>`).join('');
}

async function analyze() {
    const perfumes = [$('p1').value.trim(), $('p2').value.trim(), $('p3').value.trim()].filter(Boolean);
    if (perfumes.length === 0) {
        alert('Please enter at least one perfume.');
        return;
    }
    statusEl.textContent = 'Analyzing…';
    setFill(10);

    try {
        const res = await fetch('http://localhost:8787/api/analyze', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ perfumes })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed');

        const out = data.result;
        jsonEl.textContent = JSON.stringify(out, null, 2);

        // Preference summary
        const pref = out.preferenceSummary || {};
        prefEl.textContent = `${(pref.families || []).join(', ') || '—'}`;
        prefTagsEl.innerHTML = tagsHtml([...(pref.dominantNotes || []), ...(pref.vibe || [])]);

        // Recommendation
        const rec = out.recommendation || {};
        if (rec.type === 'single' && rec.items?.[0]) {
            const it = rec.items[0];
            recEl.textContent = `Best match: ${it.name} (100%)`;
            blendEl.textContent = rec.rationale || '';
            setFill(100);
        } else if (rec.type === 'blend' && rec.items?.length) {
            const total = rec.items.reduce((a, b) => a + (b.percent || 0), 0);
            recEl.innerHTML = `
        Custom blend (${Math.round(total)}% total):
        <div class="rec" style="margin-top:8px">
          ${rec.items.map(i => `${i.name} – ${i.percent}%`).join('\n')}
        </div>
      `;
            blendEl.textContent = rec.rationale || '';
            // Fill proportionally to how many components (max 3)
            setFill(Math.min(100, rec.items.length * 33));
        } else {
            recEl.textContent = 'No recommendation produced.';
            blendEl.textContent = '';
            setFill(10);
        }

        statusEl.textContent = 'Done';
        setTimeout(() => (statusEl.textContent = ''), 1500);
    } catch (e) {
        console.error(e);
        statusEl.textContent = 'Error';
        alert(e.message);
    }
}

$('analyze').addEventListener('click', analyze);
