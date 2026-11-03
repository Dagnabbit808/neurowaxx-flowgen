// AUTO-EXTRACTED from app.js/writer.js by build_classic_core.sh — same filter code as the flow generator
(function(){const D=window.FG;const S={set:{mutes:["Doom","Villain","mask","metal face","Polaroid","Pop-Tart","Blockbuster","Swatch","Members Only","mixtape"],gen:"gemini-pro-latest",judge:"gemini-pro-latest",judge2:"gemini-2.5-flash"}};const status=t=>window.cnStatus&&window.cnStatus(t);
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
const CLAUDE_MODEL="claude-sonnet-5-5";
function provider(){const p=localStorage.getItem("fg_provider"),c=!!localStorage.getItem("fg_ckey"),g=!!localStorage.getItem("fg_key");if(p==="gemini"||p==="claude")return p;return c?"claude":g?"gemini":"claude"}
window.provider=provider;window.hasLLMKey=()=>!!localStorage.getItem(provider()==="claude"?"fg_ckey":"fg_key");
function parseJ(t){const m=t.match(/\[[\s\S]*\]/);try{return JSON.parse(m?m[0]:t)}catch(e){throw new Error("Model returned non-JSON: "+t.slice(0,150))}}
// all generation + both judges + ranking go through here; routes to the selected provider
async function gemini(model,prompt,temp){return provider()==="claude"?claude(prompt,temp):geminiCall(model,prompt,temp)}
async function claude(prompt,temp){const key=localStorage.getItem("fg_ckey");if(!key)throw new Error("Add your Claude key first (top right).");
 for(let a=0;a<5;a++){let r;try{r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:S.set.claudeModel||CLAUDE_MODEL,max_tokens:8000,messages:[{role:"user",content:prompt+"\n\nRespond with ONLY the JSON array, no prose, no code fences."}]})})}catch(e){throw new Error("Claude: network/CORS error, request blocked before reaching Anthropic ("+e.message+")")}
  if(r.status===429||r.status===529||r.status>=500){status(`Claude busy/rate limited (${r.status}), retrying…`);await new Promise(z=>setTimeout(z,4000*2**a));continue}
  if(r.status===401)throw new Error("Claude 401: bad or revoked API key. Paste a valid key (top right).");
  if(r.status===403)throw new Error("Claude 403: key lacks permission or billing/credits issue.");
  if(!r.ok)throw new Error(`Claude ${r.status}: ${(await r.text()).slice(0,200)}`);
  const j=await r.json();return parseJ((j.content||[]).filter(b=>b.type==="text").map(b=>b.text).join(""))}
 throw new Error("Claude rate limit: try again in a minute.")}
async function geminiCall(model,prompt,temp){const key=localStorage.getItem("fg_key");if(!key)throw new Error("Add your Gemini key first (top right).");
 for(let a=0;a<5;a++){const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:temp,responseMimeType:"application/json"}})});
  if(r.status===429||r.status>=500){status(`Rate limited (${r.status}), retrying…`);await new Promise(z=>setTimeout(z,4000*2**a));continue}
  if(!r.ok)throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0,200)}`);
  const j=await r.json();const t=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("");const m=t.match(/\[[\s\S]*\]/);return JSON.parse(m?m[0]:t)}
 throw new Error("Rate limit: try again in a minute or switch to gemini-2.5-flash")}
const style=()=>`Style mix: MF DOOM ${S.set.wD}% (dense multisyllabic/internal rhyme, absurd food/comic imagery, deadpan humour, run-on lines) / Sonnyjim ${S.set.wS}% (slow, unbothered, luxury next to lowlife, brands, fine food, Brum, dry wit).`;
const rules=()=>`Quality bar (original exemplars; match the specificity and twist, do not copy):\n${D.exemplars}\nAVOID ${D.cliche}. Every line must END on a meaningful word, never filler like "see?", "yo", "ya know". Never quote or paraphrase real lyrics by any artist. NEVER use these words or variants: ${S.set.mutes.join(", ")||"none"}.`;
function judgePrompt(C,ctx){return `You are a harsh editor of rap bars. ${ctx}\nScore each candidate 1-5:\n ref: references real and used with correct meaning in a coherent image (not mere name-drops);\n rhyme: rhymes land and every rhyme word carries meaning (fail filler endings like see?/yo);\n worth: humorous, insightful, vivid_imagery, double_entendre, surprising_juxtaposition or witty_braggadocio (tag all that apply);\n fit: continuity with the song and the request;\n specificity: concrete, surprising, would a fan quote it?\n cliche: true if it relies on ${D.cliche}.\npass = every score >= 4 and cliche false.\nCalibration (score 5): ${D.exemplars.replace(/\n/g," || ")}\nReturn only JSON [{"id":n,"ref":n,"rhyme":n,"worth":n,"fit":n,"specificity":n,"cliche":bool,"tags":[],"pass":bool,"rationale":"one line"}]\nCandidates:\n${JSON.stringify(C.map(c=>({id:c.id,text:c.text})))}`}
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
const PCL={N:"n",M:"n",NG:"n",P:"s",B:"s",T:"s",D:"s",K:"s",G:"s",F:"f",V:"f",TH:"f",DH:"f",S:"f",Z:"f",SH:"f",ZH:"f",CH:"a",JH:"a",L:"l",R:"r",ER:"r",W:"w",Y:"w",HH:"h"};
const tailCls=k=>{const m=k.match(/\d([A-Z]*)$/);return (m?m[1].match(/NG|SH|ZH|TH|DH|CH|JH|HH|ER|[A-Z]/g)||[]:[]).map(p=>PCL[p]||p).join("")};
function strictRhyme(a,b){const r=rhymeOk(a,b);if(r==="perfect")return r;if(r!=="slant"&&r!=="multi-slant")return null;const ka=rk(a),kb=rk(b);if(ka.startsWith("~")||kb.startsWith("~"))return null;
 return tailCls(ka)===tailCls(kb)?r:null}
const passJ=j=>j&&!j.cliche&&["ref","rhyme","worth","specificity"].every(k=>(j[k]||0)>=4);
const avg=j=>["ref","rhyme","worth","specificity"].reduce((n,k)=>n+(j[k]||0),0)/4;
const fails=j=>[...["ref","rhyme","worth","specificity"].filter(k=>(j[k]||0)<4).map(k=>`${k} ${j[k]??"-"}`),j.cliche?"cliché":""].filter(Boolean).join(", ");
window.CORE={words,stem,muted,overlap,fillerEnd,syl,provider,gemini,judgePrompt,rules,CLICHE_RX,ew,rhymeOk,strictRhyme,passJ,avg,fails,S,D};})();
