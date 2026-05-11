/* =========================
   HELPERS
========================= */
const $ = id => document.getElementById(id);

const hideLoader = () => {
    const loader = $("loader");
    if (loader) loader.classList.add("hidden");
};

/* =========================
   LOAD MAIN DATA (data.json)
========================= */
async function loadMainData() {
    try {
        const res = await fetch("data.json");
        if (!res.ok) throw new Error("Failed to load data.json");
        const data = await res.json();

        if ($("name"))  $("name").textContent  = data.name;
        if ($("role"))  $("role").textContent  = data.role;

        if ($("email")) {
            $("email").textContent = data.email;
            $("email").href = `mailto:${data.email}`;
        }
        if ($("linkedin")) {
            $("linkedin").textContent = `linkedin.com/in/${data.linkedin}`;
            $("linkedin").href = `https://linkedin.com/in/${data.linkedin}`;
        }
        if ($("github")) {
            $("github").textContent = `github.com/${data.github}`;
            $("github").href = `https://github.com/${data.github}`;
        }

        if ($("summary")) $("summary").textContent = data.summary;

        if (data.skills)     renderSkills(data.skills);
        if (data.experience) renderExperience(data.experience);
        if (data.education)  renderEducation(data.education);
        if (data.languages)  renderLanguages(data.languages);

    } catch (err) {
        console.error("Error loading main data:", err);
    }
}

/* =========================
   RENDER: SKILLS
========================= */
function renderSkills(skills) {
    const div = $("skills");
    if (!div) return;
    div.innerHTML = Object.entries(skills).map(([section, items]) => `
        <div class="skill-block">
            <h4>${section}</h4>
            <ul>${items.map(s => `<li>${s}</li>`).join("")}</ul>
        </div>
    `).join("");
}

/* =========================
   RENDER: EXPERIENCE
========================= */
function renderExperience(exp) {
    const div = $("experience");
    if (!div) return;
    div.innerHTML = exp.map(job => `
        <div class="exp-item">
            <div class="exp-header">
                <h4>${job.title}</h4>
                <p class="date">${job.date}</p>
            </div>
            <p class="company">${job.company}</p>
            <ul>${job.tasks.map(t => `<li>${t}</li>`).join("")}</ul>
        </div>
    `).join("");
}

/* =========================
   RENDER: EDUCATION
========================= */
function renderEducation(edu) {
    const div = $("education");
    if (!div) return;
    div.innerHTML = `
        <p><strong>${edu.degree}</strong></p>
        <p>${edu.school} — ${edu.year}</p>
    `;
}

/* =========================
   RENDER: LANGUAGES
========================= */
function renderLanguages(langs) {
    const ul = $("languages");
    if (!ul) return;
    ul.innerHTML = langs.map(l => `<li>${l}</li>`).join("");
}

/* =========================
   PROJECTS (projects.json)
========================= */
let allProjects = [];
let activeFilter = "All";
let activeSort   = "stars";

async function loadProjects() {
    const section = $("projects");
    if (!section) return;

    try {
        const res = await fetch("projects.json");
        if (!res.ok) throw new Error("Failed to load projects.json");
        const data = await res.json();

        allProjects = data.projects || [];

        if (data.stats) renderGithubStats(data.stats);
        renderFilterBar(data.stats);
        renderProjectGrid();

    } catch (err) {
        console.error("Error loading projects:", err);
        const div = $("projects");
        if (div) div.innerHTML = '<p style="color:#888">Could not load repositories.</p>';
    }
}

