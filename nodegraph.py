import json,re,collections
G=json.load(open('graph.json'))
AB={'pop_culture_ref':'pop','slang':'sla','double_entendre':'dou','subject':'sub','technique':'tec','imagery':'ima','object':'obj'}
ban=re.compile(r'polaroid|pop-?tart|blockbuster|swatch|members only|mix-?tape|\bdoom|\bmasks?\b|metal ?face|metal fingers|villainy & masks',re.I)
idx={};N=[]
for n in G['nodes']:
  if n['type'] in AB: idx[n['id']]=len(N);N.append(n)
nb=collections.defaultdict(collections.Counter);song=collections.defaultdict(list)
for e in G['edges']:
  s,t=e['source'],e['target']
  if e['type']=='co_occurs' and s in idx and t in idx: nb[idx[s]][idx[t]]+=3*e.get('weight',1);nb[idx[t]][idx[s]]+=3*e.get('weight',1)
  elif e['type']=='has_feature' and t in idx: song[s].append(idx[t])
for s,fs in song.items():
  fs=list(set(fs))
  for a in fs:
    for b in fs:
      if a!=b: nb[a][b]+=1
out=[];keep=lambda i:not ban.search(N[i]['label']) and not ban.search(N[i].get('gloss') or '')
for i,n in enumerate(N):
  out.append([j for j,_ in nb[i].most_common(40) if keep(j)][:30] if keep(i) else [])
okn=[1 if keep(i) else 0 for i in range(len(N))]
open('webapp/nodegraph.js','w').write('window.NG='+json.dumps({'nb':out,'ok':okn})+';')
print(len(N),sum(okn),sum(map(len,out)))
