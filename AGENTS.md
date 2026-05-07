# AGENTS.md

This is a personal DevOps portfolio website using vanilla HTML/CSS/JS with no build system.

## Data Sources

- `data.json` — Main profile (name, role, skills, experience, education, languages)
- `projects.json` — Project entries (title, tech stack, image, link, description points)

Both are loaded at runtime via `fetch()` in `main.js`. Any changes to content go in these JSON files.

## Adding/Updating Content

Edit the JSON files directly — no build step required. The site will reflect changes on next load.

## Project Images

Place images in `images/projects/`. Reference with relative path like `images/projects/jenkins.webp` in `projects.json`.

## Local Testing

Serve the directory with any static file server:
```bash
npx serve .
# or
python -m http.server 8000
```
Open `http://localhost:8000` (or `http://127.0.0.1:5500` with Live Server).

## Deployment

### GitHub Pages
Pushed to the `main` branch triggers the GitHub Actions workflow (`.github/workflows/static.yml`) which deploys to GitHub Pages.

### Cloudflare Pages
1. Push to a Git repository (GitHub/GitLab/Bitbucket)
2. Go to Cloudflare Dashboard > Pages > Create new project
3. Connect your repository
4. Build settings:
   - Production branch: `main`
   - Build command: (empty - this is a static site)
   - Output directory: (empty)
5. Deploy

Custom domain can be added in Cloudflare Pages settings after first deploy.

## Tech Stack

- HTML5 + CSS3 + Vanilla JS (ES6+)
- No frameworks, no bundlers
- Static hosting on GitHub Pages