/* ── GitHub Stats Strip ── */
function renderGithubStats(stats) {
    const existing = $("gh-stats");
    if (existing) existing.remove();

    const strip = document.createElement("div");
    strip.id = "gh-stats";
    strip.className = "gh-stats";

    const lastSync = stats.last_updated
        ? new Date(stats.last_updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "—";

    strip.innerHTML = `
        <div class="stat-item"><span class="stat-value">${stats.total_repos}</span><span class="stat-label">Repos</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><span class="stat-value">${stats.total_stars}</span><span class="stat-label">Stars</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><span class="stat-value">${stats.top_language}</span><span class="stat-label">Top Language</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><span class="stat-value sync-date">${lastSync}</span><span class="stat-label">Last Synced</span></div>
    `;

    const projectsSection = $("projects").closest(".section");
    const heading = projectsSection?.querySelector("h3");
    if (heading) heading.insertAdjacentElement("afterend", strip);
}

/* ── Filter + Sort Bar ── */
function renderFilterBar(stats) {
    const existing = $("repo-controls");
    if (existing) existing.remove();

    const languages = stats?.languages ? Object.keys(stats.languages) : [];

    const controls = document.createElement("div");
    controls.id = "repo-controls";
    controls.className = "repo-controls";

    // Filter buttons
    const filterWrap = document.createElement("div");
    filterWrap.className = "filter-btns";

    const allBtn = createFilterBtn("All", activeFilter === "All");
    allBtn.addEventListener("click", () => setFilter("All", filterWrap));
    filterWrap.appendChild(allBtn);

    languages.forEach(lang => {
        const btn = createFilterBtn(lang, activeFilter === lang);
        btn.addEventListener("click", () => setFilter(lang, filterWrap));
        filterWrap.appendChild(btn);
    });

    // Sort select
    const sortWrap = document.createElement("div");
    sortWrap.className = "sort-wrap";
    sortWrap.innerHTML = `
        <label for="sort-select">Sort by</label>
        <select id="sort-select">
            <option value="stars"   ${activeSort === "stars"   ? "selected" : ""}>⭐ Most Stars</option>
            <option value="updated" ${activeSort === "updated" ? "selected" : ""}>🕐 Recently Updated</option>
            <option value="name"    ${activeSort === "name"    ? "selected" : ""}>🔤 Name</option>
        </select>
    `;
    sortWrap.querySelector("select").addEventListener("change", e => {
        activeSort = e.target.value;
        renderProjectGrid();
    });

    controls.appendChild(filterWrap);
    controls.appendChild(sortWrap);

    const ghStats = $("gh-stats");
    if (ghStats) ghStats.insertAdjacentElement("afterend", controls);
    else $("projects").insertAdjacentElement("beforebegin", controls);
}

function createFilterBtn(label, active) {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (active ? " active" : "");
    btn.textContent = label;
    return btn;
}

function setFilter(lang, filterWrap) {
    activeFilter = lang;
    filterWrap.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.toggle("active", b.textContent === lang);
    });
    renderProjectGrid();
}

/* ── Project Grid ── */
function renderProjectGrid() {
    const div = $("projects");
    if (!div) return;

    let filtered = activeFilter === "All"
        ? allProjects
        : allProjects.filter(p => p.language === activeFilter);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (activeSort === "stars")   return b.stars - a.stars;
        if (activeSort === "updated") return 0; // already sorted by updated from JSON
        if (activeSort === "name")    return a.title.localeCompare(b.title);
        return 0;
    });

    if (sorted.length === 0) {
        div.innerHTML = `<p class="no-repos">No repositories found for "${activeFilter}".</p>`;
        return;
    }

    div.innerHTML = sorted.map(p => buildCard(p)).join("");
}

function buildCard(p) {
    const topicsHtml = (p.topics || []).slice(0, 4)
        .map(t => `<span class="repo-topic">${t}</span>`).join("");

    const imgHtml = p.image
        ? `<img src="${p.image}" class="project-img" alt="${p.title}" onerror="this.style.display='none'">`
        : "";

    const forkBadge = p.is_fork ? `<span class="fork-badge">Fork</span>` : "";

    return `
        <a href="${p.link || "#"}" target="_blank" class="project-link" rel="noopener">
            <div class="project">
                ${imgHtml}
                <div class="card-body">
                    <div class="card-header-row">
                        <h4>${p.title}</h4>
                        ${forkBadge}
                    </div>
                    <p class="repo-desc">${p.description || ""}</p>
                    <div class="repo-meta">
                        <span class="lang-dot" style="background:${p.lang_color}"></span>
                        <span class="lang-name">${p.language}</span>
                        <span class="meta-sep">·</span>
                        <span>⭐ ${p.stars}</span>
                        <span class="meta-sep">·</span>
                        <span>🍴 ${p.forks}</span>
                        <span class="meta-sep">·</span>
                        <span class="updated-time">${p.updated}</span>
                    </div>
                    ${topicsHtml ? `<div class="repo-topics">${topicsHtml}</div>` : ""}
                    <ul class="card-points">
                        ${p.points.map(pt => `<li>${pt}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </a>
    `;
}

/* =========================
   INIT
========================= */
async function initPortfolio() {
    await Promise.allSettled([
        loadMainData(),
        loadProjects()
    ]);
    hideLoader();
}

document.addEventListener("DOMContentLoaded", initPortfolio);
