const TEAM_COLORS = ["#2743D8","#D6336C","#0E8F63","#D98A00"];
const DEFAULT_TEAMS = ["Team 1","Team 2","Team 3","Team 4"];
const KEY = "apurv-quiz-v1";
const IMG_DIR = "images/";
const imgSrc = n => (window.IMAGES && window.IMAGES[n]) || IMG_DIR + n;
const ALLQ = {}; ROUNDS.forEach(r => r.qs.forEach(q => { q.round = r.id; ALLQ[q.id] = q; }));

let S = load() || fresh();
let cur = null; // current question flow
function fresh(){ return { teams: DEFAULT_TEAMS.map(n=>({name:n, score:0})), used:{}, turn:0, log:[], started:false }; }
function load(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; } }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

const app = document.getElementById("app");
const board = document.getElementById("scores");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pts = (r,q) => q.v || r.base;
const roundOf = q => ROUNDS.find(r => r.id === q.round);

// Navigation is kept in memory so it works even where the page sits inside a viewer that blocks link or hash changes.
let NAV = location.hash.replace("#","");
function go(view, arg){
  NAV = arg ? view + "/" + arg : view;
  try { history.replaceState(null, "", "#" + NAV); } catch(e){}
  route(); window.scrollTo(0, 0);
}
document.addEventListener("click", e => {
  const link = e.target.closest && e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const [v, arg] = link.getAttribute("href").slice(1).split("/");
  go(v, arg);
});
window.addEventListener("hashchange", () => { const h = location.hash.replace("#",""); if (h !== NAV){ NAV = h; route(); } });
function route(){
  const [view, arg] = NAV.split("/");
  document.body.dataset.view = view || "home";
  if (!view || view === "home") return renderHome();
  if (view === "rounds") return renderRounds();
  if (view === "round") return renderRound(arg);
  if (view === "q") return renderQuestion(arg);
  if (view === "results") return renderResults();
  renderHome();
}

/* ---------- Home ---------- */
function renderHome(){
  app.innerHTML = `
  <section class="home">
    <p class="byline">An Apurv Chaturvedi Production</p>
    <h1 class="title">Quiz<br>night</h1>
    <div class="teams" id="teamForm">
      <p class="lede">Name your four teams</p>
      ${S.teams.map((t,i)=>`
        <label class="team-input" style="--c:${TEAM_COLORS[i]}">
          <span class="swatch" aria-hidden="true"></span>
          <input value="${esc(t.name)}" data-i="${i}" maxlength="24" aria-label="Team ${i+1} name">
        </label>`).join("")}
      <div class="actions">
        <button class="btn primary" type="button" id="startBtn">${S.started ? "Continue quiz" : "Start quiz"}</button>
        ${S.started ? `<button class="btn quiet" type="button" id="resetBtn">Start over</button>` : ""}
      </div>
    </div>
    <details class="rules">
      <summary>How scoring works</summary>
      ${rulesHTML()}
    </details>
  </section>`;
  const start = () => {
    app.querySelectorAll("input[data-i]").forEach(inp => { S.teams[+inp.dataset.i].name = inp.value.trim() || DEFAULT_TEAMS[+inp.dataset.i]; });
    S.started = true; save(); go("rounds");
  };
  document.getElementById("startBtn").onclick = start;
  app.querySelectorAll("input[data-i]").forEach(inp => inp.onkeydown = e => { if (e.key === "Enter") start(); });
  const rb = document.getElementById("resetBtn");
  if (rb) rb.onclick = () => { if (confirm("Clear all scores and used questions?")) { S = fresh(); save(); renderHome(); renderScores(); } };
  renderScores();
}
function rulesHTML(){
  return `<ul class="rule-list">
    <li>Questions go to teams in turn. The team whose turn it is gets the question <b>direct</b>.</li>
    <li>Direct and correct: full points. Direct and wrong: minus half the points, and the question passes on.</li>
    <li>A team can <b>pass</b> its direct question to avoid the risk. Nothing is lost.</li>
    <li>Passed questions go to the next team: correct earns half the points, wrong costs nothing.</li>
    <li>Picture rounds have no minus points.</li>
  </ul>`;
}

/* ---------- Rounds ---------- */
function renderRounds(){
  app.innerHTML = `
  <section class="rounds">
    <header class="page-head"><h2>Rounds</h2><a class="link" href="#results">See standings</a></header>
    <ol class="round-list">
      ${ROUNDS.map((r,i)=>{
        const done = r.qs.filter(q=>S.used[q.id]).length;
        return `<li><a class="round-row" href="#round/${r.id}">
          <span class="round-no">${i+1}</span>
          <span class="round-name">${esc(r.title)}<small>${esc(r.sub)}</small></span>
          <span class="round-meta">${scoringLine(r)}<small>${done} of ${r.qs.length} played</small></span>
        </a></li>`; }).join("")}
    </ol>
  </section>`;
  renderScores();
}
function scoringLine(r){
  if (r.board) return `10–50 pts, minus half if wrong`;
  return r.neg ? `${r.base} pts, −${r.base/2} if wrong` : `${r.base} pts, no minus`;
}

