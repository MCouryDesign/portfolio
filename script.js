// year
document.querySelectorAll('#year').forEach(e=>e.textContent=new Date().getFullYear());
// nav scroll
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>30));
// mobile menu
const burger=document.getElementById('burger'),links=document.getElementById('navlinks');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');burger.setAttribute('aria-expanded','false')}));
// duplicate marquee for seamless loop
const mt=document.getElementById('mtrack');
if(mt){
  mt.innerHTML+=mt.innerHTML; // duplicate for seamless loop
  let half=mt.scrollWidth/2, x=0, last=performance.now(), paused=false;
  const SPEED=55; // px per second
  const measure=()=>{half=mt.scrollWidth/2;};
  addEventListener('load',measure); addEventListener('resize',measure);
  mt.parentElement.addEventListener('pointerenter',()=>paused=true);
  mt.parentElement.addEventListener('pointerleave',()=>paused=false);
  function tick(now){
    const dt=(now-last)/1000; last=now;
    if(!paused && half>0){ x-=SPEED*dt; if(-x>=half) x+=half; mt.style.transform=`translateX(${x}px)`; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
// reveal on scroll
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// animated counters
const cio=new IntersectionObserver((es)=>es.forEach(e=>{
  if(!e.isIntersecting)return; cio.unobserve(e.target);
  e.target.querySelectorAll('[data-count]').forEach(el=>{
    const end=+el.dataset.count; const sfx=el.dataset.suffix||''; let t0=null; const dur=1600;
    const step=(t)=>{if(!t0)t0=t; const p=Math.min((t-t0)/dur,1); const val=Math.floor((1-Math.pow(1-p,3))*end);
      el.textContent=val.toLocaleString()+sfx; if(p<1)requestAnimationFrame(step); else el.textContent=end.toLocaleString()+sfx;};
    requestAnimationFrame(step);
  });
}),{threshold:.4});
document.querySelectorAll('[data-counters]').forEach(el=>cio.observe(el));
// pointer-reactive aurora + hero parallax + cursor glow (runs regardless of reduce-motion so the effect is visible)
{
  const blobs=[...document.querySelectorAll('.blob')],mark=document.getElementById('heroMark'),glow=document.getElementById('glow');
  addEventListener('pointermove',e=>{
    const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
    blobs.forEach(b=>{const d=+b.dataset.depth||.3;b.style.transform=`translate(${x*60*d}px,${y*60*d}px)`;});
    if(mark) mark.style.transform=`translate(${x*22}px,${y*22}px)`;
    if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}
  });
}
// contact form -> Formspree via AJAX (keeps user on page; action= fallback if JS off)
const cf=document.getElementById('contactForm');
if(cf){
  const status=document.getElementById('formStatus');
  const btn=cf.querySelector('button[type="submit"]');
  cf.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const original=btn.innerHTML;
    btn.disabled=true; btn.textContent='Sending…';
    status.className='form-status'; status.textContent='';
    try{
      const res=await fetch(cf.action,{method:'POST',body:new FormData(cf),headers:{'Accept':'application/json'}});
      if(res.ok){
        cf.reset();
        status.textContent="Thanks — your message is on its way. I'll be in touch shortly.";
        status.className='form-status ok';
      }else{
        const data=await res.json().catch(()=>({}));
        status.textContent=(data.errors&&data.errors.map(x=>x.message).join(' ')) || 'Something went wrong — please email me directly at mcourydesign@gmail.com.';
        status.className='form-status err';
      }
    }catch(_){
      status.textContent='Network error — please email me directly at mcourydesign@gmail.com.';
      status.className='form-status err';
    }finally{
      btn.disabled=false; btn.innerHTML=original;
    }
  });
}
