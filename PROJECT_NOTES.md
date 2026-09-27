# Quiz Night – project notes

An Apurv Chaturvedi Production. A browser-based team quiz built from four of Apurv's Google Slides quizzes (LAME Quiz, Jeopardy Quiz, Bollywood / Entertainment Quiz, Gunjan Birthday Quiz), fact-checked in September 2026 and meant to be hosted on apurvchaturvedi.me for a beginner-friendly quiz night.

Last updated: 27 September 2026.

## Suggested folder layout

```
quiz-night/
├── PROJECT_NOTES.md              ← this file
├── quiz.html                     ← the app (website version, loads pictures from images/)
├── quiz-all-in-one.html          ← same app with every picture built in (8.5 MB, one file)
├── images/                       ← 122 JPGs taken from the original slides
├── Apurv_Quiz_Question_Bank.xlsx ← question bank with fact-check notes and final clues
├── source/                       ← editable pieces the HTML is built from
│   ├── data.js                   ← all questions and answers
│   ├── app.js                    ← app logic (screens, turns, scoring)
│   ├── style.css                 ← look and feel
│   └── build.py                  ← rebuilds quiz.html and quiz-all-in-one.html
└── original-decks/               ← put the four .pptx exports here for safekeeping
```

## What was done, in order

1. **Read the three original quizzes** (LAME, Jeopardy, Bollywood) from Google Drive and fact-checked every clue against what was true as of 2026.
2. **Built a question bank spreadsheet** (one row per question: clue, answer, status, what needed fixing). Apurv added comments; all were applied.
3. **Added the Gunjan Birthday Quiz.** Its questions were images, so the text was transcribed from the slides. The round is named "Lifestyle mix" in the app, and the personal break-slide photos were left out.
4. **Built the web app** with an opening page, a rounds page, four teams and a live scoreboard.
5. **Pulled all pictures from the PowerPoint exports** – answer slides, the connect rounds, the map and the minimalist posters – cropped and named to match question IDs.
6. **Synced the final clues back into the spreadsheet** (last two columns), all 95 rows marked Done.

## The app

- **Opening page:** title, byline and four editable team names.
- **Rounds page:** seven rounds with progress for each, plus a standings page.
- **Question screen:** clue, optional picture, Correct / Wrong / Pass buttons and Show answer. On picture questions, the masked picture swaps to the answer picture when revealed.
- **Scoreboard:** fixed at the bottom, with −5/+5 manual adjustments and Undo.
- **Turns** rotate between teams automatically. Played questions are greyed out.
- **Scores are saved in the browser** (localStorage), so a refresh doesn't lose the game. "Start over" on the opening page clears everything.
- **Design:** minimalist, cool light-grey paper, black type, one colour per team (blue, pink, green, amber). Fonts are Bricolage Grotesque (interface) and Newsreader (clues), from Google Fonts. It also has a dark mode.

### Scoring (one rule everywhere)

- **Direct question** (the team whose turn it is): correct = full points, wrong = minus half, then it passes on.
- **Pass:** a team can pass its direct question at no cost.
- **Passed question** (next team along): correct = half points, wrong = nothing lost.
- **Points by round:** 10 in most rounds, 10–50 on the Jeopardy board, 5 with no minus in Minimalist posters.

### Picture naming rule

Pictures live in `images/` next to `quiz.html`:
- `<question id>.jpg` is shown with the question (e.g. `images/mp3.jpg`).
- `<question id>-answer.jpg` is shown with the answer (e.g. `images/pc2-answer.jpg`).

Any question can have an answer picture. A question picture only shows if the question has `img:true` in `data.js`.

## How to make changes

- **Edit a clue or answer:** open `source/data.js`, find the question by ID, change the `q:` or `a:` text, then run `python3 build.py` inside `source/` (or ask Claude to rebuild). Simple edits can also be made directly inside `quiz.html` – the questions sit in a clearly marked block near the top of the script.
- **Add a question:** copy an existing line in `data.js`, give it a new unique ID, and add pictures named after that ID.
- **Add a round:** add a new `{ id, title, sub, base, neg, qs:[...] }` block to `ROUNDS`. `base` is the points, `neg:true` turns on minus points for wrong direct answers.
- **Publish:** upload `quiz.html` plus the `images/` folder to the website, keeping them side by side. Or upload `quiz-all-in-one.html` on its own.

## Fact-check decisions (so they aren't undone by accident)

