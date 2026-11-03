// Classic phrase -> topic node match -> next line (same judgement filter as the flow generator)
(function(){
const C=window.CORE,F=window.FG,NG=window.NG,RD=window.RD||{},$=id=>document.getElementById(id);
const BAN=/\b(polaroid|pop-?tarts?|blockbuster|swatch|members only|mix-?tapes?|doom|masks?|metal ?face|metal fingers)\b/i;
const STOP=new Set("a an the and or but of to in on at by for with is are was be been it its his her your my our their he she you we they them this that than as from no not nor never all every one who what when where how if so do does don't doesn't can't won't there here up out off over into until till like make makes made get gets got take takes have has had will would let lets keep before after".split(" "));
const SYN={Money:"cash wealth rich broke bread paper dollar coin bank luxury hustling price",Time:"clock watch hour late past future age wait decade",Love:"romance heart girl woman lover kiss relationship sex",Death:"dead die grave coffin mortality casket funeral ghost",Luck:"chance gamble dice casino fortune lottery",Work:"job hustle grind labor boss craft skill",Family:"mother father mum dad brother son kid family",Food:"eat cook kitchen meal dish chef hungry food",Weather:"rain storm cloud sun snow cold wind",Animals:"animal beast creature zoo",Fire:"flame burn smoke heat ash",Water:"rain river drown wet drink",War:"battle fight weapon soldier gun combat violence",["Truth & Lies"]:"truth lie liar fake real authenticity deception perception",Fools:"fool idiot clown joke stupid",Pride:"ego arrogance boast dominance braggadocio",Patience:"wait slow calm",Fortune:"fate destiny prophecy wealth luck",Home:"house home street neighborhood",Travel:"trip road journey plane car fly",Sleep:"dream bed night tired",Eyes:"eye see look vision watch",Hands:"hand grip touch finger",Heart:"heart emotion love feel",Blood:"blood violence family wound",Devil:"devil hell demon sin evil",Heaven:"heaven god angel spirit spirituality",Night:"night dark moon late",Gold:"gold chain jewelry rich wealth diamond",Sea:"ocean ship boat fish sea",Road:"street road car drive",Horse:"horse race ride",Dog:"dog pup bark",Cat:"cat",Bird:"bird fly wing pigeon",House:"house home room door",King:"king crown throne royal dominance",Crime:"crime police law prison jail robbery street drugs",Music:"music beat song rap record hip-hop mic",Words:"word talk speak rhyme wordplay lyric",Silence:"quiet silent hush",["Age & Youth"]:"old young child age youth",Beauty:"beauty pretty fashion looks",Fear:"fear scared paranoia horror",Courage:"brave courage nerve",Trouble:"trouble problem danger",Change:"change transformation new",Secrets:"secret hidden mystery",Friendship:"friend loyalty crew",Revenge:"revenge payback destruction opponents"};
const st=w=>C.stem(w.toLowerCase());
const toks=s=>C.words(s||"").filter(w=>w.length>2&&!STOP.has(w)).map(st);
const NBOK=j=>NG.ok[j]&&F.nodes[j][0]!=="tec"&&!BAN.test(F.nodes[j][1]);NG.nb=NG.nb.map(a=>a.filter(NBOK));const IDX=[];F.nodes.forEach((n,i)=>{if(!NG.ok[i]||BAN.test(n[1])||BAN.test(n[4]||"")||!["sub","ima","obj","pop","dou"].includes(n[0]))return;IDX.push({i,t:n[0],label:n[1],gloss:n[4]||"",lt:new Set(toks(n[1])),gt:new Set(toks(n[4])),pop:n[2]+n[3]})});
const TN={sub:"topic",ima:"imagery",obj:"object",pop:"ref",dou:"double meaning"};
function match(phrase,topic){const q={};for(const w of toks(phrase))q[w]=3;for(const w of toks(topic+" "+(SYN[topic]||"")))q[w]=Math.max(q[w]||0,2);
 const sc=new Map();
 for(const x of IDX){let s=0;for(const w in q){if(x.lt.has(w))s+=q[w]*2;else if(x.gt.has(w))s+=q[w]*.5}
  if(!s)continue;s=s/Math.sqrt(Math.max(1,x.lt.size))*(x.t==="sub"?1.6:x.t==="ima"?1.2:1)+Math.log1p(x.pop)*.15;sc.set(x.i,s)}
 // spread: neighbours of strong topic nodes get a share (imagery tied to the theme)
 const top=[...sc].sort((a,b)=>b[1]-a[1]).slice(0,10);
 for(const [i,s] of top)for(const j of NG.nb[i].slice(0,12)){const x=IDX.find(y=>y.i===j);if(x&&(x.t==="ima"||x.t==="sub"))sc.set(j,(sc.get(j)||0)+s*.15)}
 return [...sc].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([i,s])=>({i,s,label:F.nodes[i][1],t:F.nodes[i][0],gloss:F.nodes[i][4]||""}))}
window.cnMatch=match;
// state
const K="cn_state";let ST;try{ST=JSON.parse(localStorage.getItem(K))}catch(e){}ST=ST||{verse:[],node:null,out:""};const save=()=>localStorage.setItem(K,JSON.stringify(ST));
let RECENT=[];try{RECENT=JSON.parse(localStorage.getItem("cn_recent"))||[]}catch(e){}
function sampleNeighbors(i,k){const rs=new Set(RECENT);let p=NG.nb[i].filter(j=>NG.ok[j]&&!BAN.test(F.nodes[j][1]));let c=p.filter(j=>!rs.has(j));if(c.length<k)c=p;
 const out=[];const pool=c.map(j=>({j,w:Math.sqrt(1+F.nodes[j][2]+F.nodes[j][3])}));
 while(out.length<k&&pool.length){let r=Math.random()*pool.reduce((a,b)=>a+b.w,0),z=0;for(;z<pool.length-1;z++){r-=pool[z].w;if(r<=0)break}out.push(pool.splice(z,1)[0].j)}
 RECENT=[...RECENT,...out].slice(-60);localStorage.setItem("cn_recent",JSON.stringify(RECENT));return out}
const stat=t=>$("cnSt").textContent=t;window.cnStatus=stat;
const rhymesFor=w=>{const k=RD[w]||RD[w.replace(/s$/,"")];if(!k)return[];return Object.keys(RD).filter(x=>x!==w&&(RD[x]===k)).sort(()=>Math.random()-.5).slice(0,25)};
const rh=(a,b)=>C.strictRhyme(a,b)||C.strictRhyme(a.replace(/s$/,""),b.replace(/s$/,""))||(C.rhymeOk(a,b)==="perfect"?"perfect":null);
let CHIPS=[];
function renderChips(){$("cnChips").innerHTML=CHIPS.map(c=>`<button class="chip nchip${ST.node===c.i?" on":""}" data-i="${c.i}" title="${esc(c.gloss)}">${esc(c.label)} <span class="dim">· ${TN[c.t]||c.t}</span></button>`).join("")||'<span class="dim">No node matches — search below.</span>';
 document.querySelectorAll(".nchip").forEach(b=>b.onclick=()=>{ST.node=+b.dataset.i;save();renderChips();showNode()})}
function showNode(){const i=ST.node;if(i==null){$("cnNode").textContent="";return}const n=F.nodes[i];$("cnNode").innerHTML=`<b>${esc(n[1])}</b> <span class="dim">(${TN[n[0]]||n[0]}) ${esc((n[4]||"").slice(0,140))}</span><div class="dim" style="margin-top:4px">Linked: ${NG.nb[i].slice(0,8).map(j=>esc(F.nodes[j][1])).join(" · ")}</div>`}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
window.cnOnPhrase=(p,topic)=>{ST.verse=[p];ST.topic=topic;ST.out="";CHIPS=match(p,topic);ST.node=CHIPS[0]?CHIPS[0].i:null;save();renderChips();showNode();renderVerse();$("cnRes").innerHTML="";$("cnBox").style.display=""};
function renderVerse(){$("cnVerse").innerHTML=ST.verse.map((l,k)=>`<div class="vl"><span class="dim">${k+1}</span> ${esc(l)}</div>`).join("");$("cnOut").value=ST.out||""}
function search(){const q=$("cnQ").value.trim().toLowerCase();if(q.length<2){$("cnHits").innerHTML="";return}
 const h=IDX.filter(x=>x.label.toLowerCase().includes(q)).sort((a,b)=>b.pop-a.pop).slice(0,12);
 $("cnHits").innerHTML=h.map(x=>`<button class="chip hchip" data-i="${x.i}">${esc(x.label)} <span class="dim">· ${TN[x.t]}</span></button>`).join("")||'<span class="dim">none</span>';
 document.querySelectorAll(".hchip").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!CHIPS.some(c=>c.i===i))CHIPS.unshift({i,label:F.nodes[i][1],t:F.nodes[i][0],gloss:F.nodes[i][4]||""});ST.node=i;save();renderChips();showNode()})}
