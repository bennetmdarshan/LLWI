'use strict';
(() => {
 const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 const menu=$('#mobile-nav'), menuButton=$('#menu-toggle');
 function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');}
 menuButton.addEventListener('click',()=>setMenu(menu.hidden));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);menuButton.focus();}});
 $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.header'))setMenu(false);});
 window.addEventListener('resize',()=>{if(innerWidth>1020)setMenu(false);});
 if(!reduced.matches){document.body.classList.add('js-motion');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.06});$$('.reveal').forEach(e=>io.observe(e));}
 const rail=$('#moments-rail');$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>rail?.scrollBy({left:Number(b.dataset.scroll)*310,behavior:paused?'auto':'smooth'})));
 $$('[data-trip-filter]').forEach(select=>select.addEventListener('change',()=>{const filters=$$('[data-trip-filter]');let count=0;$$('.confirmed-trips .chapter-card').forEach(card=>{card.hidden=filters.some(f=>f.value&&card.dataset[f.dataset.tripFilter]!==f.value);if(!card.hidden)count++;});const empty=$('.trip-empty');if(empty)empty.hidden=count>0;}));
 const upcoming=$('#upcoming-panel'),past=$('#past-panel');
 function showTrips(which){if(!past)return;past.hidden=which!=='past';upcoming.hidden=which!=='upcoming';$$('[data-trip-tab]').forEach(b=>{const on=b.dataset.tripTab===which;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});}
 $$('[data-trip-tab]').forEach(b=>b.addEventListener('click',()=>{showTrips(b.dataset.tripTab);history.replaceState(null,'',b.dataset.tripTab==='past'?'#past':location.pathname);}));
 if(location.hash==='#past')showTrips('past');
 $$('[data-chapter-filter]').forEach(b=>b.addEventListener('click',()=>{const value=b.dataset.chapterFilter;$$('[data-chapter-filter]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});let n=0;$$('#past-panel .chapter-card').forEach(c=>{c.hidden=value!=='all'&&c.dataset.category!==value;if(!c.hidden)n++;});$('#chapter-count').textContent=`${n} photo collection${n===1?'':'s'}`;}));
 $$('[data-gallery-filter]').forEach(b=>b.addEventListener('click',()=>{const value=b.dataset.galleryFilter;$$('[data-gallery-filter]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});let n=0;$$('#community-gallery > div').forEach(c=>{c.hidden=value!=='all'&&c.dataset.category!==value;if(!c.hidden)n++;});$('#gallery-count').textContent=`${n} moment${n===1?'':'s'} to explore`;}));
 const dialog=$('#lightbox'); let gallery=[], current=0, lastTrigger=null;
 function showPhoto(index){current=(index+gallery.length)%gallery.length;const b=gallery[current];const im=$('img',b);$('#lightbox-img').src=im.src.replace(/-(600|1000)\.webp$/,'-1600.webp');$('#lightbox-img').alt=im.alt;$('#lightbox-caption').textContent=$('span',b)?.textContent||im.alt;$('#lightbox-count').textContent=`${current+1} / ${gallery.length}`;}
 $$('[data-photo]').forEach(b=>b.addEventListener('click',()=>{gallery=$$('[data-photo]').filter(x=>!x.closest('[hidden]'));lastTrigger=b;showPhoto(gallery.indexOf(b));dialog.showModal();$('.lightbox-close').focus();}));
 function closePhoto(){dialog.close();lastTrigger?.focus();}
 $('.lightbox-close').addEventListener('click',closePhoto);$('.lightbox-prev').addEventListener('click',()=>showPhoto(current-1));$('.lightbox-next').addEventListener('click',()=>showPhoto(current+1));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePhoto();}});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){showPhoto(current+1);e.preventDefault();}if(e.key==='ArrowLeft'){showPhoto(current-1);e.preventDefault();}});
 let touchStart=0;$('#lightbox-img').addEventListener('touchstart',e=>touchStart=e.touches[0].clientX,{passive:true});$('#lightbox-img').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchStart;if(Math.abs(d)>55)showPhoto(current+(d<0?1:-1));},{passive:true});
 const canvas=$('#fluid-bg'),ctx=canvas.getContext('2d',{alpha:true});let w=0,h=0,dpr=1,raf=0,last=0,t=0,mx=0,my=0,tx=0,ty=0;
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function draw(){ctx.clearRect(0,0,w,h);const time=t*.0002;const small=w<700;const x=w*(small?.85:.64)+mx*17,y=h*.45+my*15;for(let k=0;k<3;k++){const radius=Math.max(w*(small?.8:.38),300);const gx=x+Math.sin(time*.8+k*2)*w*.3,gy=y+Math.cos(time*.6+k)*h*.38;const g=ctx.createRadialGradient(gx,gy,0,gx,gy,radius);const colors=['225,238,255','255,226,238','229,246,242'];g.addColorStop(0,`rgba(${colors[k]},${small?.28:.42})`);g.addColorStop(1,`rgba(${colors[k]},0)`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 for(let i=0;i<7;i++){ctx.beginPath();const bx=w*.82+i*26+mx*15;ctx.moveTo(bx+Math.sin(time+i*.15)*60,-60);ctx.bezierCurveTo(bx-w*.24+Math.cos(time*.65)*70,h*.29,bx+w*.3+Math.sin(time*.72)*90,h*.69,bx-w*.15,h+60);ctx.strokeStyle=`rgba(76,131,219,${.038+i*.001})`;ctx.lineWidth=1.2;ctx.stroke();}
 for(let i=0;i<4;i++){const by=h*.79+i*20;ctx.beginPath();ctx.moveTo(-40,by);ctx.bezierCurveTo(w*.24,by-130+Math.sin(time)*50,w*.2,by+70,w*.5,by+80);ctx.strokeStyle='rgba(239,142,181,.065)';ctx.stroke();}}
 function tick(now){if(paused||document.hidden){raf=0;return;}if(now-last>33){t+=Math.min(now-last,60);last=now;mx+=(tx-mx)*.025;my+=(ty-my)*.025;draw();}raf=requestAnimationFrame(tick);}
 function start(){if(!paused&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}}
 function updateMotion(){document.body.classList.toggle('motion-paused',paused);$$('.motion-toggle').forEach(b=>{b.innerHTML=paused?'Resume motion <span aria-hidden="true">▷</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';b.setAttribute('aria-pressed',String(paused));});if(paused){cancelAnimationFrame(raf);raf=0;}else start();}
 $$('.motion-toggle').forEach(b=>b.addEventListener('click',()=>{paused=!paused;updateMotion();}));
 reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();});
 window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/w-.5);ty=(e.clientY/h-.5);}}, {passive:true});window.addEventListener('resize',resize,{passive:true});resize();updateMotion();
})();