- Comedian (banana): added the 2024 Sotheby's sale (~$6.2M, buyer ate the banana).
- Tom and Jerry: now "feature films", including 1992 and 2021.
- Fifty Shades: original fan-fic title is "Master of the Universe"; first released by a small Australian e-publisher; best-seller claim framed as "at the time".
- Devil Wears Prada: Anna Wintour stepped down as US Vogue editor in 2025; now Condé Nast chief content officer. Sequel in 2026.
- Zathura film is 2005 (book 2002). Vikas Swarup is a former diplomat.
- Little Women: four film adaptations earned multiple Oscar nominations, not two.
- Gone with the Wind: its records were broken in 1950/1959, not "recently"; 2 of its 10 Oscars were honorary.
- The Sound of Music: "top 10 adjusted for inflation" instead of "6th".
- Madonna: no longer "only female artist to 100,000+"; clue now includes Copacabana 2024 (1.6M) and Lady Gaga 2025.
- BMW / Hans Zimmer framed as 2020. Puma "Storm Adrenaline" framed as 2018.
- IKEA printed catalogue discontinued in 2020.
- Häagen-Dazs founded 1960 in the Bronx (spelling: Mattus).
- Toblerone: some production moved to Slovakia in 2023 and the Matterhorn left the packaging.
- Belgian potato surplus framed as 2020.
- Butter chicken: kept Apurv's original wording (no court-case line) at his request.
- Cherry blossom: Japan's *unofficial* national flower.
- Delhi: no longer "second most populous" (UN 2025 ranks it 4th); answer is Delhi, not New Delhi.
- Hagia Sophia reverted to a mosque in 2020.
- Aishwarya: dropped the unverifiable "only actress to endorse Pepsi and Coke"; added Miss World 1994.
- Dilip Kumar (d. 2021) and Kishore Kumar (d. 1987) in past tense.
- Rajinikanth: Sivaji was the first Tamil film to earn ₹100 crore.
- A.R. Rahman: dropped the unconfirmed will.i.am song; added his two Oscars for Slumdog Millionaire.
- Lifestyle mix: Barbie and Ken reunited in 2011; BMW says its logo isn't a propeller (Bavarian flag colours); strawberry-girl trend was summer 2023; Savoy "among the first" hotels with an electric lift.

## Ideas not done yet

- Shorter or multiple-choice versions of the longest clues, for true beginners.
- A presenter/host view on a second screen (answers visible only to the host).
- A timer per question.
- Lifestyle mix g3 (Kardashian) originally mentioned the Mother Armenia statue; it was dropped as unverified.

## Answer key

### Pop culture (pc) – 7 questions, 10 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| pc1 | X = J.K. Rowling, Y = Harry Potter |  |
| pc2 | A banana duct-taped to a wall |  |
| pc3 | Tom and Jerry |  |
| pc4 | X = Broadway, Y = the Theater District, Manhattan (New York City) |  |
| pc5 | X = Fifty Shades of Grey, Y = E.L. James |  |
| pc6 | X = I Want It That Way, Y = Backstreet Boys |  |
| pc7 | They are all owned by Disney | yes |

### Movies based on books (bk) – 9 questions, 10 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| bk1 | X = The Devil Wears Prada, A = Vogue, B = Condé Nast |  |
| bk2 | Mean Girls |  |
| bk3 | X = Jumanji, Y = Zathura |  |
| bk4 | X = Slumdog Millionaire, Y = Q & A |  |
| bk5 | X = Psycho, Y = Alfred Hitchcock |  |
| bk6 | X = Little Women, Y = Louisa May Alcott |  |
| bk7 | Fight Club |  |
| bk8 | Aisha |  |
| bk9 | X = Gone with the Wind, Y = Margaret Mitchell |  |

### Jeopardy (jp) – 25 questions, 10–50 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| jp-ent-1 | X = Jaws, Y = the ocean, Z = shark |  |
| jp-ent-2 | X = The Sound of Music, Y = Maria von Trapp |  |
| jp-ent-3 | X = Oscar, blank = Academy of Motion Picture Arts and Sciences |  |
| jp-ent-4 | Madonna |  |
| jp-ent-5 | Marilyn Monroe |  |
| jp-bus-1 | BMW (the sound debuted on the BMW i4) |  |
| jp-bus-2 | IBM |  |
| jp-bus-3 | X = Levi Strauss (Levi’s), blank = rivets |  |
| jp-bus-4 | Their initials, SA, recalled the Sturmabteilung (“Storm Detachment”), the Nazi paramilitary wing |  |
| jp-bus-5 | IKEA (Ingvar Kamprad, Elmtaryd, Agunnaryd) |  |
| jp-food-1 | Häagen-Dazs |  |
| jp-food-2 | Toblerone |  |
| jp-food-3 | Parmigiano-Reggiano / Parmesan, blank = cheese(s) |  |
| jp-food-4 | X = potatoes, blank = fries |  |
| jp-food-5 | X = Butter chicken, Y = Chicken tikka masala |  |
| jp-nat-1 | X = Sakura, Y = Cherry blossom, blank = Japan |  |
| jp-nat-2 | X = Alligator, Y = Crocodile |  |
| jp-nat-3 | Aurora (the Southern Lights) |  |
| jp-nat-4 | Mosquitoes |  |
| jp-nat-5 | Hurricane names, blank = Meteorological |  |
| jp-geo-1 | The Amazon River |  |
| jp-geo-2 | Metric vs imperial: every country uses the metric system except the USA, Liberia and Myanmar | yes |
| jp-geo-3 | X = Delhi, blank = Qutub Minar |  |
| jp-geo-4 | Côte d’Ivoire (Ivory Coast) |  |
| jp-geo-5 | X = Istanbul, Y = Hagia Sophia |  |

