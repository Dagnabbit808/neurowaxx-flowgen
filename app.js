const D=window.FG, $=id=>document.getElementById(id);
const TAGS=["Intro","Verse 1","Verse 2","Verse 3","Pre-Chorus","Chorus","Bridge","Outro"];
const TN={pop:"Pop refs",sla:"Slang",dou:"Double entendres",sub:"Subjects",tec:"Techniques",genx:"Gen X pack",lux:"Rich & Famous pack"};
const BANK=["'89 state of mind, swap a gross rhyme like a Garbage Pail Kid / Flipped a ninety-nine cent charge to a blockbuster hit","Rock in the Walkman, rock in the sock / One play side A, the other one pay the rent on the block","Pac-Man on a diet, still chasin' every dot of the bag / The ghosts work for me now, they just wave the white flag","Bread on the table, bread in the Trapper Keeper / Velcro rip loud, so I count it in the sleeper","Ferris took a day off, I took the whole decade / Rang the school as my own dad, still got the grades paid","Waiting for the lunch lady to grab my collar and straight to the office escort me","Three-headed flow like King Ghidorah on a lunch break / Each head order separate, none of 'em share the crumb cake","Rémy in a teacup, pinky up, very formal / Nan thinks it's Earl Grey, so the family's still normal","Saw a Cabbage Patch doll, riding shotgun in a Benz / A strange sort of luxury, for imaginary friends","The unbothered villain order escargot in the grand dining room / Leave a two-pence copper tip, sealing the sommelier's DOOM","The cold Metal Face chew the Kobe beef with a rusted jaw / Sip the imported burgundy, ignoring the local health law","Swat a pesky fruit fly with the fringe of a Hermes tie / Ash the mahogany blunt in the teacup, let the embers die","Ash the spliff in an oyster shell, cooking loops in the kitchenette / Truffle oil on the drum machine, paying off a Michelin debt","Shorty poured out the imported weed on the back of a classical art degree / I'm sipping an oat milk flat white, charging a highly extortionate fee","Passed the spliff to a shellfish fiend in a crushed velvet blazer / Slicing up the calamari rings with a rusty cut-throat razor","Pour chilled Sancerre beneath a flickering strip mall neon sign / Grip the mic like an Atari joystick, an eight-bit state of mind"];
const START={name:"Blockbuster Late Fee",seed:"Blockbuster late fee in '89",notes:"Gen X nostalgia, owing a late fee to a store that no longer exists; lunchbox nunchucks thread.",style:"boom bap, dusty soul sample, lo-fi, deadpan male rap, 90 bpm",styleIn:false,secs:[
{tag:"Intro",lines:["Wax crackle, sip Margaux out a styrofoam chalice","Printed notice in the grip, still ignoring the balance"]},
{tag:"Verse 1",lines:["Blockbuster late fee since way back in '89","Plus an extra charge for VHS tapes I forgot to rewind","Be kind, least that's what my momma taught me","Packed a pair of nunchucks in my lunchbox, in case a fella try and fought me","Kept my tater tots safe from any fifth-grade bully tryna extort me","Swinging at the teacher's pet before the little tattletale could go report me","Weighing down the Goyard duffel, hundred un-rewound cassettes","Sticker says 'Be Kind, Rewind' to mitigate the old regrets"]},
{tag:"Chorus",lines:["Blockbuster late fee in '89, still ain't paid it","Store's gone, the debt's alive, I'm the one who outlasted","Blockbuster late fee since way back in '89","Plus an extra charge for VHS tapes I forgot to rewind"]},
{tag:"Verse 2",lines:["Chop the leaf with the laminated blue and yellow plastic","Spark a Blockbuster-thick spliff, the ash is cinematic","That Trapper Keeper Velcro, a sound that always drew a stare","Like a muffled shotgun blast, echoing through the school air","Wash the truffle down with Tab soda, pink aluminum aesthetic","Loop the beat and leave it running, looking mildly apathetic","Maverick in the aviators, playing volleyball in denim","Eat the fugu fish at Nobu, hope there ain't a drop of venom"]},
{tag:"Chorus",lines:["Blockbuster late fee in '89, still ain't paid it","Store's gone, the debt's alive, I'm the one who outlasted"]}],
set:{wD:50,wS:50,types:["pop","sla","dou","sub","genx"],pins:[],mutes:["Doom","Villain","mask"],gen:"gemini-pro-latest",judge:"gemini-pro-latest"}};
let uid=1;const mk=t=>({id:uid++,text:t,locked:false,sel:false});
function hydrate(s){return{...s,secs:s.secs.map(x=>({id:uid++,tag:x.tag,lines:x.lines.map(l=>typeof l==="string"?mk(l):{...mk(l.text),locked:!!l.locked})}))}}
const LIFE_START=window.LIFE_START;
let LIB;try{LIB=JSON.parse(localStorage.getItem("fg_library"))}catch(e){LIB=null}
if(!LIB||!LIB.songs){LIB={current:"s1",songs:{}};let old=null;try{old=JSON.parse(localStorage.getItem("fg_song"))}catch(e){}
 LIB.songs.s1=old&&old.secs?{...START,...old,name:"Blockbuster Late Fee"}:START;if(LIFE_START)LIB.songs.s2=LIFE_START}
