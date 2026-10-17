from pathlib import Path
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.ids.append(a['id'])
  if t=='script' and 'src' in a:self.refs.append(a['src'])
  if t=='link' and a.get('rel')=='stylesheet':self.refs.append(a['href'])
p=Path('../qual-timer');c=Check();c.feed((p/'index.html').read_text(encoding='utf-8'));assert len(c.ids)==len(set(c.ids))
for ref in c.refs:assert (p/ref).exists(),ref
site=Path('../../index.html').read_text(encoding='utf-8');assert site.count('href="apps/qual-timer/index.html"')==3
assert (p/'preview.svg').exists();assert '680,460' in (p/'settings.js').read_text(encoding='utf-8')
print('PASS: unique element IDs, script/style assets, preview asset, three main-site app links, stencil preset')