### Bollywood: general sawaal (bw) – 10 questions, 10 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| bw1 | Saawariya (debuts of Ranbir Kapoor and Sonam Kapoor) |  |
| bw2 | Radhika Apte – she appears in all four | yes |
| bw3 | X = Vicky Donor, blank = sperm donation, Y = Ayushmann Khurrana |  |
| bw4 | Boman Irani |  |
| bw5 | X = Kaho Naa... Pyaar Hai, Y = Hrithik Roshan |  |
| bw6 | Aishwarya Rai Bachchan |  |
| bw7 | Zoya Akhtar – she directed (or co-directed) all four | yes |
| bw8 | Shah Rukh Khan, in Dilwale Dulhania Le Jayenge |  |
| bw9 | Dressing stars in real branded clothes (DKNY, and later GAP) |  |
| bw10 | Hum Aapke Hain Koun..! |  |

### Naam toh suna hoga (nt) – 8 questions, 10 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| nt1 | Cardi B |  |
| nt2 | Dilip Kumar |  |
| nt3 | Mallika Sherawat |  |
| nt4 | Karan Johar |  |
| nt5 | Madhubala |  |
| nt6 | Rajinikanth |  |
| nt7 | Kishore Kumar |  |
| nt8 | A.R. Rahman |  |

### Minimalist posters (mp) – 13 questions, 5 pts, no minus points

| ID | Answer | Picture Q |
|---|---|---|
| mp1 | Aashiqui 2 | yes |
| mp2 | Andhadhun | yes |
| mp3 | Kapoor & Sons | yes |
| mp4 | Baazigar | yes |
| mp5 | Devdas | yes |
| mp6 | Bunty Aur Babli | yes |
| mp7 | Hera Pheri | yes |
| mp8 | Barfi! | yes |
| mp9 | Beauty and the Beast | yes |
| mp10 | The Incredibles | yes |
| mp11 | Forrest Gump | yes |
| mp12 | The Pursuit of Happyness | yes |
| mp13 | Eat Pray Love | yes |

### Lifestyle mix (lf) – 23 questions, 10 pts, minus half on a wrong direct answer

| ID | Answer | Picture Q |
|---|---|---|
| g1 | Finland, X = Nokia 3310 | yes |
| g2 | JBL | yes |
| g3 | Kardashian (Robert Kardashian, in The People v. O.J. Simpson) |  |
| g4 | Louis Vuitton | yes |
| g5 | Algebra |  |
| g6 | Barbie (Barbara Millicent Roberts) |  |
| g7 | BMW |  |
| g8 | Ray-Ban Aviators – General Douglas MacArthur wore them landing in the Philippines, and the photos made them a hit | yes |
| g9 | Fevicol | yes |
| g10 | iPhone |  |
| g11 | Durex (a $217 baby seat vs a $2.50 pack of condoms) | yes |
| g12 | X = Sorbet, Y = Sherbet |  |
| g13 | Chhena (fresh cheese curds) |  |
| g14 | Old Fashioned |  |
| g15 | Pineapple |  |
| g16 | Strawberry girl | yes |
| g17 | MSG (Ajinomoto) |  |
| g18 | Tarla Dalal (the film is Tarla) | yes |
| g19 | A stammer (stutter) – singing uses a different part of the brain, so he could sing without stammering, like Ranbir Kapoor in Jagga Jasoos | yes |
| g20 | The 9/11 attacks – flights were diverted to Gander when US airspace closed | yes |
| g21 | The bra; blank = corset |  |
| g22 | Guccio Gucci (Gucci) |  |
| g23 | Decathlon (the name spelled backwards) |  |