if(LIFE_START&&!LIB.lifeAdded){if(!Object.values(LIB.songs).some(s=>s.name===LIFE_START.name))LIB.songs["s"+Date.now()]=LIFE_START;LIB.lifeAdded=1}
let S=hydrate(LIB.songs[LIB.current]||Object.values(LIB.songs)[0]);S.set={...START.set,...(S.set||{})};
const plain=()=>({name:S.name,seed:S.seed||"",notes:S.notes||"",style:S.style,styleIn:S.styleIn,set:S.set,secs:S.secs.map(s=>({tag:s.tag,lines:s.lines.map(l=>({text:l.text,locked:l.locked}))}))});
const save=()=>{LIB.songs[LIB.current]=plain();localStorage.setItem("fg_library",JSON.stringify(LIB))};
function switchTo(id){save();LIB.current=id;S=hydrate(LIB.songs[id]);S.set={...START.set,...(S.set||{})};$("cands").innerHTML="";render()}
// ---------- helpers
const words=s=>(s.toLowerCase().match(/[a-z']+/g)||[]);
const stem=w=>w.replace(/'/g,"").replace(/(ing|ed|es|s|z)$/,"");
function muted(s){const low=" "+words(s).join(" ")+" ",ws=words(s).map(stem);for(const m of S.set.mutes){const ml=m.toLowerCase().trim();if(!ml)continue;for(const t of [ml,...(D.alias[stem(ml)]||D.alias[ml]||[])]){if(t.includes(" ")){if(low.includes(" "+t+" "))return true;continue}const st=stem(t);if(ws.some(w=>w===st||(w.startsWith(st)&&w.length-st.length<=4)))return true}}return false}
const bloom=Uint8Array.from(atob(D.bloom),c=>c.charCodeAt(0));
function fnv(s,seed){let h=(2166136261^seed)>>>0;const b=new TextEncoder().encode(s);for(const c of b){h^=c;h=Math.imul(h,16777619)>>>0}return h}
function inCorpus(s){for(let k=0;k<D.K;k++){const b=fnv(s,Math.imul(k,0x9e3779b1)>>>0)%D.M;if(!(bloom[b>>3]&(1<<(b&7))))return false}return true}
function overlap(t){const w=words(t);for(let i=0;i+5<=w.length;i++){const g=w.slice(i,i+5).join(" ");if(inCorpus(g))return g}return null}
const FILLER=new Set(["see","yo","know","dig","uh","huh","yeah","real","doubt","later","though","man","son","ya"]);
function fillerEnd(t){return t.split("\n").some(l=>{const w=words(l);return w.length&&(FILLER.has(w[w.length-1])||["ya know","you know","for real","no doubt"].includes(w.slice(-2).join(" ")))})}
const syl=s=>words(s).reduce((n,w)=>n+Math.max(1,(w.replace(/e$/,"").match(/[aeiouy]+/g)||[]).length),0);
function pool(){const out=[];for(const n of D.nodes){if(!S.set.types.includes(n[0])||muted(n[1]))continue;const w=S.set.wD/100*n[2]/139+S.set.wS/100*n[3]/57;if(w>0)out.push({label:n[1],gloss:n[4],w})}
 if(S.set.types.includes("genx"))for(const [k,v] of D.genx)if(!muted(k))out.push({label:k,gloss:v,w:.08,genx:1});
 if(S.set.types.includes("lux"))for(const [k,v] of D.lux)if(!muted(k))out.push({label:k,gloss:v,w:.1,genx:1});return out}
function wpick(a){let r=Math.random()*a.reduce((x,y)=>x+y.w,0);for(const x of a){r-=x.w;if(r<=0)return x}return a[a.length-1]}
function assignments(k){const p=pool();if(!p.length)return[];const gx=p.filter(x=>x.genx),ar=p.filter(x=>!x.genx);const out=[];
 for(let i=0;i<k;i++){let a;if(S.set.pins.length){const l=S.set.pins[i%S.set.pins.length];const n=D.nodes.find(n=>n[1]===l)||D.genx.find(g=>g[0]===l)||D.lux.find(g=>g[0]===l);a={label:l,gloss:n?(n[4]||n[1]):""}}else a=gx.length&&Math.random()<.6?wpick(gx):wpick(p);const b=ar.length?wpick(ar):wpick(p);out.push({anchor:a.label+" — "+a.gloss,artist_node:b.label+" — "+b.gloss})}return out}
// ---------- Gemini
async function gemini(model,prompt,temp){const key=localStorage.getItem("fg_key");if(!key)throw new Error("Add your Gemini key first (top right).");
 for(let a=0;a<5;a++){const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:temp,responseMimeType:"application/json"}})});
  if(r.status===429||r.status>=500){status(`Rate limited (${r.status}), retrying…`);await new Promise(z=>setTimeout(z,4000*2**a));continue}
  if(!r.ok)throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0,200)}`);
  const j=await r.json();const t=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("");const m=t.match(/\[[\s\S]*\]/);return JSON.parse(m?m[0]:t)}
 throw new Error("Rate limit: try again in a minute or switch to gemini-2.5-flash")}
const style=()=>`Style mix: MF DOOM ${S.set.wD}% (dense multisyllabic/internal rhyme, absurd food/comic imagery, deadpan humour, run-on lines) / Sonnyjim ${S.set.wS}% (slow, unbothered, luxury next to lowlife, brands, fine food, Brum, dry wit).`;
const rules=()=>`Quality bar (original exemplars; match the specificity and twist, do not copy):\n${D.exemplars}\nAVOID ${D.cliche}. Every line must END on a meaningful word, never filler like "see?", "yo", "ya know". Never quote or paraphrase real lyrics by any artist. NEVER use these words or variants: ${S.set.mutes.join(", ")||"none"}.`;
const songText=()=>S.secs.map(s=>`[${s.tag}]\n`+s.lines.map(l=>l.text).join("\n")).join("\n\n");
function judgePrompt(C,ctx){return `You are a harsh editor of rap bars. ${ctx}\nScore each candidate 1-5:\n ref: references real and used with correct meaning in a coherent image (not mere name-drops);\n rhyme: rhymes land and every rhyme word carries meaning (fail filler endings like see?/yo);\n worth: humorous, insightful, vivid_imagery, double_entendre, surprising_juxtaposition or witty_braggadocio (tag all that apply);\n fit: continuity with the song and the request;\n specificity: concrete, surprising, would a fan quote it?\n cliche: true if it relies on ${D.cliche}.\npass = every score >= 4 and cliche false.\nCalibration (score 5): ${D.exemplars.replace(/\n/g," || ")}\nReturn only JSON [{"id":n,"ref":n,"rhyme":n,"worth":n,"fit":n,"specificity":n,"cliche":bool,"tags":[],"pass":bool,"rationale":"one line"}]\nCandidates:\n${JSON.stringify(C.map(c=>({id:c.id,text:c.text})))}`}
async function run(kind,si,li){
 const sec=S.secs[si];const A=assignments(8);const before=S.secs.slice(0,si+1).map(s=>`[${s.tag}]\n`+s.lines.map(l=>l.text).join("\n")).join("\n\n");
 const last=li!=null?sec.lines[li].text:(sec.lines.filter(l=>l.text.trim()).slice(-1)[0]||{}).text||"";
 const selected=sec.lines.filter(l=>l.sel).map(l=>l.text);
 const ask={next:`ONE next line (a single bar) that rhymes with the end sound of: "${last}" (multisyllabic if possible) and continues its image or joke with a callback or escalation. Intent example (each line answers the previous):\n${D.nextShot}`,
  couplet:`ONE next couplet (2 bars, AABB) continuing straight on from: "${last}", same story, escalate the image.`,
  hook:`a 4-bar hook/chorus (AABB or AAAA) for the whole song: short, chantable, repeatable, built on the song's central image, with one quotable twist.`,
  punch:`a punched-up rewrite of these lines, same meaning and slot, sharper images, stronger rhymes, same number of lines:\n${selected.join("\n")||sec.lines.map(l=>l.text).join("\n")}`,
  fill:`a full ${sec.tag} section of 8 bars (4 AABB couplets) that continues the song's story and callbacks.`}[kind];
 const prompt=`You write ORIGINAL rap lyrics for a writer studying MF DOOM and Sonnyjim, inside his song.\n${style()}\nWrite 8 different candidates for: ${ask}\nUse one or two of these references with their REAL meaning (gloss after the dash) inside a concrete image, not a name-drop:\n${A.map((a,i)=>`${i+1}. ${a.anchor} | ${a.artist_node}`).join("\n")}\n${rules()}\nSong: "${S.name}". Seed: "${S.seed||""}". Theme notes: ${S.notes||"none"}.
Target section: ${sec.tag}.\nThe song so far (up to this section):\n${before}\nReturn only JSON [{"text":"line1\\nline2..."}] (use \\n between bars).`;
 status(`Writing 8 candidates with ${S.set.gen}…`);$("cands").innerHTML="";
 try{let C=await gemini(S.set.gen,prompt,.9);C=C.map((c,i)=>({id:i,text:String(c.text||"").trim()})).filter(c=>c.text);
  for(const c of C){c.flags=[];if(muted(c.text))c.flags.push("muted word");const o=overlap(c.text);if(o)c.flags.push("copies corpus: "+o);if(fillerEnd(c.text))c.flags.push("filler ending")}
  const ok=C.filter(c=>!c.flags.length);status(`Judging ${ok.length} (${C.length-ok.length} blocked locally) with ${S.set.judge}…`);
  const J=ok.length?await gemini(S.set.judge,judgePrompt(ok,`Request: ${ask.split("\n")[0]}`),0):[];const jd={};for(const j of J)jd[j.id]=j;
  for(const c of C){const j=jd[c.id]||{};c.j=j;c.score=c.flags.length?0:["ref","rhyme","worth","fit","specificity"].reduce((n,k)=>n+(j[k]||0),0)/5-(j.cliche?2:0);c.pass=!c.flags.length&&!j.cliche&&["ref","rhyme","worth","fit","specificity"].every(k=>(j[k]||0)>=4)}
  C.sort((a,b)=>b.score-a.score);showCands(C.slice(0,3),kind,si,li,C.filter(c=>c.pass).length,C.length)}
 catch(e){status("⚠ "+e.message)}}
