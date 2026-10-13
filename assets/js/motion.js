/* =====================================================================
   جمعية الكرفانات — الحركة والانيميشن
   ظهور العناصر عند التمرير، العدّادات، المنظور (Parallax)، الهيدر،
   تشغيل مشاهد القيادة عند فتح كل صفحة. يحترم تفضيل «تقليل الحركة».
   ===================================================================== */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
document.documentElement.classList.add(RM?'rm':'motion');

/* نجوم الهيرو */
if(window.caStars) $$('[data-stars]').forEach(g=>{const [n,w,h,sd]=g.dataset.stars.split(',').map(Number);g.innerHTML=caStars(n,w,h,sd)});

/* ---------- ظهور العناصر عند التمرير ---------- */
const SEL=['.sec-head','.rule + h2.h','p.lede','.doors .door','.fields li','.goals','.tier-main','.tier-side .tier','.fees','.cond > div','.steps li','.rd details','.ev','.evc','.evstrip a','.prod','.co','.sp:not(.marq .sp)','.invest > div','.kcard','.sitem','.news article','.timeline li','.vm > div','.svc article','.rvc','.topics details','.faq details','.chap details','.nums > div','.org .lvl','.tribute','.joinbar','.formbox','.card-wrap','.cside .box','.cform','.map','.panorama','.vcard','.ticket','.rules li','.about-text > *','.split > div','.empty'].join(',');
let io=null;
if(!RM&&'IntersectionObserver' in window){
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
}
function prime(root){
  if(!io) return;
  $$(SEL,root).forEach(el=>{
    if(el.dataset.rv) return; el.dataset.rv='1'; el.classList.add('reveal');
    const sib=Array.from(el.parentElement.children).filter(c=>c.classList.contains('reveal'));
    el.style.setProperty('--d',(Math.min(sib.indexOf(el),8)*0.07)+'s');
    io.observe(el);
  });
}
/* المحتوى المُولَّد ديناميكياً */
if(io){new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){const pg=n.closest&&n.closest('.page');if(pg&&pg.classList.contains('on'))prime(pg)}}))}).observe($('#main'),{childList:true,subtree:true})}

/* ---------- العدّادات ---------- */
function counters(root){
  $$('.nums .n',root).forEach(el=>{
    if(el.dataset.done) return; const m=el.textContent.match(/^(\d+)(%?)$/); if(!m) return;
    el.dataset.done=1; const end=+m[1], suf=m[2];
    if(RM){return}
    const ob=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;ob.disconnect();const t0=performance.now(),D=1400;
      const tick=t=>{const p=Math.min(1,(t-t0)/D),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick)};el.textContent='0'+suf;requestAnimationFrame(tick)},{threshold:.5});
    ob.observe(el);
  });
}

/* ---------- تشغيل مشاهد القيادة (SMIL) ---------- */
function drive(page){
  $$('svg',page).forEach(svg=>{
    const anims=$$('animateTransform[begin="indefinite"],animateMotion[begin="indefinite"]',svg);
    if(!anims.length) return;
    if(RM){try{anims.forEach(a=>a.beginElement());svg.setCurrentTime(30);svg.pauseAnimations()}catch(e){}return}
    anims.forEach(a=>{try{a.beginElement()}catch(e){}});
  });
}

/* ---------- عند فتح أي صفحة ---------- */
function onPage(page){prime(page);counters(page);drive(page)}
window.addEventListener('ca:page',e=>onPage(e.detail));
const first=$('.page.on'); if(first) onPage(first);

/* ---------- الهيدر وشريط التقدّم وزر الصعود ---------- */
const top=$('.top'), up=$('#totop');
let ticking=false;
function onScroll(){
  const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
  top.classList.toggle('scrolled',y>40);
  top.style.setProperty('--p',(h>0?Math.min(1,y/h):0));
  if(up) up.classList.toggle('show',y>700);
  if(!RM) parallax(y);
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
if(up) up.addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));

/* ---------- المنظور في الهيرو ---------- */
const layers=$$('.hero .px'); let mx=0;
function parallax(y){
  if(!layers.length||y>900) return;
  layers.forEach(l=>{const k=+l.dataset.k||0;l.style.transform=`translate(${(mx*k*40).toFixed(1)}px,${(y*k).toFixed(1)}px)`});
}
if(!RM&&matchMedia('(hover:hover)').matches){
  const hero=$('.hero');
  if(hero) hero.addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5);requestAnimationFrame(()=>parallax(scrollY))});
}
onScroll();

/* ---------- تأثير الضوء على البطاقات ---------- */
if(!RM&&matchMedia('(hover:hover)').matches){
  document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.prod,.kcard,.sitem,.co,.door,.evc');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
}
})();
