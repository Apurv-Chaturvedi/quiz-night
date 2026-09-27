# Quiz Night – website

Static site: `index.html` + `images/`. No build step.

## Netlify (easiest)
1. Sign in at https://app.netlify.com/drop
2. Drag this whole `quiz-night-site` folder onto the page.
3. Rename the site under Site configuration → Change site name (e.g. apurv-quiz-night.netlify.app).
To update later: Deploys → drag the folder in again.

## GitHub Pages
1. Create a public repo (e.g. `quiz-night`) on github.com.
2. Add file → Upload files → drag in the contents of this folder (index.html, images/, .nojekyll).
3. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Site appears at https://<username>.github.io/quiz-night/ after a minute or two.