function status(t){$("status").textContent=t}
function showCands(C,kind,si,li,np,n){status(`${np} of ${n} passed the strict judge. Top 3:`);const box=$("cands");box.innerHTML="";
 C.forEach(c=>{const d=document.createElement("div");d.className="cand"+(c.pass?"":" fail");const j=c.j||{};
  d.innerHTML=`<pre>${esc(c.text)}</pre><div class="dim">${c.pass?'<span class="good">PASS</span>':'<span class="bad">below bar</span>'} · ${c.score.toFixed(2)} · ref ${j.ref??"-"} rhyme ${j.rhyme??"-"} worth ${j.worth??"-"} fit ${j.fit??"-"} spec ${j.specificity??"-"}${j.cliche?' · <span class="bad">cliché</span>':""}<br>${(j.tags||[]).join(", ")}${c.flags.length?'<br><span class="bad">'+c.flags.join("; ")+"</span>":""}<br>${esc(j.rationale||"")}</div>`;
  const row=document.createElement("div");row.className="row";const b=document.createElement("button");b.className="pri";
  b.textContent=kind==="punch"?"Replace lines":"Insert";b.onclick=()=>insert(c.text,kind,si,li);row.appendChild(b);
  const cp=document.createElement("button");cp.textContent="Copy";cp.onclick=()=>navigator.clipboard.writeText(c.text);row.appendChild(cp);d.appendChild(row);box.appendChild(d)})}