/* ---------- Round ---------- */
function renderRound(id){
  const r = ROUNDS.find(x=>x.id===id); if (!r) return go("rounds");
  let grid;
  if (r.board){
    grid = `<div class="board" style="--cols:${r.cats.length}">
      ${r.cats.map(c=>`<div class="cat">${esc(c)}</div>`).join("")}
      ${[10,20,30,40,50].map(v => r.cats.map((c,ci)=>{
        const q = r.qs.find(x=>x.cat===ci && x.v===v);
        return q ? tile(q, v) : `<span></span>`; }).join("")).join("")}
    </div>`;
  } else {
    grid = `<div class="tiles">${r.qs.map((q,i)=>tile(q, i+1)).join("")}</div>`;
  }
  app.innerHTML = `
  <section class="round">
    <header class="page-head">
      <div><a class="link" href="#rounds">All rounds</a><h2>${esc(r.title)}</h2><p class="muted">${esc(r.sub)}. ${scoringLine(r)}.</p></div>
      <p class="next-up">Next question goes to <b style="color:${TEAM_COLORS[S.turn]}">${esc(S.teams[S.turn].name)}</b></p>
    </header>
    ${grid}
  </section>`;
  renderScores();
}
function tile(q, label){
  const used = S.used[q.id];
  return `<a class="tile ${used?"used":""} ${q.todo?"todo":""}" href="#q/${q.id}" aria-label="Question ${label}${used?", played":""}">${label}</a>`;
}

