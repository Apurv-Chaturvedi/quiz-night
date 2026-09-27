import base64, glob, os, json, sys, shutil, zipfile
css=open("style.css").read(); data=open('data.js').read(); app=open('app.js').read()
def page(images_js=""):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Quiz night – An Apurv Chaturvedi Production</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<main id="app"></main>
<nav id="scores" hidden aria-label="Team scores"></nav>
<script>
/* Questions: edit here. Pictures live in the "images" folder next to this file:
   <question id>.jpg is shown with the question, <question id>-answer.jpg with the answer. */
{data}
</script>
{images_js}
<script>
{app}
</script>
</body>
</html>'''
out=".."
# Website version: index.html at the repo root, loading pictures from images/
open(f"{out}/index.html","w").write(page())
print("index.html", round(os.path.getsize(f"{out}/index.html")/1e3,1),"KB")
# Optional single-file copy with pictures built in: python3 build.py --all-in-one
if "--all-in-one" in sys.argv:
    imgs={os.path.basename(f):"data:image/jpeg;base64,"+base64.b64encode(open(f,"rb").read()).decode() for f in sorted(glob.glob("../images/*.jpg"))}
    open(f"{out}/../quiz-all-in-one.html","w").write(page("<script>window.IMAGES="+json.dumps(imgs)+";</script>"))
    print("quiz-all-in-one.html written next to the site folder")
