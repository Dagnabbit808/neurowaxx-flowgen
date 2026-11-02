// ---------- Line-by-line writer (no-key local generator + optional LLM, both through the flowgen judgement filter)
(function(){
const W$=id=>document.getElementById(id);
const BOB_STYLE="Bob's own style: deadpan British voice; high-low luxury absurdity (caviar on a Pop-Tart); Gen X tech and pop details; food and cooking metaphors for making music; dry punchline twists; internal multisyllable rhymes inside long run-on bars. Persona for this track: extremely cocky, north London cockney.";
const CLICHE_RX=[/stack(ing)? (paper|cheese|bread)/,/living (lavish|large)/,/top of the game/,/flow (is|so) (sick|fire|cold)/,/\bi'?m the (best|greatest)\b/,/rags to riches/,/dime ?bag/,/white stuff/,/bread (from|in) the oven/,/\bget(ting)? (money|paid)\b/,/haters/,/\bon my grind\b/,/sky'?s the limit/,/started from the bottom/,/\bballin'?\b/];
// rhyme engine (CMU rhyming parts for ~10k words shipped in rhymedict.js; spelling fallback)
const RDx=window.RD||{};
const ew=l=>{const w=(l.toLowerCase().match(/[a-z']+/g)||[]);return w.length?w[w.length-1].replace(/^'+|'+$/g,""):""};
const spell=w=>{const m=w.replace(/'/g,"").match(/[aeiouy]+[^aeiouy]*$/);return m?"~"+m[0].replace(/^y/,"i"):"~"+w};
const rk=w=>RDx[w]||RDx[w.replace(/in'$/,"ing")]||spell(w);
const vow=k=>k.startsWith("~")?[k.slice(1).match(/[aeiouy]+/)?.[0]||k]:(k.match(/[A-Z]{2}(?=\d)/g)||[]);
function rhymeOk(a,b){if(!a||!b)return null;if(a===b)return"identical";const ka=rk(a),kb=rk(b);if(ka===kb)return"perfect";
 if(ka.startsWith("~")||kb.startsWith("~")){if(a.slice(-2)===b.slice(-2))return"ok?";const va=vow(ka),vb=vow(kb);return va[0]&&va[0]===vb[0]&&a.slice(-1)===b.slice(-1)?"slant":null}
 const va=vow(ka),vb=vow(kb);if(va[0]&&va[0]===vb[0])return(va.length>1&&va.join()===vb.join())?"multi-slant":"slant";return null}
const vw=w=>{const k=rk(w);return vow(k)[0]||""};
// ---------- local generator banks (written for Bob's style; node vocabulary slots in via {G})
const OPEN=[
"My girlie booked the shrink while I was slow-roasting a beat in the oven","Laid on the leather couch in a full-length mink","Doc held up a Rorschach blot, I said it's a soufflé that never rose","Fifty minutes on the clock at two hundred quid an hour","Clipboard says delusions of grandeur, I had it framed","Told the therapist my childhood was a Speak & Spell on a loop","He asked about my mother, I asked about his thread count","Prescribed me something calming, I prescribed the man a crescendo","Freud in the corner stroking his beard like he's tuning a sitar","They call it crazy when I season the snare with smoked paprika","Diagnosed with genius, the insurance wouldn't cover it","Caviar on a Pop-Tart while the analyst takes notes","Sipping Krug from a Capri Sun pouch in the waiting room","Shaved white truffle on a Lunchable in the lobby","Folded the hi-hats into the batter like a pastry chef","Chopped the break on a marble slab with a Japanese knife","Simmer the sample till the bassline reduces to a glaze","Brought my {G} to the session and let it do the talking","Hid a {G} in the waiting-room plant","Explained my whole psyche with a {G}","Inkblot looked like a {G}, so the doc upped the dosage","I just keep going, nobody's pulled the handbrake","Too cocky for the couch, I'm lounging on the radiator","North London manners, I wipe my feet on the DSM","Ratched in the corridor tutting at my trainers","Straitjacket tailored on Savile Row, double-breasted","Padded cell with a velvet rope and a cloakroom ticket","Mensa sent a letter, I used it as a coaster","Sectioned on a Tuesday, back by Wednesday brunch","Lava lamp bubbling like a stockpot on the hob","Every session ends with me sending him an invoice","Shrink's taking notes, I'm taking his biscuits","Tamagotchi died in rehab, I still blame the nurse","He asked me how I feel, I said medium rare","Mad as a Hatter, pouring Earl Grey on the sampler","Ego the size of a Wimpy with extra onions","Sneaked a Walkman in the session, one ear in the beat"];
const CLOSE=[
"so I tipped him with a vinyl and a Twix","and he billed me for the coat I left on the hook","while I plate the hook up in a bone-china dish","like a soufflé that survives the slam of the door","but the doc needed a lie-down on the floor","so I signed the prescription with a Mont Blanc pen","and charged him for the sample at a tenner again","while the kettle whistled the hook in E-flat minor","and he called it a breakdown, I called it a diner","so I flambéed the verse in a cognac reduction","like a Speak & Spell spelling out mass destruction","and his pen ran dry trying to keep up with the pace","while I microwave the snare in a Ming-dynasty vase","so he wrote down 'unhinged', I underlined 'genius'","while the bassline marinates under the cling film","and the meter on the session went off like a cab","then I smeared the beluga on a Findus Crispy Pancake","so I left through the window in a borrowed jalopy","and the nurse at the desk whispered someone stop me","while the Etch A Sketch shook and the evidence went","so I paid for the hour with a Blockbuster card","but the clipboard's a set list and I'm headlining hard","and he asked me to lie down, I lay down a track","like a Rubik's Cube solved with my hands behind my back","while the lava lamp drips like a fondue pot","so I reheat the hook till it's dangerously hot","and the Rolex on the wrist is a cuckoo clock","while I butter the crumpet with a bar of the stock","so the doctor recommended I take up a hobby","then I opened a gallery in the hospital lobby","but the sofa's Italian and the label says Fendi","and the Prozac is plated like a Michelin bento","so I sprinkled the sesame and called it a crescendo","while the Tamagotchi begs for a fresh bit of feeding","and the meter keeps running while the genius is bleeding","then I signed the straitjacket like a Number 10 shirt","and I served him the breakdown with a dollop of dessert","so he upped the medication and lowered his fee","while I'm baking a banger at a hundred and three","and the shrink needed a shrink by the end of the week","while I'm whipping the meringue on a Commodore 64","so I sectioned the beat in a sixteen-bar suite","and I'm sipping Moët out a sippy cup, neat","like a Pop-Tart with caviar, perfectly mental","while the receptionist rings me a cab in a rental","so I pay in Monopoly money and Pez","and he scribbles 'narcissist', I say cheers, mate, yes","then I walk out humming the hook he just heard","and the diagnosis rhymes, so I added a third","while I'm stirring the risotto with a broken mic stand","then I tip the nurse a Wotsit and shake the doctor's hand","so I folded the chorus like a crêpe Suzette","and he asked if I'm sane, I said not quite yet","while the ink on the blot spells my name in Gothic","and the madness is method, the method's exotic","then I left him a tip in a jar of Branston","like a toff on a fry-up at a manor in Wanstead"];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function gvocab(){const out=[];const T=S.set.types;
 for(const t of ["genx","shr"])if(T.includes(t))for(const [k] of (D[t]||[]))if(!muted(k)&&k.split(" ").length<=4)out.push(k);
 for(const p of S.set.pins)out.push(p);return out.length?out:["Walkman"]}
function fill(t,G){return t.replace("{G}",()=>pick(G))}
function themeWords(){return new Set(words((S.name||"")+" "+(S.notes||"")+" "+(S.seed||"")).filter(w=>w.length>3))}
// mechanical filter (ported from flowgen.py: mute + corpus 5-gram, filler ending, rhyme_check with identical rejection, CLICHE)
function mech(text,prev){const f=[];if(muted(text))f.push("muted word");const o=overlap(text);if(o)f.push("copies corpus 5-gram: \""+o+"\"");
 if(fillerEnd(text))f.push("filler ending");const low=text.toLowerCase();for(const r of CLICHE_RX)if(r.test(low)){f.push("cliché: "+low.match(r)[0]);break}
 let rh=null;if(prev){const a=ew(prev),b=ew(text);rh=rhymeOk(a,b);if(rh==="identical")f.push("identical rhyme ("+b+")");else if(!rh&&needRhyme())f.push(`no rhyme: ${a}/${b}`)}
 if(V().some(l=>l.toLowerCase()===low))f.push("repeats an earlier line");const h5=w=>words(w).slice(0,5).join(" "),t5=w=>words(w).slice(-5).join(" ");if(V().some(l=>h5(l)===h5(text)||t5(l)===t5(text)))f.push("reuses an earlier half-bar");return{flags:f,rh}}
let needR=true;const needRhyme=()=>needR;
// heuristic score (no-key judge): ref/rhyme/worth/specificity on 1-5 like judge_prompt2
function heur(text,rh,G){const w=words(text),sy=syl(text),tw=themeWords();
 const refs=G.filter(g=>text.toLowerCase().includes(g.toLowerCase())).length+(text.match(/\b[A-Z][a-z]+[A-Z]?[a-z]*/g)||[]).slice(1).length*.5;
 const rhyme={perfect:5,"multi-slant":5,slant:4,"ok?":3}[rh]||(needR?1:4);
 const vs=w.filter(x=>x.length>3).map(vw).filter(Boolean),cnt={};vs.forEach(v=>cnt[v]=(cnt[v]||0)+1);const internal=Math.max(0,...Object.values(cnt));
 const food=/(caviar|truffle|souffl|oven|simmer|season|batter|glaze|plate|flamb|marinat|risotto|crumpet|fondue|bento|meringue|crêpe|reheat|beluga|pancake|dessert|chef|kettle|twix|wotsit|pop-tart|lunchable)/i.test(text);
 const theme=w.filter(x=>tw.has(x)).length+(/(shrink|doc|couch|session|therap|diagnos|nurse|clipboard|prescri|sectioned|straitjacket|rorschach|inkblot|genius|mental|sane)/i.test(text)?1:0);
 const ref=Math.min(5,2+Math.round(refs)+(food?1:0));const worth=Math.min(5,2+(food?1:0)+(theme?1:0)+(/\b(so|but|then)\b/.test(text)?1:0));
 const spec=Math.min(5,1+Math.min(2,Math.floor(internal/2))+(sy>=12&&sy<=24?1:0)+(refs>=1?1:0));
 const tags=[food&&"cooking metaphor",theme&&"on theme",internal>=3&&"internal rhyme",refs>=1&&"reference"].filter(Boolean);
 return{ref,rhyme,worth,specificity:spec,cliche:false,tags,rationale:`${sy} syllables, end rhyme ${rh||"free"}, ${internal} words on the same stressed vowel`}}
const passJ=j=>j&&!j.cliche&&["ref","rhyme","worth","specificity"].every(k=>(j[k]||0)>=4);
const avg=j=>["ref","rhyme","worth","specificity"].reduce((n,k)=>n+(j[k]||0),0)/4;
function localCands(prev,n){const G=gvocab(),out=[],seen=new Set();const pe=ew(prev||"");
 const closers=CLOSE.filter(c=>!pe||(rhymeOk(pe,ew(c))&&rhymeOk(pe,ew(c))!=="identical"));
 const pool=needR&&pe&&closers.length?closers:CLOSE;
 for(let t=0;t<400&&out.length<n;t++){const txt=fill(pick(OPEN),G)+", "+fill(pick(pool),G);if(seen.has(txt))continue;seen.add(txt);out.push(txt)}return out}
// ---------- state
const key=()=>"fg_writer_"+(S.name||"song");
let WS;function load(){try{WS=JSON.parse(localStorage.getItem(key()))}catch(e){WS=null}if(!WS||!Array.isArray(WS.verse))WS={verse:[],out:"",hist:[],input:""};if(!WS.verse.length&&!WS.init&&S.name==="Shrink"){WS.input=(window.SHRINK_SEEDS||[])[0]||"";WS.init=1}}
const V=()=>WS.verse;const wsave=()=>localStorage.setItem(key(),JSON.stringify(WS));
const ctxPrev=()=>{const v=V();needR=!(v.length>=2&&rhymeOk(ew(v[v.length-2]),ew(v[v.length-1]))&&v.length%2===0);return v[v.length-1]||""};
// ---------- LLM path (key stays in localStorage; same Gemini call as the rest of the site)
function genPrompt(prev,n){const A=assignments(6);return `You write ORIGINAL rap bars for Bob (Neurowaxx), inside his song.\n${style()}\n${BOB_STYLE}\nSong: "${S.name}". Theme: ${S.notes||S.seed||""}\nWrite ${n} different candidates for ONE next bar (a single long run-on line) that ${needR?`rhymes with the end of "${prev}" (multisyllabic if possible, never the same end word)`:"starts a fresh rhyme sound"}, continues its image or joke with a callback or escalation, and carries internal rhymes.\nUse one of these references with its REAL meaning (gloss after the dash) inside a concrete image, not a name-drop:\n${A.map((a,i)=>`${i+1}. ${a.anchor} | ${a.artist_node}`).join("\n")}\n${rules()}\nVerse so far:\n${V().join("\n")||"(empty)"}\nReturn only JSON [{"text":"..."}].`}
function judge2Prompt(C){return judgePrompt(C,"Second opinion: be stricter than the first editor about specificity and whether the punchline twist actually lands.")}
async function llmRound(prev){let C=await gemini(S.set.gen,genPrompt(prev,8),.95);C=C.map((c,i)=>({id:i,text:String(c.text||"").split("\n")[0].trim()})).filter(c=>c.text);
 for(const c of C){const m=mech(c.text,prev);c.flags=m.flags;c.rh=m.rh}
 const ok=C.filter(c=>!c.flags.length);wstat(`Judging ${ok.length} (${C.length-ok.length} failed mechanical checks)…`);
 if(ok.length){const ctx=`Request: next bar after "${prev}". ${BOB_STYLE}`;const [J1,J2]=await Promise.all([gemini(S.set.judge,judgePrompt(ok,ctx),0),gemini(S.set.judge2||"gemini-2.5-flash",judge2Prompt(ok),.2)]);
  const m1={},m2={};J1.forEach(j=>m1[j.id]=j);J2.forEach(j=>m2[j.id]=j);
  for(const c of ok){const a=m1[c.id],b=m2[c.id];c.j=a||{};c.j2=b||{};if(!passJ(a))c.flags.push("judge 1: "+(a?fails(a):"no verdict")+(a?.rationale?" — "+a.rationale:""));else if(!passJ(b))c.flags.push("judge 2: "+(b?fails(b):"no verdict")+(b?.rationale?" — "+b.rationale:""))
   c.score=a&&b?(avg(a)+avg(b))/2:a?avg(a):0}}
 for(const c of C)if(c.score==null)c.score=0;return C}
const fails=j=>[...["ref","rhyme","worth","specificity"].filter(k=>(j[k]||0)<4).map(k=>`${k} ${j[k]??"-"}`),j.cliche?"cliché":""].filter(Boolean).join(", ");
function localRound(prev){const G=gvocab();const C=localCands(prev,40).map((t,i)=>({id:i,text:t}));
 for(const c of C){const m=mech(c.text,prev);c.flags=m.flags;c.rh=m.rh;c.j=heur(c.text,c.rh,G);c.score=avg(c.j)-(c.flags.length?3:0)-Math.max(0,syl(c.text)-26)*.15+Math.random()*.3;if(!c.flags.length&&!passJ(c.j))c.flags.push("heuristic below 4: "+fails(c.j))}return C}
async function generate(){const inp=W$("wIn").value.trim();if(inp&&inp!==V()[V().length-1]){V().push(inp);WS.hist.push({op:"add"})}W$("wIn").value="";WS.input="";
 const prev=ctxPrev();if(!prev){wstat("Type a word or phrase first.");return render2()}const useLLM=!!localStorage.getItem("fg_key")&&W$("wMode").value!=="local";
 W$("wGo").disabled=true;let C=[],tries=0;
 try{while(tries<2){tries++;wstat(useLLM?`Writing 8 candidates with ${S.set.gen} (try ${tries})…`:"Generating locally from the node graph…");
   const R=useLLM?await llmRound(prev):localRound(prev);C=C.concat(R);if(R.some(c=>!c.flags.length))break}
 }catch(e){wstat("⚠ "+e.message+(C.length?"":" — falling back to local generator"));if(!C.length)C=localRound(prev)}
 W$("wGo").disabled=false;const kf=c=>(c.flags.length?0:100)+c.score-c.flags.length;C.sort((a,b)=>kf(b)-kf(a));const best=C[0];
 WS.out=best?best.text:"";WS.last={mode:useLLM?"LLM":"local",best,rej:C.filter(c=>c!==best).slice(0,useLLM?16:10),pass:best&&!best.flags.length,n:C.length,tries};wsave();render2()}
function accept(){const t=W$("wOut").value.trim();if(!t)return;V().push(t);WS.hist.push({op:"add"});WS.out="";WS.last=null;wsave();render2()}
function undo(){if(V().length){WS.hist.push({op:"undo",text:V().pop()});wsave();render2()}}
function render2(){const host=W$("writer");if(!host)return;W$("wIn").value=WS.input||W$("wIn").value;W$("wOut").value=WS.out||"";
 const vb=W$("wVerse");vb.innerHTML="";V().forEach((l,i)=>{const r=document.createElement("div");r.className="ln";const n=document.createElement("span");n.className="num";n.textContent=`${i+1} · ${syl(l)}`;
  const inp=document.createElement("input");inp.type="text";inp.value=l;inp.oninput=()=>{V()[i]=inp.value;wsave()};
  r.append(n,inp,btn("✕",()=>{V().splice(i,1);wsave();render2()}));vb.appendChild(r)});
 const L=WS.last,info=W$("wInfo");info.innerHTML="";if(L&&L.best){const j=L.best.j||{};
  info.innerHTML=`${L.pass?'<span class="good">PASSED</span>':'<span class="bad">BELOW THE BAR (closest candidate after '+L.tries+' tries)</span>'} · ${L.mode} · ref ${j.ref??"-"} rhyme ${j.rhyme??"-"} worth ${j.worth??"-"} spec ${j.specificity??"-"}${L.best.j2&&L.best.j2.ref?` · judge 2 avg ${avg(L.best.j2).toFixed(1)}`:""} · ${esc((j.tags||[]).join(", "))}<br>${esc(j.rationale||"")}${L.best.flags.length?'<br><span class="bad">'+esc(L.best.flags.join("; "))+"</span>":""}
  <details><summary>Rejected / other candidates (${L.rej.length} of ${L.n})</summary>${L.rej.map(c=>`<div class="cand fail"><div>${esc(c.text)}</div><div class="dim">${c.flags.length?'<span class="bad">'+esc(c.flags.join("; "))+"</span>":"passed (lower score "+c.score.toFixed(2)+")"}</div></div>`).join("")}</details>`}
 const s=W$("wSeeds");s.innerHTML="";if(S.name==="Shrink")(window.SHRINK_SEEDS||[]).forEach(t=>s.appendChild(btn("+ "+t,()=>{V().push(t);WS.hist.push({op:"add"});wsave();render2()})))}
function wstat(t){W$("wStatus").textContent=t}
function exportTxt(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([V().join("\n")+"\n"],{type:"text/plain"}));a.download=(S.name||"verse").replace(/\W+/g,"_")+"_verse.txt";a.click()}
function init(){W$("wGo").onclick=generate;W$("wRegen").onclick=()=>{WS.out="";generate()};W$("wAccept").onclick=accept;W$("wAcceptGo").onclick=()=>{accept();generate()};W$("wUndo").onclick=undo;
 W$("wCopy").onclick=()=>{navigator.clipboard.writeText(V().join("\n"));wstat("Verse copied.")};W$("wExport").onclick=exportTxt;
 W$("wToSong").onclick=()=>{if(!V().length)return;S.secs.push({id:uid++,tag:"Verse 1",lines:V().map(mk)});render();wstat("Added verse to the song below.")};
 W$("wClear").onclick=()=>{if(confirm("Clear the running verse?")){WS.verse=[];WS.out="";WS.last=null;wsave();render2()}};
 W$("wIn").oninput=e=>{WS.input=e.target.value;wsave()};W$("wOut").oninput=e=>{WS.out=e.target.value;wsave()};
 W$("wIn").onkeydown=e=>{if(e.key==="Enter")generate()};
 const ms=()=>{W$("wMode").options[0].text=localStorage.getItem("fg_key")?"Auto (LLM, key saved)":"Auto (no key: local)"};ms();W$("saveKey").addEventListener("click",ms);W$("clearKey").addEventListener("click",ms);
 const sw=W$("songSel");sw.addEventListener("change",()=>{load();render2()});load();render2()}
window.FW={rhymeOk,localRound,mech,heur,ctx:()=>WS,generate,load};
init();
})();
