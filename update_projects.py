import requests, json, base64, os, re
from datetime import datetime, timezone

# ─── CONFIG ────────────────────────────────────────────────────────────────────
USERNAME      = "ahmedekramalsada"
IMAGE_DIR     = "images/projects"
INCLUDE_FORKS = False          # set True to also show forked repos
SKIP_REPOS    = {              # repo names to always hide
    USERNAME,
    "ahmedekramalsada",
}

GITHUB_TOKEN  = os.getenv("GITHUB_TOKEN")
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.mercy-preview+json",
} if GITHUB_TOKEN else {}

os.makedirs(IMAGE_DIR, exist_ok=True)

# ─── GITHUB LANGUAGE COLORS ────────────────────────────────────────────────────
LANG_COLORS = {
    "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
    "HTML":       "#e34c26", "CSS":        "#563d7c", "Shell":  "#89e051",
    "Dockerfile": "#384d54", "HCL":        "#844FBA", "Go":     "#00ADD8",
    "Rust":       "#dea584", "Java":       "#b07219", "C++":    "#f34b7d",
    "C":          "#555555", "Ruby":       "#701516", "PHP":    "#4F5D95",
    "Makefile":   "#427819", "YAML":       "#cb171e",
}

# ─── HELPERS ───────────────────────────────────────────────────────────────────
def extract_section(content, section_name):
    pattern = rf"##\s*{re.escape(section_name)}\s*\n(.*?)(?=\n##|\Z)"
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else ""

def time_ago(dt_str):
    dt = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    delta = datetime.now(timezone.utc) - dt
    d = delta.days
    if d == 0:   return "Today"
    if d == 1:   return "Yesterday"
    if d < 7:    return f"{d} days ago"
    if d < 30:   return f"{d // 7} week{'s' if d >= 14 else ''} ago"
    if d < 365:  return f"{d // 30} month{'s' if d >= 60 else ''} ago"
    return f"{d // 365} year{'s' if d >= 730 else ''} ago"

def fetch_all_repos():
    repos, page = [], 1
    while True:
        url = (f"https://api.github.com/users/{USERNAME}/repos"
               f"?sort=updated&per_page=100&page={page}")
        res = requests.get(url, headers=HEADERS)
        batch = res.json()
        if not isinstance(batch, list) or not batch:
            break
        repos.extend(batch)
        page += 1
    return repos

def download_preview(repo_name):
    for branch in ("main", "master"):
        url = (f"https://raw.githubusercontent.com"
               f"/{USERNAME}/{repo_name}/{branch}/preview.webp")
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            path = f"{IMAGE_DIR}/{repo_name}.webp"
            with open(path, "wb") as f:
                f.write(res.content)
            return path
    return ""

def parse_readme(repo_name):
    url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/readme"
    res = requests.get(url, headers=HEADERS, timeout=10)
    if res.status_code != 200:
        return None, None
    content = base64.b64decode(res.json()["content"]).decode("utf-8", errors="ignore")
    tech_raw = extract_section(content, "Tech Stack")
    tech = None
    if tech_raw:
        tech = re.sub(r"[`*#\-]", "", tech_raw).strip()
        tech = ", ".join(p.strip() for p in re.split(r"[\n,]+", tech) if p.strip())
    desc_raw = extract_section(content, "Description") or extract_section(content, "About")
    points = None
    if desc_raw:
        points = re.findall(r"^[\*\-]\s+(.+)", desc_raw, re.MULTILINE)[:3]
    return tech, points or None

# ─── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    print(f"Fetching repos for @{USERNAME}...")
    all_repos = fetch_all_repos()
    print(f"Found {len(all_repos)} total repos")

    project_list = []
    lang_counter  = {}
    total_stars   = 0

    for repo in all_repos:
        name = repo["name"]
        if name in SKIP_REPOS:
            continue
        if repo.get("fork") and not INCLUDE_FORKS:
            continue

        is_fork = repo.get("fork", False)
        lang    = repo.get("language") or "Unknown"
        stars   = repo.get("stargazers_count", 0)
        forks   = repo.get("forks_count", 0)

        print(f"  + {name}  [{lang}]  stars:{stars}")

        total_stars += stars
        lang_counter[lang] = lang_counter.get(lang, 0) + 1

        img_path = download_preview(name)
        readme_tech, readme_points = parse_readme(name)

        tech   = readme_tech  or lang
        points = readme_points or ([repo["description"]] if repo.get("description") else ["Developed on GitHub."])

        project_list.append({
            "title":       name.replace("-", " ").replace("_", " ").title(),
            "repo_name":   name,
            "tech":        tech,
            "language":    lang,
            "lang_color":  LANG_COLORS.get(lang, "#8b949e"),
            "topics":      repo.get("topics", []),
            "image":       img_path,
            "link":        repo["html_url"],
            "stars":       stars,
            "forks":       forks,
            "updated":     time_ago(repo["updated_at"]),
            "description": repo.get("description") or "",
            "points":      points,
            "is_fork":     is_fork,
        })

    project_list.sort(key=lambda r: (-r["stars"], r["updated"]))

    top_langs = sorted(
        [(k, v) for k, v in lang_counter.items() if k != "Unknown"],
        key=lambda x: -x[1]
    )

    stats = {
        "total_repos":   len(project_list),
        "total_stars":   total_stars,
        "top_language":  top_langs[0][0] if top_langs else "N/A",
        "languages":     dict(top_langs[:10]),
        "last_updated":  datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    with open("projects.json", "w", encoding="utf-8") as f:
        json.dump({"stats": stats, "projects": project_list}, f, indent=2, ensure_ascii=False)

    print(f"\nDone - {len(project_list)} projects written to projects.json")
    print(f"Total stars: {total_stars} | Top language: {stats['top_language']}")

if __name__ == "__main__":
    main()