function insert(text,kind,si,li){const sec=S.secs[si];const L=text.split("\n").map(x=>x.trim()).filter(Boolean).map(mk);
 if(kind==="punch"){const idx=sec.lines.map((l,i)=>l.sel&&!l.locked?i:-1).filter(i=>i>=0);if(idx.length){const at=idx[0];sec.lines=sec.lines.filter((l,i)=>!idx.includes(i));sec.lines.splice(at,0,...L)}else sec.lines=[...sec.lines.filter(l=>l.locked),...L]}
 else{const at=li!=null?li+1:sec.lines.length;sec.lines.splice(at,0,...L)}render()}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// ---------- render
function suno(){return(S.styleIn&&S.style.trim()?`[Style: ${S.style.trim()}]\n\n`:"")+S.secs.map(s=>`[${s.tag}]\n`+s.lines.map(l=>l.text.trim()).filter(Boolean).join("\n")).join("\n\n")}
function render(){save();const out=suno();$("chars").innerHTML=`<span class="${out.length>3000?"bad":""}">${out.length} / 3000 chars</span> · ${S.secs.reduce((n,s)=>n+s.lines.length,0)} bars`;
 const host=$("song");host.innerHTML="";
 S.secs.forEach((s,si)=>{const d=document.createElement("div");d.className="sec";
  const top=document.createElement("div");top.className="row";top.style.justifyContent="space-between";
  const sel=document.createElement("select");TAGS.forEach(t=>sel.add(new Option(t,t,false,t===s.tag)));sel.onchange=()=>{s.tag=sel.value;render()};
  const left=document.createElement("div");left.className="row";left.append(sel,txt(`${s.lines.length} bars`));
  const right=document.createElement("div");right.className="row";
  right.append(btn("Next couplet",()=>run("couplet",si)),btn("Fill section",()=>run("fill",si)),btn("Write hook",()=>run("hook",si)),btn("Punch up selected",()=>run("punch",si)),
   btn("↑",()=>{if(si>0){[S.secs[si-1],S.secs[si]]=[S.secs[si],S.secs[si-1]];render()}}),btn("↓",()=>{if(si<S.secs.length-1){[S.secs[si+1],S.secs[si]]=[S.secs[si],S.secs[si+1]];render()}}),
   btn("Duplicate",()=>{S.secs.splice(si+1,0,{id:uid++,tag:s.tag,lines:s.lines.map(l=>mk(l.text))});render()}),btn("✕ Section",()=>{if(confirm("Delete section?")){S.secs.splice(si,1);render()}}));
  top.append(left,right);d.appendChild(top);
  s.lines.forEach((l,i)=>{const r=document.createElement("div");r.className="ln";
   const cb=document.createElement("input");cb.type="checkbox";cb.checked=l.sel;cb.title="select for punch-up";cb.onchange=()=>{l.sel=cb.checked;save()};
   const n=document.createElement("span");n.className="num";n.textContent=`${i+1} · ${syl(l.text)}`;
   const inp=document.createElement("input");inp.type="text";inp.value=l.text;inp.disabled=l.locked;inp.oninput=()=>{l.text=inp.value;n.textContent=`${i+1} · ${syl(l.text)}`;save();$("chars").firstChild.textContent=suno().length+" / 3000 chars"};
   r.append(cb,n,inp,btn("Next line",()=>run("next",si,i)),btn(l.locked?"🔒":"Lock",()=>{l.locked=!l.locked;render()}),btn("↑",()=>{if(i>0){[s.lines[i-1],s.lines[i]]=[s.lines[i],s.lines[i-1]];render()}}),btn("↓",()=>{if(i<s.lines.length-1){[s.lines[i+1],s.lines[i]]=[s.lines[i],s.lines[i+1]];render()}}),btn("✕",()=>{if(!l.locked){s.lines.splice(i,1);render()}}));
   d.appendChild(r)});
  d.appendChild(btn("+ Line",()=>{s.lines.push(mk(""));render()}));host.appendChild(d)});
 renderSide()}