/* ---------- Question ---------- */
function renderQuestion(id){
  const q = ALLQ[id]; if (!q) return go("rounds");
  const r = roundOf(q);
  if (!cur || cur.id !== id){
    cur = { id, direct: S.turn, at: S.turn, tried: [], revealed: !!S.used[id], done: !!S.used[id] };
  }
  const P = pts(r,q), half = P/2;
  const team = S.teams[cur.at];
  const isDirect = cur.at === cur.direct && cur.tried.length === 0;
  const stake = isDirect ? `Direct: +${P}${r.neg?` / −${half}`:""}` : `Passed: +${half}`;
  const imgName = q.id + ".jpg";
  app.innerHTML = `
  <section class="question">
    <header class="q-head">
      <a class="link" href="#round/${r.id}">${esc(r.title)}</a>
      <span class="muted">${r.board ? esc(r.cats[q.cat]) + " for " + P : "Question " + (r.qs.indexOf(q)+1) + " of " + r.qs.length}</span>
    </header>
    <div class="q-body ${q.img?"has-img":""}">
      ${q.img ? `<figure class="q-img"><img src="${imgSrc(cur.revealed ? q.id+"-answer.jpg" : imgName)}" alt="" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${imgSrc(imgName)}'}else{this.parentNode.classList.add('missing')}"><figcaption>Add image: ${IMG_DIR+imgName}</figcaption></figure>` : ""}
      <p class="clue">${esc(q.q)}</p>
    </div>
    <div class="answer ${cur.revealed?"shown":""} ${cur.revealed && !q.img?"has-img":""}" aria-live="polite">
      ${cur.revealed ? `<p class="ans-text">${esc(q.a)}</p>
        ${q.img ? "" : `<figure class="ans-fig"><img class="ans-img" src="${imgSrc(q.id+"-answer.jpg")}" alt="" onerror="const a=this.closest('.answer');a.classList.remove('has-img');this.parentNode.remove();fit()"></figure>`}` : ""}
    </div>
    <footer class="controls">
      ${cur.done ? `<p class="status">${cur.result || "Already played."}</p>` : `
        <p class="status"><span class="dot" style="background:${TEAM_COLORS[cur.at]}"></span><b>${esc(team.name)}</b> <span class="muted">${stake}</span></p>
        <div class="btns">
          <button class="btn good" data-act="right">Correct</button>
          <button class="btn bad" data-act="wrong">Wrong</button>
          ${isDirect ? `<button class="btn quiet" data-act="pass">Pass</button>` : ""}
        </div>`}
      <div class="btns">
        ${!cur.revealed ? `<button class="btn quiet" data-act="reveal">Show answer</button>` : ""}
        <button class="btn quiet" data-act="back">Back to round</button>
      </div>
    </footer>
  </section>`;
  app.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act(b.dataset.act, q, r));
  renderScores();
}
function act(a, q, r){
  const P = pts(r,q), half = P/2;
  const isDirect = cur.at === cur.direct && cur.tried.length === 0;
  if (a === "back") return go("round", r.id);
  if (a === "reveal"){ cur.revealed = true; return renderQuestion(q.id); }
  if (a === "right"){
    const gain = isDirect ? P : half;
    score(cur.at, gain, q.id);
    finish(q, `${S.teams[cur.at].name} got it: +${gain}`);
    return;
  }
  if (a === "wrong" && isDirect && r.neg) score(cur.at, -half, q.id);
  // wrong or pass: move on
  cur.tried.push(cur.at);
  const nextTeam = (cur.at + 1) % 4;
  if (cur.tried.length >= 4){ finish(q, "No one got it."); return; }
  cur.at = nextTeam;
  renderQuestion(q.id);
}
function finish(q, msg){
  S.used[q.id] = true; cur.done = true; cur.revealed = true; cur.result = msg;
  S.turn = (cur.direct + 1) % 4; save(); renderQuestion(q.id);
}
function score(i, d, qid){ S.teams[i].score += d; S.log.push({i, d, qid}); save(); }

/* ---------- Results ---------- */
function renderResults(){
  const ranked = S.teams.map((t,i)=>({...t, i})).sort((a,b)=>b.score-a.score);
  app.innerHTML = `
  <section class="results">
    <header class="page-head"><h2>Standings</h2><a class="link" href="#rounds">Back to rounds</a></header>
    <ol class="standings">
      ${ranked.map((t,k)=>`<li style="--c:${TEAM_COLORS[t.i]}"><span class="place">${k+1}</span><span class="st-name">${esc(t.name)}</span><span class="st-score">${t.score}</span></li>`).join("")}
    </ol>
  </section>`;
  renderScores();
}

/* ---------- Scoreboard ---------- */
function renderScores(){
  const show = S.started && document.body.dataset.view !== "home";
  board.hidden = !show;
  if (!show) return;
  board.innerHTML = `
    ${S.teams.map((t,i)=>`
      <div class="sc ${cur && !cur.done && cur.at===i && document.body.dataset.view==="q" ? "active":""}" style="--c:${TEAM_COLORS[i]}">
        <span class="sc-name">${esc(t.name)}</span>
        <span class="sc-score">${t.score}</span>
        <span class="sc-adj"><button data-adj="${i}" data-d="-5" aria-label="Minus 5 for ${esc(t.name)}">−5</button><button data-adj="${i}" data-d="5" aria-label="Plus 5 for ${esc(t.name)}">+5</button></span>
      </div>`).join("")}
    <button class="undo" id="undoBtn" ${S.log.length?"":"disabled"}>Undo</button>`;
  board.querySelectorAll("[data-adj]").forEach(b => b.onclick = () => { score(+b.dataset.adj, +b.dataset.d, null); renderScores(); });
  document.getElementById("undoBtn").onclick = () => { const l = S.log.pop(); if (l){ S.teams[l.i].score -= l.d; save(); route(); } };
}

/* ---------- Fit to screen ---------- */
// Keeps every screen inside the browser window: sizes the tile grid, then shrinks
// question text step by step until the question, picture, answer and buttons all fit.
function fit(){
  const sb = board.hidden ? 0 : board.offsetHeight;
  document.documentElement.style.setProperty("--sb", sb + "px");
  const tl = app.querySelector(".tiles");
  if (tl){
    const n = tl.children.length, g = parseFloat(getComputedStyle(tl).columnGap) || 14;
    const W = tl.clientWidth, H = tl.clientHeight;
    let best = 1, bs = 0;
    for (let c = 1; c <= n; c++){
      const rows = Math.ceil(n / c);
      const s = Math.min((W - g*(c-1)) / c, (H - g*(rows-1)) / rows, 180);
      if (s > bs){ bs = s; best = c; }
    }
    tl.style.setProperty("--cols", best);
    tl.style.setProperty("--ts", Math.max(Math.floor(bs), 44) + "px");
  }
  const box = app.querySelector(".question");
  if (box){
    let k = 1; box.style.setProperty("--k", 1);
    while (box.scrollHeight > box.clientHeight + 1 && k > 0.55){
      k -= 0.05; box.style.setProperty("--k", k.toFixed(2));
    }
  }
}
let fitQueued = false;
const queueFit = () => { if (fitQueued) return; fitQueued = true; requestAnimationFrame(() => { fitQueued = false; fit(); }); };
new MutationObserver(queueFit).observe(app, { childList: true });
new MutationObserver(queueFit).observe(board, { childList: true, attributes: true });
window.addEventListener("resize", queueFit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);

route();
