async function loadMarkdown(file, elementId) {
    const response = await fetch(file);
    const text = await response.text();
    const html = marked.parse(text);
    document.getElementById(elementId).innerHTML = html;
}

async function loadMdIntoSlots(mdPath) {
    const res = await fetch(mdPath, { cache: "no-cache"});
    if (!res.ok) throw new Error('Failed to load ${mdPath}: ${res.status}');
    const md = await res.text();

    const parts = md.split(/<!--\s*slot:([a-zA-Z0-9_-]+)\s*-->/g)
    for (let i = 1; i < parts.length; i +=2) {
        const slot = parts[i].trim();
        const content = (parts[i+1] || "").trim();
            const el = document.getElementById(slot);
            if(!el) {
                console.warn(`No element found with id="${slot}" for slot marker.`);
                continue;
            }
            
            el.innerHTML = marked.parse(content);
    }
}