function btn(t,f){const b=document.createElement("button");b.textContent=t;b.onclick=f;return b}
function txt(t){const s=document.createElement("span");s.className="dim";s.textContent=t;return s}
function renderPicker(){const p=$("songSel");p.innerHTML="";for(const [id,s] of Object.entries(LIB.songs))p.add(new Option(s.name||id,id,false,id===LIB.current));$("seed").value=S.seed||"";$("notes").value=S.notes||""}
function renderSide(){renderPicker();$("wD").value=S.set.wD;$("wS").value=S.set.wS;$("wDv").textContent=S.set.wD;$("wSv").textContent=S.set.wS;$("genModel").value=S.set.gen;$("judgeModel").value=S.set.judge;$("style").value=S.style;$("styleIn").checked=S.styleIn;
 $("types").innerHTML="";Object.keys(TN).forEach(k=>{const l=document.createElement("label");l.className="dim";const c=document.createElement("input");c.type="checkbox";c.checked=S.set.types.includes(k);c.onchange=()=>{S.set.types=c.checked?[...S.set.types,k]:S.set.types.filter(x=>x!==k);render()};l.append(c," "+TN[k]+" ");$("types").appendChild(l)});
 const ps=$("pinSel");ps.innerHTML="";ps.add(new Option("Pin a reference…",""));[...D.nodes.filter(n=>["pop","sla","dou"].includes(n[0])).map(n=>n[1]),...D.genx.map(g=>g[0]),...D.lux.map(g=>g[0])].filter(x=>!muted(x)).forEach(x=>ps.add(new Option(x,x)));
 $("pins").innerHTML=S.set.pins.map((p,i)=>`<span class="chip">📌 ${esc(p)} <b data-p="${i}">×</b></span>`).join("");$("pins").querySelectorAll("b").forEach(b=>b.onclick=()=>{S.set.pins.splice(+b.dataset.p,1);render()});
 $("mutes").innerHTML=S.set.mutes.map((p,i)=>`<span class="chip">${esc(p)} <b data-m="${i}">×</b></span>`).join("");$("mutes").querySelectorAll("b").forEach(b=>b.onclick=()=>{S.set.mutes.splice(+b.dataset.m,1);render()});
 const bk=$("bank");bk.innerHTML="";BANK.forEach(t=>{const d=document.createElement("div");d.className="cand";d.innerHTML=`<div>${esc(t.replace(" / ","\n")).replace("\n","<br>")}</div>`;
  const sel=document.createElement("select");S.secs.forEach((s,i)=>sel.add(new Option(`${i+1}. ${s.tag}`,i)));const r=document.createElement("div");r.className="row";
  r.append(sel,btn("Add",()=>{S.secs[+sel.value].lines.push(...t.split(" / ").map(mk));render()}));d.appendChild(r);bk.appendChild(d)})}