function mech(text,prev){const f=[];const low=text.toLowerCase();
 if(BAN.test(text)||C.muted(text))f.push("banned/muted word");const o=C.overlap(text);if(o)f.push(`copies corpus 5-gram: "${o}"`);
 if(C.fillerEnd(text))f.push("filler ending");for(const r of C.CLICHE_RX)if(r.test(low)){f.push("cliché: "+low.match(r)[0]);break}
 const a=C.ew(prev),b=C.ew(text);if(a===b)f.push(`identical end word (${b})`);else if(!rh(a,b))f.push(`doesn't rhyme: ${a} / ${b}`);
 const sy=C.syl(text);if(sy>24)f.push(`too long (${sy} syl)`);if(sy<6)f.push(`too short (${sy} syl)`);
 if(ST.verse.some(l=>l.toLowerCase()===low))f.push("repeats a line");return f}
async function next(){const ed=$("cnOut").value.trim();if(ed&&ed!==ST.verse[ST.verse.length-1]){ST.verse.push(ed);ST.out="";save();renderVerse()}
 if(!ST.verse.length){stat("Generate a phrase first.");return}
 const prov=C.provider(),key=localStorage.getItem(prov==="claude"?"fg_ckey":"fg_key");
 cnKeyUI();if(!key){$("cnRes").innerHTML=`<div class="bad">No API key in this browser. Open the <a href="index.html" style="color:inherit">Song Workspace</a>, pick Claude or Gemini (top right), paste your key and Save, then come back. I won't output unfiltered word salad.</div>`;stat("");return}
 if(ST.node==null){stat("Pick a node first.");return}
 const prev=ST.verse[ST.verse.length-1],end=C.ew(prev),n=F.nodes[ST.node],nb=sampleNeighbors(ST.node,6);
 const rl=rhymesFor(end);
 const prompt=`You write ORIGINAL rap bars for Bob (Neurowaxx): deadpan, extremely cocky north-London voice, dry punchline twists, internal rhymes. The verse grows out of the classic phrase "${ST.verse[0]}" (topic: ${ST.topic||"-"}).
Write 8 different candidates for ONE next bar (10-20 syllables) that:
- ENDS on a real word that PERFECTLY rhymes with "${end}" (never "${end}" itself, no filler endings)${rl.length?`. Valid end words include: ${rl.join(", ")}`:""};
- makes literal sense as the next sentence after: "${prev}" — continue or twist its meaning, clear subject and verb, one concrete image;
- is built around the theme node "${n[1]}" (${(n[4]||"").slice(0,120)}), and may use ONE of these linked nodes with its real meaning: ${nb.map(j=>`${F.nodes[j][1]}${F.nodes[j][4]?" — "+F.nodes[j][4].slice(0,70):""}`).join("; ")}.
Never mention: Polaroid, Pop-Tart, Blockbuster, Swatch, Members Only, mixtape, DOOM, masks, metal face, or Bob's career. Never quote real lyrics.
${C.rules()}
Verse so far:
${ST.verse.join("\n")}
Return only JSON [{"text":"..."}].`;
 $("cnNext").disabled=true;$("cnRes").innerHTML="";
 try{stat("Writing candidates…");let Cs=await C.gemini(C.S.set.gen,prompt,.95);Cs=Cs.map((c,i)=>({id:i,text:String(c.text||"").split("\n")[0].trim()})).filter(c=>c.text);
  for(const c of Cs)c.flags=mech(c.text,prev);const ok=Cs.filter(c=>!c.flags.length);stat(`Judging ${ok.length} (${Cs.length-ok.length} failed mechanical checks)…`);
  if(ok.length){const ctx=`Request: next bar after "${prev}", must perfectly rhyme with "${end}", make literal sense as a continuation, and use the theme "${n[1]}".`;
   const [J1,J2]=await Promise.all([C.gemini(C.S.set.judge,C.judgePrompt(ok,ctx),0),C.gemini(C.S.set.judge2,C.judgePrompt(ok,ctx+" Second opinion: be stricter about whether it makes sense and the twist lands."),.2)]);
   const m1={},m2={};(J1||[]).forEach(j=>m1[j.id]=j);(J2||[]).forEach(j=>m2[j.id]=j);
   for(const c of ok){const a=m1[c.id],b=m2[c.id];c.j=a;c.j2=b;if(!C.passJ(a))c.flags.push("judge 1: "+(a?C.fails(a):"no verdict")+(a&&a.rationale?" — "+a.rationale:""));else if(!C.passJ(b))c.flags.push("judge 2: "+(b?C.fails(b):"no verdict")+(b&&b.rationale?" — "+b.rationale:""));c.score=a&&b?(C.avg(a)+C.avg(b))/2:0}}
  const pass=Cs.filter(c=>!c.flags.length).sort((a,b)=>b.score-a.score),rej=Cs.filter(c=>c.flags.length);
  const sc=j=>j?`ref ${j.ref} · rhyme ${j.rhyme} · worth ${j.worth} · spec ${j.specificity}`:"";
  if(pass.length){ST.out=pass[0].text;save();renderVerse();stat(`Accepted 1 of ${Cs.length}. Edit it, then Next line again to chain.`)}else stat(`All ${Cs.length} rejected by the filter — hit Next line to retry or pick another node.`);
  $("cnRes").innerHTML=(pass.length?`<div class="cand"><div class="good">✓ ${esc(pass[0].text)}</div><div class="dim">J1: ${sc(pass[0].j)}<br>J2: ${sc(pass[0].j2)}<br>${esc(pass[0].j.rationale||"")}</div></div>`+pass.slice(1).map(c=>`<div class="cand"><span class="good">also passed:</span> <a href="#" class="alt" style="color:inherit">${esc(c.text)}</a> <span class="dim">(${c.score.toFixed(2)})</span></div>`).join(""):"")+
   `<details><summary class="dim">Rejected (${rej.length})</summary>${rej.map(c=>`<div class="cand fail">${esc(c.text)}<div class="bad" style="font-size:12px">${esc(c.flags.join("; "))}</div></div>`).join("")}</details>`;
  document.querySelectorAll(".alt").forEach(a=>a.onclick=e=>{e.preventDefault();$("cnOut").value=a.textContent;ST.out=a.textContent;save()});
 }catch(e){stat("Error: "+e.message)}finally{$("cnNext").disabled=false}}
function init(){$("cnNext").onclick=next;$("cnQ").oninput=search;$("cnOut").oninput=()=>{ST.out=$("cnOut").value;save()};
 $("cnUndo").onclick=()=>{if(ST.verse.length>1){ST.verse.pop();save();renderVerse()}};
 $("cnCopy").onclick=()=>{const t=[...ST.verse,...(ST.out?[ST.out]:[])].join("\n");navigator.clipboard.writeText(t).then(()=>stat("Verse copied"))};
window.cnKeyUI=()=>{const p=C.provider(),on=!!localStorage.getItem(p==="claude"?"fg_ckey":"fg_key");$("cnKey").textContent=on?"key active: "+(p==="claude"?"Claude":"Gemini"):"no key — add one in Song Workspace";$("cnKey").className=on?"good":"bad"};cnKeyUI();
 if(ST.verse.length){CHIPS=match(ST.verse[0],ST.topic||"");if(ST.node!=null&&!CHIPS.some(c=>c.i===ST.node))CHIPS.unshift({i:ST.node,label:F.nodes[ST.node][1],t:F.nodes[ST.node][0],gloss:""});renderChips();showNode();renderVerse();$("cnBox").style.display=""}}
init();})();
