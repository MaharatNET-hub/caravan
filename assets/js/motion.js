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
/* النجوم تومض في 4 مجموعات بدلاً من حركة مستقلة لكل نجمة: 30 على الجوال و60 على الشاشات الكبيرة في الهيرو */
if(window.caStars) $$('[data-stars]').forEach(g=>{
  let [n,w,h,sd]=g.dataset.stars.split(',').map(Number);
  n=g.closest('.hero')?(innerWidth<760?30:60):Math.min(n,70);
  const cs=caStars(n,w,h,sd).replace(/ class="tw"| style="animation-delay:[^"]*"/g,'').match(/<circle[^>]*\/>/g)||[], gs=['','','',''];
  cs.forEach((c,i)=>gs[i%4]+=c);
  g.innerHTML=gs.map((x,i)=>`<g class="tw" style="animation-delay:${(i*.8).toFixed(1)}s">${x}</g>`).join('');
});

/* إيقاف الحركة المستمرة حين يخرج الهيرو من الشاشة أو تُخفى الصفحة، وتشغيل لوحة «من نحن» فقط وهي ظاهرة */
if('IntersectionObserver' in window){
  const vo=new IntersectionObserver(es=>es.forEach(e=>{if(e.target.classList.contains('hero'))e.target.classList.toggle('off',!e.isIntersecting);else e.target.classList.toggle('inview',e.isIntersecting)}));
  $$('.hero,.panorama').forEach(el=>vo.observe(el));
}
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('tabhid',document.hidden));

/* ---------- ظهور العناصر عند التمرير ---------- */
const SEL=['.sec-head','.rule + h2.h','p.lede','.doors .door','.fields li','.goals','.tier-main','.tier-side .tier','.fees','.cond > div','.steps li','.rd details','.ev','.evc','.evstrip a','.prod','.co','.sp:not(.marq .sp)','.invest > div','.kcard','.sitem','.news article','.timeline li','.vm > div','.svc article','.rvc','.topics details','.faq details','.chap details','.nums > div','.org .lvl','.tribute','.joinbar','.formbox','.card-wrap','.cside .box','.cform','.map','.panorama','.vcard','.ticket','.rules li','.about-text > *','.split > div','.empty'].join(',');
let io=null;
if(!RM&&'IntersectionObserver' in window){
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
}
let firstPrime=true;
function prime(root){
  if(!io) return;
  $$(SEL,root).forEach(el=>{
    if(el.dataset.rv) return; el.dataset.rv='1';
    if(firstPrime&&el.getBoundingClientRect().top<innerHeight) return; /* ما ظهر مع أول رسم يبقى كما هو */
    el.classList.add('reveal');
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
    fitDrive(svg);
    if(RM){try{anims.forEach(a=>a.beginElement());svg.setCurrentTime(30);svg.pauseAnimations()}catch(e){}return}
    anims.forEach(a=>{try{a.beginElement()}catch(e){}});
  });
}

/* يتوقف الموترهوم داخل الجزء الظاهر من المشهد مهما كان عرض الشاشة */
function fitDrive(svg){
  const m=svg.querySelector('#drv'), path=svg.querySelector('#hroad'); if(!m||!path) return;
  const r=svg.getBoundingClientRect(), ctm=path.getScreenCTM(); if(!r.width||!r.height||!ctm) return;
  const L=path.getTotalLength(), lead=document.querySelector('.hero .lead');
  /* الجوال: نحو منتصف المشهد أسفل الأزرار. الشاشات الأكبر: قبل عمود النص حتى لا يغطي الأزرار */
  const ok=r.width<760||!lead
    ? (l=>{const s=Math.max(r.width/1440,r.height/520),vw=r.width/s;return path.getPointAtLength(l).x<720-vw/2+vw*.42})
    : (l=>{const q=path.getPointAtLength(l).matrixTransform(ctm);return q.x+90*ctm.a<lead.getBoundingClientRect().left-16});
  let lo=0,hi=L; for(let i=0;i<18;i++){const mid=(lo+hi)/2; if(ok(mid)) lo=mid; else hi=mid}
  m.setAttribute('keyPoints','0;'+Math.max(.3,lo/L).toFixed(3));
}

/* ---------- عند فتح أي صفحة ---------- */
function onPage(page){prime(page);counters(page);drive(page)}
window.addEventListener('ca:page',e=>onPage(e.detail));
const first=$('.page.on'); if(first) onPage(first); firstPrime=false;

/* ---------- الهيدر وشريط التقدّم وزر الصعود ---------- */
const top=$('.top'), up=$('#totop');
let ticking=false;
function onScroll(){
  const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
  top.classList.toggle('scrolled',y>40);
  top.style.setProperty('--p',(h>0?Math.min(1,y/h):0));
  if(up) up.classList.toggle('show',y>700);
  if(!RM&&innerWidth>860) parallax(y); /* لا منظور على الجوال */
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
if(up) up.addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));

/* ---------- المنظور في الهيرو ---------- */
const layers=$$('.hero .px'); const mx=0;
function parallax(y){
  if(!layers.length||y>900) return;
  layers.forEach(l=>{const k=+l.dataset.k||0;l.style.transform=`translate(${(mx*k*40).toFixed(1)}px,${(y*k).toFixed(1)}px)`});
}
onScroll();

})();