// ---------- wiring
$("songSel").onchange=e=>switchTo(e.target.value);
$("newSong").onclick=()=>{const n=prompt("New song name?");if(!n)return;const id="s"+Date.now();LIB.songs[id]={...START,name:n,seed:"",notes:"",secs:[{tag:"Verse 1",lines:[""]}]};switchTo(id)};
$("renSong").onclick=()=>{const n=prompt("Rename song",S.name);if(n){S.name=n;render()}};
$("delSong").onclick=()=>{if(Object.keys(LIB.songs).length<2)return alert("Keep at least one song.");if(!confirm(`Delete "${S.name}"? Export it first if you want a copy.`))return;delete LIB.songs[LIB.current];LIB.current=Object.keys(LIB.songs)[0];S=hydrate(LIB.songs[LIB.current]);S.set={...START.set,...(S.set||{})};render()};
$("seed").oninput=e=>{S.seed=e.target.value;save()};$("notes").oninput=e=>{S.notes=e.target.value;save()};
$("newTag").append(...TAGS.map(t=>new Option(t,t)));$("addSec").onclick=()=>{S.secs.push({id:uid++,tag:$("newTag").value,lines:[mk("")]});render()};
$("copySuno").onclick=()=>{navigator.clipboard.writeText(suno());status("Copied lyrics for Suno.")};$("copyStyle").onclick=()=>navigator.clipboard.writeText(S.style);
$("style").oninput=e=>{S.style=e.target.value;save()};$("styleIn").onchange=e=>{S.styleIn=e.target.checked;render()};
["wD","wS"].forEach(k=>$(k).oninput=e=>{S.set[k]=+e.target.value;$(k+"v").textContent=e.target.value;save()});
$("genModel").onchange=e=>{S.set.gen=e.target.value.trim();save()};$("judgeModel").onchange=e=>{S.set.judge=e.target.value.trim();save()};
$("pinSel").onchange=e=>{if(e.target.value&&!S.set.pins.includes(e.target.value))S.set.pins.push(e.target.value);render()};
$("muteIn").onkeydown=e=>{if(e.key==="Enter"&&e.target.value.trim()){S.set.mutes.push(e.target.value.trim());e.target.value="";render()}};
$("export").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(plain(),null,1)],{type:"application/json"}));a.download=(S.name||"song").replace(/\W+/g,"_")+".json";a.click()};
$("imp").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());const id="s"+Date.now();LIB.songs[id]={...START,...j,name:j.name||f.name.replace(/\.json$/,"")};switchTo(id)}catch(x){alert("Bad file")}};
$("reset").onclick=()=>{const base=S.name===(LIFE_START||{}).name?LIFE_START:START;if(confirm("Replace this song with its starter draft?")){S=hydrate(base);render()}};
const ks=()=>$("keyState").textContent=localStorage.getItem("fg_key")?"key saved in this browser":"no key";
$("saveKey").onclick=()=>{const v=$("key").value.trim();if(v){localStorage.setItem("fg_key",v);$("key").value="";ks()}};$("clearKey").onclick=()=>{localStorage.removeItem("fg_key");ks()};
ks();render();
