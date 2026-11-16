(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const source = document.getElementById('BG-vramgrid');
    if (!source) return;
    const style = document.createElement('style');
    style.textContent = `#bg-pixel-editor{position:fixed;left:32px;top:110px;z-index:5000;background:#fff;color:#222;border:2px solid #555;border-radius:8px;box-shadow:0 6px 24px #0005;padding:12px;max-width:90vw;max-height:80vh;overflow:auto}#bg-pixel-editor[hidden]{display:none}#bg-pixel-editor header{cursor:move;touch-action:none;display:flex;justify-content:space-between;gap:24px;padding-right:40px;min-height:32px}#bg-pixel-editor .matrix{display:grid;gap:0;margin-top:10px;width:max-content}#bg-pixel-editor .slot{border:0;width:96px;height:96px;min-height:0;box-sizing:border-box;position:relative}#bg-pixel-editor .slot.selected{outline:2px solid #087ac1;outline-offset:-2px;z-index:1}#bg-pixel-editor canvas{display:block;width:96px;height:96px;image-rendering:pixelated;touch-action:none;cursor:crosshair}#bg-pixel-editor .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}#bg-pixel-editor .slot>span{display:none}#bg-pixel-editor [data-swatches]{display:flex;gap:6px}#bg-pixel-editor [data-swatches] button{width:30px;height:30px;border:2px solid #888;padding:0}#bg-pixel-editor [data-swatches] button[aria-pressed="true"]{outline:3px solid #087ac1;outline-offset:1px}#bg-pixel-editor .slot.empty{box-shadow:inset 0 0 0 1px #0003;background:#fafafa;color:#888;font-size:12px;display:grid;place-items:center;text-align:center}.bg-matrix-pick{outline:2px solid #087ac1;outline-offset:-2px}#bg-tile-context{position:fixed;z-index:6000;padding:4px;background:white;border:1px solid #aaa;box-shadow:0 3px 12px #0003}#bg-pixel-editor input{width:50px}#bg-pixel-editor p{font-size:12px;max-width:460px}`;
    style.textContent += '#bg-pixel-editor .matrix-scroll{overflow:auto;max-width:min(75vw,900px);max-height:50vh;margin-top:10px}#bg-pixel-editor .matrix{margin-top:0}#bg-pixel-editor .slot,#bg-pixel-editor canvas{width:var(--matrix-tile-size);height:var(--matrix-tile-size)}#bg-pixel-editor input[data-zoom]{width:160px}\nbody.bg-mode-copy{--bg-mode-color:#ed9b16;--bg-mode-tint:#ed9b1640}body.bg-mode-draw{--bg-mode-color:#9856d8;--bg-mode-tint:#9856d840}\nbody:is(.bg-mode-copy,.bg-mode-draw) #selectable li:is(.ui-selecting,.ui-selected,.bg-matrix-pick,:hover){outline:3px solid var(--bg-mode-color)!important;outline-offset:-3px;position:relative}\nbody:is(.bg-mode-copy,.bg-mode-draw) #selectable li:is(.ui-selecting,.ui-selected,.bg-matrix-pick,:hover)::after{content:"";position:absolute;inset:0;background:var(--bg-mode-tint);border:0;pointer-events:none}\n';
    document.head.append(style);
    const panel = document.createElement('section');
    panel.id = 'bg-pixel-editor'; panel.hidden = true;
    panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Background tile editor'); panel.setAttribute('aria-modal','false');
    panel.innerHTML = `<header><strong>Background tile editor</strong><button class="modal-close-button" type="button" data-close aria-label="Close tile editor">×</button></header><div class="toolbar"><label>Columns <input data-cols type="number" min="1" max="64" value="1"></label><label>Rows <input data-rows type="number" min="1" max="64" value="1"></label><button type="button" data-resize>Resize matrix</button><div data-swatches role="group" aria-label="Drawing color"></div></div><p>Click an empty cell, then a tile on the right, or drag a tile into a cell. Paint to edit immediately. Repeated tiles share edits. Ctrl-click a tile in the matrix to remove its placement. Resize keeps cells that fit.</p><label>Zoom <input data-zoom type="range" min="4" max="30" value="8" aria-label="Tile zoom"><output data-zoom-value>8×</output></label><div class="matrix-scroll"><div class="matrix"></div></div>`;
    document.body.append(panel);
    const grid=panel.querySelector('.matrix'); let zoom=8; let cols=1, rows=1, slots=[null], selected=0, painting=false, awaitingTile=false, activeColor=0;
    const tileFor = id => document.querySelector(`#tileContainer .tile[data-vram="${id}"]`);
    const colors = () => Array.from({length:4},(_,i)=>document.getElementById(`color-picker-${i}`)?.value || exportColors[i]);
    function swatches(){
      const tile=tileFor(slots[selected]);
      const choices=Number(tile?.dataset.bpp)===1?[0,3]:[0,1,2,3];
      if(!choices.includes(activeColor))activeColor=0;
      const root=panel.querySelector('[data-swatches]');root.replaceChildren();
      choices.forEach(value=>{const button=document.createElement('button');button.type='button';button.style.background=colors()[value];button.setAttribute('aria-label',`Color ${value}`);button.setAttribute('aria-pressed',String(value===activeColor));button.onclick=()=>{activeColor=value;swatches();};root.append(button);});
    }
    panel.querySelector('[data-zoom]').addEventListener('input',e=>{
      zoom=Number(e.target.value);panel.style.setProperty('--matrix-tile-size',`${zoom*8}px`);
      grid.style.gridTemplateColumns=`repeat(${cols},${zoom*8}px)`;panel.querySelector('[data-zoom-value]').value=`${zoom}×`;
    });
    panel.style.setProperty('--matrix-tile-size','64px');
    function draw(){
      const palette=colors();
      grid.querySelectorAll('canvas').forEach(canvas=>{
        const tile=tileFor(slots[Number(canvas.dataset.index)]);if(!tile)return;
        const ctx=canvas.getContext('2d');getTilePixelValues(tile).forEach((v,i)=>{ctx.fillStyle=palette[v];ctx.fillRect(i%8,Math.floor(i/8),1,1);});
      });
    }
    function render(){
      grid.replaceChildren();grid.style.gridTemplateColumns=`repeat(${cols},${zoom*8}px)`;
      slots.forEach((id,index)=>{
        const cell=document.createElement('div');cell.className='slot'+(index===selected?' selected':'');cell.tabIndex=0;
        cell.setAttribute('aria-label',`Matrix cell ${index+1}${id ? ', tile '+id : ', empty'}`);
        cell.addEventListener('click',e=>{if(e.ctrlKey){e.preventDefault();e.stopPropagation();painting=false;slots[index]=null;selected=index;awaitingTile=false;render();return;}if(e.target.closest('canvas,button'))return;awaitingTile=true;selected=index;grid.querySelectorAll('.slot').forEach((s,i)=>s.classList.toggle('selected',i===index));swatches();});
        cell.addEventListener('dragover',e=>e.preventDefault());cell.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-trep-bg-tile');if(tileFor(id)){slots[index]=id;selected=index;render();}});
        if(id){const canvas=document.createElement('canvas');canvas.width=canvas.height=8;canvas.dataset.index=index;cell.append(canvas);const label=document.createElement('span');label.textContent=id;cell.append(label);}
        else {cell.textContent='Click to add tile';cell.classList.add('empty');}grid.append(cell);
      });draw();swatches();
    }
    function assign(id){if(!tileFor(id))return;slots[selected]=id;awaitingTile=false;render();}
    panel.querySelector('[data-close]').onclick=()=>panel.hidden=true;
    panel.querySelector('[data-resize]').onclick=()=>{
      const nc=Number(panel.querySelector('[data-cols]').value),nr=Number(panel.querySelector('[data-rows]').value);
      if(!Number.isInteger(nc)||!Number.isInteger(nr)||nc<1||nr<1||nc>64||nr>64)return;
      if(slots.some((id,i)=>id&&(i%cols>=nc||Math.floor(i/cols)>=nr))&&!confirm('Remove placements outside the new matrix size? Tile edits will be kept.'))return;
      const next=Array(nc*nr).fill(null);slots.forEach((id,i)=>{const x=i%cols,y=Math.floor(i/cols);if(x<nc&&y<nr)next[y*nc+x]=id;});cols=nc;rows=nr;slots=next;selected=0;render();
    };
    function paint(e){
      const canvas=document.elementFromPoint(e.clientX,e.clientY)?.closest('#bg-pixel-editor canvas');if(!canvas)return;
      const tile=tileFor(slots[Number(canvas.dataset.index)]);if(!tile)return;
      const rect=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-rect.left)*8/rect.width),y=Math.floor((e.clientY-rect.top)*8/rect.height);if(x<0||x>7||y<0||y>7)return;
      selected=Number(canvas.dataset.index);swatches();const bpp=Number(tile.dataset.bpp),value=bpp===1?(activeColor===0?0:3):activeColor;
      const address=tile.id.replace('tileaddr-',''),bytes=readTileBytes(address,bpp);
      if(bytes.some((_,i)=>isProtectedRomAddress((parseInt(address,16)+i).toString(16).toUpperCase().padStart(4,'0'))))return;
      const pixels=getTilePixelValues(tile);pixels[y*8+x]=value;setTilePixelValues(tile,pixels);writeTileBytes(address,encodeTilePixels(pixels,bpp));
      const id=tile.dataset.vram;saveTileToLocalStorage(id);const image=localStorage.getItem('tileImage-'+id);
      document.querySelectorAll('#BG-vramgrid .BG-cell').forEach(cell=>{if(cell.id===id)cell.querySelectorAll('img').forEach(img=>img.src=image);});
      document.querySelectorAll('#selectable img').forEach(img=>{if(img.dataset.tileId===id||img.getAttribute('data-tile-ID')===id||img.title===id)img.src=image;});
      draw();
    }
    grid.addEventListener('pointerdown',e=>{if(e.ctrlKey){painting=false;return;}if(e.button!==0||!e.target.closest('canvas'))return;painting=true;e.preventDefault();e.stopPropagation();paint(e);});
    window.addEventListener('pointermove',e=>{if(painting&&e.buttons){e.preventDefault();paint(e);}}, {passive:false});window.addEventListener('pointerup',()=>painting=false);window.addEventListener('blur',()=>painting=false);
    let drag;
    panel.querySelector('header').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=panel.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};e.currentTarget.setPointerCapture(e.pointerId);});
    panel.querySelector('header').addEventListener('pointermove',e=>{if(!drag)return;panel.style.left=Math.max(0,Math.min(innerWidth-80,e.clientX-drag.x))+'px';panel.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-drag.y))+'px';});
    panel.querySelector('header').addEventListener('pointerup',()=>drag=null);panel.querySelector('header').addEventListener('pointercancel',()=>drag=null);
    source.addEventListener('click',e=>{const cell=e.target.closest('.BG-cell');if(!cell||!tileFor(cell.id))return;if(e.ctrlKey){e.preventDefault();e.stopImmediatePropagation();panel.hidden=false;assign(cell.id);}else if(!panel.hidden&&awaitingTile){e.stopImmediatePropagation();assign(cell.id);}},true);
    source.addEventListener('mousedown',e=>{if(e.ctrlKey&&e.target.closest('.BG-cell'))e.stopImmediatePropagation();},true);
    source.addEventListener('pointerdown',e=>{if(e.ctrlKey&&e.target.closest('.BG-cell'))e.stopImmediatePropagation();},true);
    new MutationObserver(()=>source.querySelectorAll('.BG-cell').forEach(cell=>cell.draggable=true)).observe(source,{childList:true});
    source.querySelectorAll('.BG-cell').forEach(cell=>cell.draggable=true);
    source.addEventListener('dragstart',e=>{const cell=e.target.closest('.BG-cell');if(!cell)return;e.dataTransfer.setData('application/x-trep-bg-tile',cell.id);e.dataTransfer.effectAllowed='copy';});
    const context=document.createElement('div');context.id='bg-tile-context';context.hidden=true;context.setAttribute('role','menu');
    const edit=document.createElement('button');edit.type='button';edit.textContent='Edit tile';edit.setAttribute('role','menuitem');context.append(edit);document.body.append(context);
    let contextId;
    source.addEventListener('contextmenu',e=>{const cell=e.target.closest('.BG-cell');if(!cell||!tileFor(cell.id))return;e.preventDefault();contextId=cell.id;context.hidden=false;context.style.left=Math.min(e.clientX,innerWidth-130)+'px';context.style.top=Math.min(e.clientY,innerHeight-50)+'px';edit.focus();});
    edit.onclick=()=>{context.hidden=true;panel.hidden=false;assign(contextId);};
    document.addEventListener('pointerdown',e=>{if(!context.contains(e.target))context.hidden=true;});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')context.hidden=true;});
    const map=document.getElementById('selectable');let picking=null;
    const clearPick=()=>map?.querySelectorAll('.bg-matrix-pick').forEach(cell=>cell.classList.remove('bg-matrix-pick'));
    function pickEnd(e){
      const cells=Array.from(map.children);const r=map.getBoundingClientRect();
      const x=Math.max(0,Math.min(picking.width-1,Math.floor((e.clientX-r.left)/32)));
      const y=Math.max(0,Math.min(picking.height-1,Math.floor((e.clientY-r.top)/32)));
      return {left:Math.min(x,picking.x),right:Math.max(x,picking.x),top:Math.min(y,picking.y),bottom:Math.max(y,picking.y),cells};
    }
    map?.addEventListener('pointerdown',e=>{
      if(!e.ctrlKey||!e.shiftKey||e.button!==0)return;const cell=e.target.closest('li');if(!cell)return;
      e.preventDefault();e.stopImmediatePropagation();const cells=Array.from(map.children),width=Math.round(map.getBoundingClientRect().width/32),i=cells.indexOf(cell);
      picking={x:i%width,y:Math.floor(i/width),width,height:Math.ceil(cells.length/width)};cell.classList.add('bg-matrix-pick');map.setPointerCapture(e.pointerId);
    },true);
    map?.addEventListener('pointermove',e=>{if(!picking)return;e.preventDefault();e.stopImmediatePropagation();clearPick();const r=pickEnd(e);r.cells.forEach((cell,i)=>{const x=i%picking.width,y=Math.floor(i/picking.width);if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)cell.classList.add('bg-matrix-pick');});},true);
    map?.addEventListener('pointerup',e=>{
      if(!picking)return;e.preventDefault();e.stopImmediatePropagation();const r=pickEnd(e);cols=r.right-r.left+1;rows=r.bottom-r.top+1;slots=[];
      for(let y=r.top;y<=r.bottom;y++)for(let x=r.left;x<=r.right;x++){
        const cell=r.cells[y*picking.width+x],img=cell?.querySelector('img');const id=(img?.dataset.tileId||img?.getAttribute('data-tile-ID')||cell?.querySelector('.BGtileID')?.textContent||'').trim().toUpperCase();slots.push(tileFor(id)?id:null);
      }
      clearPick();picking=null;if(map.hasPointerCapture(e.pointerId))map.releasePointerCapture(e.pointerId);
      selected=0;awaitingTile=false;panel.querySelector('[data-cols]').value=cols;panel.querySelector('[data-rows]').value=rows;panel.hidden=false;render();
    },true);
    map?.addEventListener('pointercancel',()=>{clearPick();picking=null;},true);
    const mode=e=>{
      document.body.classList.toggle('bg-mode-copy',Boolean(e.ctrlKey&&!e.shiftKey));
      document.body.classList.toggle('bg-mode-draw',Boolean(e.ctrlKey&&e.shiftKey));
    };
    document.addEventListener('keydown',mode);document.addEventListener('keyup',mode);
    document.addEventListener('pointermove',mode);
    window.addEventListener('blur',()=>document.body.classList.remove('bg-mode-copy','bg-mode-draw'));
    render();
  });
})();

