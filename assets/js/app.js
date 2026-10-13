(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const year=new Date().getFullYear();
$('#yr').textContent=year;
const cexp=$('#c-exp'); if(cexp) cexp.textContent='31 ديسمبر '+year;

/* ---------- theme & nav ---------- */
const t=store.get('ca-theme'); if(t) document.documentElement.dataset.theme=t;
$('#theme').addEventListener('click',()=>{
  const cur=document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const nx=cur==='dark'?'light':'dark'; document.documentElement.dataset.theme=nx; store.set('ca-theme',nx);
});
const nav=$('#nav'), burger=$('#burger');
burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
nav.addEventListener('click',e=>{if(e.target.tagName==='A'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

/* ---------- renderers ---------- */
function newsHTML(list,compact){return list.map(n=>`<article><div class="thumb"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART[n.art]}</svg></div><div><div class="kind">${n.cat}</div><h3>${n.title}</h3><p>${n.body}</p></div></article>`).join('')}
$('#home-news').innerHTML=newsHTML(NEWS.slice(0,3),true);
function renderNews(f){$('#news').innerHTML=newsHTML(NEWS.filter(n=>f==='all'||n.cat===f))}
renderNews('all');
$('#nchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('#nchips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderNews(b.dataset.f)});

$('#chapters').innerHTML=CHAPTERS.map((c,i)=>`<details${i===0?' open':''}><summary><span class="no">الباب ${i+1}</span><b>${c.t}<small>${c.a}</small></b></summary><div class="body"><dl>${c.items.map(x=>`<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join('')}</dl></div></details>`).join('');

/* sites */
let siteF='all', siteSel=null;
function renderSites(){
  const list=SITES.filter(s=>siteF==='all'||(siteF==='open'&&s.open)||(siteF==='ad'&&s.ad)||(siteF==='out'&&s.out));
  $('#slist').innerHTML=list.map(s=>`<article class="sitem${s.id===siteSel?' on':''}" data-id="${s.id}" tabindex="0"><div class="ph">${s.img?`<img src="${s.img}" alt="${s.name}" loading="lazy">`:sceneSVG(s.scene)}<span class="badge${s.open?'':' soft'}">${s.status}</span></div><div class="txt"><div class="r1"><h3>${s.name}</h3></div><p>${s.desc}</p>${window.__siteRating?window.__siteRating(s.id):''}<dl><div><dt>الموقع:</dt><dd>${s.area}</dd></div><div><dt>الطبيعة:</dt><dd>${s.kind}</dd></div></dl></div></article>`).join('')||'<div class="empty">لا توجد مواقف ضمن هذا التصنيف.</div>';
  $('#pins').innerHTML=list.map(s=>`<g class="pin${s.id===siteSel?' on':''}" data-id="${s.id}" tabindex="0" role="button" aria-label="${s.name}"><circle class="ring" cx="${s.x}" cy="${s.y}" r="11" fill="#F2D27E" opacity=".25"/><circle cx="${s.x}" cy="${s.y}" r="6" fill="${s.open?'#F2D27E':'#CFC6B6'}" stroke="#231F20" stroke-width="2"/></g>`).join('');
}
function pick(id){siteSel=id;renderSites();const el=$(`.sitem[data-id="${id}"]`);if(el&&innerWidth<860)el.scrollIntoView({block:'nearest',behavior:'smooth'})}
$('#slist').addEventListener('click',e=>{const a=e.target.closest('.sitem');if(a)pick(a.dataset.id)});
$('#slist').addEventListener('keydown',e=>{const a=e.target.closest('.sitem');if(a&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pick(a.dataset.id)}});
$('#pins').addEventListener('click',e=>{const g=e.target.closest('.pin');if(g)pick(g.dataset.id)});
$('#pins').addEventListener('keydown',e=>{const g=e.target.closest('.pin');if(g&&e.key==='Enter')pick(g.dataset.id)});
$$('#p-sites .chip').forEach(b=>b.addEventListener('click',()=>{siteF=b.dataset.f;$$('#p-sites .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderSites()}));
renderSites();

/* knowledge */
const kcard=a=>`<a class="kcard" href="#/knowledge/${a.id}"><div class="cover"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART[a.cover]}</svg></div><div class="in"><span class="cat">${a.cat}</span><b>${a.t}</b><span class="d">${a.d}</span><span class="rt">${a.rt}</span></div></a>`;
$('#kgrid').innerHTML=ARTICLES.map(kcard).join('');
function renderArticle(id){
  const a=ARTICLES.find(x=>x.id===id); if(!a) return false;
  $('#a-crumb').textContent=a.t; $('#a-title').textContent=a.t; $('#a-desc').textContent=a.d;
  if(a.check){
    let st={}; try{st=JSON.parse(store.get('ca-check')||'{}')}catch(e){}
    $('#a-toc').innerHTML='';
    $('#a-body').innerHTML=`<div class="ckmeta"><span id="ckc"></span><button class="btn2" id="ckreset" type="button">ابدأ من جديد</button></div><ul class="checklist">${a.check.map((c,i)=>`<li class="${st[i]?'done':''}"><input type="checkbox" id="ck${i}" ${st[i]?'checked':''}><label for="ck${i}"><span>${c}</span></label></li>`).join('')}</ul><div class="note">هذه القائمة إرشادية عامة. راجع دليل الشركة المصنّعة لمركبتك وكرفانك.</div>`;
    const upd=()=>{const n=$$('.checklist input').filter(i=>i.checked).length;$('#ckc').textContent=`أنجزت ${n} من ${a.check.length}`};
    $$('.checklist input').forEach((inp,i)=>inp.addEventListener('change',()=>{st[i]=inp.checked;inp.closest('li').classList.toggle('done',inp.checked);store.set('ca-check',JSON.stringify(st));upd()}));
    $('#ckreset').addEventListener('click',()=>{st={};store.del('ca-check');renderArticle(id)});
    upd();
  }else{
    $('#a-toc').innerHTML='<b>في هذا الدليل</b>'+a.sections.map((s,i)=>`<a href="#/knowledge/${a.id}" data-sec="s${i}">${s[0]}</a>`).join('');
    $('#a-body').innerHTML=a.sections.map((s,i)=>`<h2 id="s${i}">${s[0]}</h2>${s[1]}`).join('');
  }
  $('#a-more').innerHTML=ARTICLES.filter(x=>x.id!==id).slice(0,3).map(kcard).join('');
  return true;
}
$('#a-toc').addEventListener('click',e=>{const l=e.target.closest('a[data-sec]');if(l){e.preventDefault();document.getElementById(l.dataset.sec).scrollIntoView({behavior:'smooth'})}});

/* faq */
const cats=['الكل',...new Set(FAQ.map(f=>f.c))]; let fcat='الكل';
$('#faqnav').innerHTML=cats.map(c=>`<button type="button" aria-pressed="${c==='الكل'}" data-c="${c}">${c}</button>`).join('');
function renderFaq(){
  const q=$('#fq').value.trim();
  const list=FAQ.filter(f=>(fcat==='الكل'||f.c===fcat)&&(!q||(f.q+f.a).includes(q)));
  if(!list.length){$('#faq').innerHTML=`<div class="empty">لا توجد أسئلة تطابق «${esc(q)}». جرّب كلمة أخرى أو <a href="#/contact">أرسل سؤالك</a>.</div>`;return}
  let h='',last='';
  list.forEach(f=>{if(f.c!==last&&fcat==='الكل'){h+=`<h3>${f.c}</h3>`;last=f.c}h+=`<details><summary>${f.q}</summary><p>${f.a}</p></details>`});
  $('#faq').innerHTML=h;
}
$('#faqnav').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fcat=b.dataset.c;$$('#faqnav button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderFaq()});
$('#fq').addEventListener('input',renderFaq); renderFaq();

/* verify */
function verify(no){
  const n=no.trim().toUpperCase(); const r=$('#vres');
  if(!n){r.innerHTML='';return}
  if(!/^CA-?\d{3,6}$/.test(n)){r.innerHTML=`<div class="vcard"><div class="st bad">صيغة الرقم غير صحيحة</div><p style="padding:16px 22px;margin:0;color:var(--muted)">رقم العضوية يبدأ بـ CA ثم أرقام، مثل CA-1001.</p></div>`;return}
  if(n.replace('-','')==='CA1001'){r.innerHTML=`<div class="vcard"><div class="st"><span>العضوية سارية</span><span class="ref">CA-1001</span></div><dl><div><dt>الاسم</dt><dd>عضو تجريبي</dd></div><div><dt>نوع العضوية</dt><dd>عضو منتسب</dd></div><div><dt>الحالة</dt><dd>سارية</dd></div><div><dt>تاريخ الانتهاء</dt><dd>31 ديسمبر ${year}</dd></div></dl><div class="sample">نتيجة تجريبية لعرض شكل الصفحة. تظهر البيانات الفعلية بعد ربط الصفحة بسجل الأعضاء.</div></div>`;return}
  r.innerHTML=`<div class="vcard"><div class="st bad"><span>لم يُعثر على العضوية</span><span class="ref">${esc(n)}</span></div><p style="padding:16px 22px;margin:0;color:var(--muted)">تحقق من الرقم المكتوب على البطاقة. لعرض مثال على نتيجة سارية جرّب الرقم CA-1001.</p></div>`;
}
$('#vform').addEventListener('submit',e=>{e.preventDefault();verify($('#vno').value);location.hash='#/verify/'+encodeURIComponent($('#vno').value.trim())});

/* contact */
const cform=$('#cform');
const ktypeSync=()=>{const v=cform.elements.ktype.value;$('#f-kloc').hidden=!(v==='report'||v==='suggest');$('#kmsg-l').textContent={inquiry:'رسالتك',report:'وصف البلاغ: ماذا لاحظت ومتى؟',suggest:'وصف الموقع المقترح ومكانه',partner:'نبذة عن جهتك ونوع الشراكة'}[v]};
cform.addEventListener('change',ktypeSync); ktypeSync();
cform.addEventListener('submit',e=>{
  e.preventDefault(); const v=cform.elements; let ok=true;
  const bad=(id,b)=>{v[id].closest('.field').classList.toggle('bad',b);if(b)ok=false};
  bad('kname',v.kname.value.trim().length<2);
  bad('kphone',!/^(\+?971|0)5\d{8}$/.test(v.kphone.value.replace(/[\s-]/g,'')));
  bad('kmail',!!v.kmail.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.kmail.value.trim()));
  bad('ksub',v.ksub.value.trim().length<3);
  bad('kmsg',v.kmsg.value.trim().length<20);
  if(!$('#f-kloc').hidden) bad('kloc',v.kloc.value==='' && v.ktype.value==='report');
  if(!ok){cform.querySelector('.bad input,.bad select,.bad textarea').focus();return}
  const d=new Date(), ref=`CA-${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000+Math.random()*9000)}`;
  const label={inquiry:'استفسار',report:'بلاغ',suggest:'اقتراح موقع',partner:'شراكة أو رعاية'}[v.ktype.value];
  const text=`${label} — ${ref}\nالاسم: ${v.kname.value}\nالهاتف: ${v.kphone.value}${v.kmail.value?'\nالبريد: '+v.kmail.value:''}${v.kloc.value?'\nالموقع: '+v.kloc.value:''}\nالموضوع: ${v.ksub.value}\n\n${v.kmsg.value}`;
  $('#cok').innerHTML=`<b>تم تجهيز رسالتك — الرقم المرجعي <span class="ref">${ref}</span></b><p style="margin:8px 0 12px;color:var(--muted);font-size:15px">انسخ الرسالة وأرسلها إلى الجمعية عبر رسائل إنستغرام، واحتفظ بالرقم المرجعي للمتابعة.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="cta" id="kcopy">انسخ الرسالة</button><a class="btn2" style="text-decoration:none" href="https://ig.me/m/caravan_association" target="_blank" rel="noopener">افتح رسائل إنستغرام</a></div>`;
  $('#cok').classList.add('on');
  $('#kcopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);$('#kcopy').textContent='تم النسخ'}catch(err){$('#kcopy').textContent='تعذّر النسخ، انسخ يدوياً'}});
});

/* ---------- join form (from v1) ---------- */
const form=$('#form'), steps=$$('.fstep'), bars=$$('.progress i'); let cur=0;
const val=n=>{const el=form.elements[n]; if(!el) return ''; if(el instanceof RadioNodeList) return el.value; if(el.type==='checkbox') return el.checked; return el.value.trim()};
const isUAE=()=>val('nat')==='الإمارات العربية المتحدة';
const isMember=()=>val('cat')==='عضو منتسب';
const isNew=()=>['طلب انضمام جديد','إعادة التسجيل'].includes(val('req'));
function sync(){
  $('#f-memno').hidden=isNew();
  const nat=val('nat'); $('#f-pass').hidden=!nat||isUAE(); $('#resident-conds').hidden=!nat||isUAE();
  $('#caravan').hidden=!isMember();
  $('#caravan-detail').style.display=val('ctype').startsWith('لا أملك')?'none':'';
  $('#c-name').textContent=val('name')||'اسم العضو'; $('#c-type').textContent=val('cat'); calc();
}
function calc(){
  const annual=isMember()?320:300, months=12-new Date().getMonth(), first=isNew();
  const sub=first?Math.round(annual*months/12):annual, join=first?300:0, ex=val('ex1')||val('ex2');
  let h=''; if(join) h+=`<div><span>رسم الانضمام (مرة واحدة)</span><span>${join} درهم</span></div>`;
  h+=`<div><span>الاشتراك السنوي — ${val('cat')}${first?` (${months} ${months>2&&months<11?'أشهر':'شهراً'})`:''}</span><span>${ex?'<s>'+sub+'</s> بانتظار قرار الإعفاء':sub+' درهم'}</span></div>`;
  h+=`<div class="tot"><span>الإجمالي المتوقع</span><span>${join+(ex?0:sub)} درهم</span></div>`;
  $('#calc').innerHTML=h;
  $('#calcnote').textContent=first?`يُحتسب الاشتراك عن السنة الأولى بنسبة الأشهر المتبقية حتى 31 ديسمبر ${year}، ويُعد أي جزء من الشهر شهراً كاملاً.`:'تجديد عن سنة كاملة تبدأ في 1 يناير وتنتهي في 31 ديسمبر.';
}
function setBad(id,b){const el=form.elements[id];const f=el&&el.closest('.field');if(f)f.classList.toggle('bad',b);return !b}
function validate(i){
  let ok=true;
  if(i===0&&!isNew()) ok=setBad('memno',!val('memno'))&&ok;
  if(i===1){
    ok=setBad('name',val('name').split(/\s+/).length<2)&&ok;
    ok=setBad('eid',!/^784\d{12}$/.test(val('eid').replace(/[\s-]/g,'')))&&ok;
    let age=0; if(val('dob')){const d=new Date(val('dob')),n=new Date();age=n.getFullYear()-d.getFullYear()-((n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))?1:0)}
    ok=setBad('dob',!val('dob')||age<21)&&ok; ok=setBad('nat',!val('nat'))&&ok;
    if(!isUAE()&&val('nat')) ok=setBad('pass',!val('pass'))&&ok;
  }
  if(i===2){
    ok=setBad('phone',!/^(\+?971|0)5\d{8}$/.test(val('phone').replace(/[\s-]/g,'')))&&ok;
    ok=setBad('email',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')))&&ok;
    ok=setBad('emirate',!val('emirate'))&&ok;
  }
  if(i===3){let all=['d1','d2','d3','d4','d5'].every(val); if(!isUAE()) all=all&&['r1','r2','r3'].every(val); $('#f-decl').classList.toggle('bad',!all); ok=all}
  if(!ok){const b=steps[i].querySelector('.bad input,.bad select');if(b)b.focus()}
  return ok;
}
function show(i){cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));bars.forEach((b,k)=>b.classList.toggle('on',k<=i));$('#steplabel').textContent=`الخطوة ${i+1} من ${steps.length}: ${steps[i].dataset.title}`;$('#prev').hidden=i===0;$('#next').textContent=i===steps.length-1?'جهّز الطلب':'التالي'}
$('#next').addEventListener('click',()=>{if(!validate(cur))return;if(cur<steps.length-1){show(cur+1);$('#p-join .formbox').scrollIntoView({behavior:'smooth',block:'start'})}else finish()});
$('#prev').addEventListener('click',()=>show(Math.max(0,cur-1)));
function finish(){
  const rows=[['نوع الطلب',val('req')],['فئة العضوية',val('cat')],['الاسم',val('name')],['رقم الهوية',val('eid')],['الجنسية',val('nat')],['الهاتف',val('phone')],['البريد الإلكتروني',val('email')],['الإمارة',val('emirate')],['وسيلة الإخطار',val('notify')]];
  if(isMember()) rows.push(['الكرفان',val('ctype')+(val('plate')?' — لوحة '+val('plate'):'')]);
  if(val('ex1')||val('ex2')) rows.push(['طلب إعفاء',[val('ex1')?'كبار المواطنين':'',val('ex2')?'أصحاب الهمم':''].filter(Boolean).join('، ')]);
  rows.push(['تاريخ التقديم',new Date().toLocaleDateString('ar-AE')]);
  $('#summary').innerHTML=rows.map(r=>`<div><span>${r[0]}</span><span>${esc(r[1]||'—')}</span></div>`).join('');
  form.style.display='none';$('.progress').style.display='none';$('#steplabel').style.display='none';$('#done').classList.add('on');store.del('ca-form');
}
$('#print').addEventListener('click',()=>window.print());
$('#restart').addEventListener('click',()=>{form.reset();form.style.display='';$('.progress').style.display='';$('#steplabel').style.display='';$('#done').classList.remove('on');$$('.field.bad').forEach(f=>f.classList.remove('bad'));sync();show(0)});
function save(){const d={};Array.from(form.elements).forEach(el=>{if(!el.name)return;if(el.type==='radio'){if(el.checked)d[el.name]=el.value}else if(el.type==='checkbox')d[el.name]=el.checked;else d[el.name]=el.value});store.set('ca-form',JSON.stringify(d))}
function load(){let d;try{d=JSON.parse(store.get('ca-form')||'null')}catch(e){d=null}if(!d)return;Array.from(form.elements).forEach(el=>{if(!el.name||!(el.name in d))return;if(el.type==='radio')el.checked=el.value===d[el.name];else if(el.type==='checkbox')el.checked=!!d[el.name];else el.value=d[el.name]})}
form.addEventListener('input',()=>{sync();save()});form.addEventListener('change',()=>{sync();save()});
load();sync();show(0);


/* ---------- helpers ---------- */
const loadJ=(k,d)=>{try{return JSON.parse(store.get(k)||'null')??d}catch(e){return d}};
const saveJ=(k,v)=>store.set(k,JSON.stringify(v));
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return {y,m,d}};
const fmtRange=(a,b)=>{const x=pd(a),y=pd(b);if(a===b)return `${x.d} ${MONTHS[x.m-1]} ${x.y}`;if(x.m===y.m)return `${x.d}–${y.d} ${MONTHS[x.m-1]} ${x.y}`;return `${x.d} ${MONTHS[x.m-1]} – ${y.d} ${MONTHS[y.m-1]} ${y.y}`};
const priceTxt=n=>n===0?'مجاناً':n+' درهم';
function qrSVG(text){
  try{const q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true})}
  catch(e){return `<span style="font-size:11px;color:#333;direction:ltr">${esc(text)}</span>`}
}
const genId=p=>p+'-'+Date.now().toString(36).toUpperCase().slice(-6);

/* ---------- contact info ---------- */
const ci=`<ul class="contact-list"><li>الهاتف: <a href="tel:${CONTACT.phone.replace(/\s/g,'')}"><span>${CONTACT.phone}</span></a></li><li>واتساب: <a href="https://wa.me/${CONTACT.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener"><span>${CONTACT.whatsapp}</span></a></li><li>البريد: <a href="mailto:${CONTACT.email}"><span>${CONTACT.email}</span></a></li><li>${CONTACT.hours}</li></ul>`;
$$('[data-contact]').forEach(el=>el.innerHTML=ci);

/* ---------- events ---------- */
let tickets=loadJ('ca-tix',[]);
const taken=ev=>ev.taken+tickets.filter(t=>t.ev===ev.id).reduce((a,t)=>a+1,0);
const upcoming=()=>EVENTS.slice().sort((a,b)=>a.start.localeCompare(b.start));
function evDate(ev){const x=pd(ev.start);return `<div class="evdate"><b>${x.d}</b><small>${MONTHS[x.m-1]}</small></div>`}
let evF='الكل';
function renderEvents(){
  const types=['الكل',...new Set(EVENTS.map(e=>e.type))];
  $('#evchips').innerHTML=types.map(t=>`<button class="chip" data-f="${t}" aria-pressed="${t===evF}">${t}</button>`).join('');
  const list=upcoming().filter(e=>evF==='الكل'||e.type===evF);
  $('#evlist').innerHTML=list.map(e=>{
    const tk=taken(e), left=Math.max(0,e.cap-tk), full=left===0, mine=tickets.some(t=>t.ev===e.id);
    const pr=e.price.member===e.price.guest?`<div class="pr">${priceTxt(e.price.member)}${e.membersOnly?'<small>للأعضاء فقط</small>':''}</div>`:`<div class="pr">${priceTxt(e.price.member)}<small>للأعضاء — ${priceTxt(e.price.guest)} لغيرهم</small></div>`;
    return `<article class="evc">${evDate(e)}<div><h3>${e.title}</h3><div class="meta"><span>${e.type}</span><span>${fmtRange(e.start,e.end)}</span><span>${e.place}</span></div><p>${e.desc}</p><div class="seats" title="المقاعد المحجوزة"><i style="width:${Math.min(100,tk/e.cap*100)}%"></i></div><div class="meta" style="margin-top:6px"><span>${full?'اكتمل العدد':`متبقٍ ${left} من ${e.cap} ${e.unit}`}</span></div></div><div class="evside">${pr}<button class="cta" data-reg="${e.id}" ${full||mine?'disabled':''}>${mine?'مسجّل':full?'اكتمل العدد':'سجّل الآن'}</button></div></article>`;
  }).join('');
}
$('#evchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){evF=b.dataset.f;renderEvents()}});
$('#evlist').addEventListener('click',e=>{const b=e.target.closest('[data-reg]');if(b&&!b.disabled)openReg(b.dataset.reg)});
function openReg(id){
  const e=EVENTS.find(x=>x.id===id); const dlg=$('#regdlg');
  $('#regbody').innerHTML=`<h2 class="h" id="reg-title" style="font-size:22px">التسجيل: ${e.title}</h2><p style="color:var(--muted);font-size:14.5px;margin:0 0 16px">${fmtRange(e.start,e.end)} — ${e.place}</p>
  <form id="regform" novalidate>
    <div class="row"><div class="field"><label for="rn">الاسم</label><input id="rn" type="text" autocomplete="name"><div class="msg">اكتب اسمك الكامل.</div></div>
    <div class="field"><label for="rp">الهاتف</label><input id="rp" type="tel" dir="ltr" placeholder="05X XXX XXXX"><div class="msg">رقم إماراتي يبدأ بـ 05.</div></div></div>
    <div class="field"><label for="re">البريد الإلكتروني</label><input id="re" type="email" dir="ltr"><div class="msg">بريد صحيح لإرسال التذكرة.</div></div>
    <div class="field"><span class="legend">صفتك</span><div class="opts"><label class="opt"><input type="radio" name="rm" value="member" checked><span>عضو في الجمعية</span></label>${e.membersOnly?'':'<label class="opt"><input type="radio" name="rm" value="guest"><span>غير عضو</span></label>'}</div></div>
    ${e.trip?`<div class="row"><div class="field"><label for="rct">نوع الكرفان</label><select id="rct"><option>موترهوم</option><option>مقطورة سحب</option><option>كامبر</option></select></div>
    <div class="field"><label for="rpl">رقم اللوحة</label><input id="rpl" type="text" dir="ltr"><div class="msg">أدخل رقم اللوحة.</div></div></div>
    <div class="row"><div class="field"><label for="rcm">عدد المرافقين</label><input id="rcm" type="number" min="0" max="10" value="0" dir="ltr"></div>
    <div class="field"><label for="rem">رقم للطوارئ (غير مشارك)</label><input id="rem" type="tel" dir="ltr"><div class="msg">رقم طوارئ مطلوب للرحلات.</div></div></div>
    <label class="check"><input type="checkbox" id="rsafe">أقر بشروط السلامة وجاهزية الكرفان، وبالالتزام بتعليمات قائد القافلة.</label>
    <div class="field" id="f-rsafe"><div class="msg">يلزم الإقرار بشروط السلامة.</div></div>`:''}
    <div class="fees-calc" id="regcost" style="margin:8px 0 16px"></div>
    <button class="cta" type="submit">${e.price.member||e.price.guest?'أكّد التسجيل':'احجز مقعدي'}</button>
  </form>`;
  const f=$('#regform');
  const cost=()=>{const m=f.querySelector('input[name=rm]:checked').value;const p=m==='member'?e.price.member:e.price.guest;$('#regcost').innerHTML=`<div class="tot"><span>المبلغ</span><span>${priceTxt(p)}</span></div>`;return p};
  f.addEventListener('change',cost); cost();
  f.addEventListener('submit',ev=>{
    ev.preventDefault(); let ok=true;
    const bad=(id,b)=>{const el=document.getElementById(id);el.closest('.field').classList.toggle('bad',b);if(b)ok=false};
    bad('rn',$('#rn').value.trim().split(/\s+/).length<2);
    bad('rp',!/^(\+?971|0)5\d{8}$/.test($('#rp').value.replace(/[\s-]/g,'')));
    bad('re',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#re').value.trim()));
    if(e.trip){bad('rpl',!$('#rpl').value.trim());bad('rem',!/^(\+?971|0)\d{8,9}$/.test($('#rem').value.replace(/[\s-]/g,'')));$('#f-rsafe').classList.toggle('bad',!$('#rsafe').checked);if(!$('#rsafe').checked)ok=false}
    if(!ok){f.querySelector('.bad input')?.focus();return}
    const t={id:genId('TK'),ev:e.id,title:e.title,date:fmtRange(e.start,e.end),place:e.place,name:$('#rn').value.trim(),price:cost(),companions:e.trip?+$('#rcm').value||0:0};
    tickets.push(t); saveJ('ca-tix',tickets); renderEvents(); renderHomeEvents(); updateCounts();
    $('#regbody').innerHTML=`<h2 class="h" style="font-size:22px">تم تسجيلك</h2><p style="color:var(--muted)">${t.price?'يُرسَل رابط الدفع إلى بريدك لتأكيد الحجز. ':''}احتفظ بالتذكرة، وتجدها دائماً في <a href="#/account">حسابي</a>.</p>${ticketHTML(t)}<button class="btn2" type="button" onclick="this.closest('dialog').close()">إغلاق</button>`;
  });
  dlg.showModal(); setTimeout(()=>$('#rn')?.focus(),50);
}
function ticketHTML(t){return `<div class="ticket"><div><b>${t.title}</b><small>${t.date}</small><small>${t.place}</small><small>باسم: ${esc(t.name)}${t.companions?` + ${t.companions} مرافقين`:''}</small><small class="ref" style="margin-top:6px">${t.id}</small></div><div class="qr" aria-label="رمز QR للتذكرة">${qrSVG('CA-TICKET:'+t.id)}</div></div>`}
function renderHomeEvents(){
  $('#home-events').innerHTML=upcoming().slice(0,3).map(e=>`<a href="#/events">${evDate(e)}<div><h3>${e.title}</h3><span>${fmtRange(e.start,e.end)}</span></div></a>`).join('');
}

/* ---------- store ---------- */
const PICONS={
 shirt:'<path d="M18 10l10-4h8l10 4 8 10-8 6-4-4v34H18V22l-4 4-8-6z"/>',cap:'<path d="M10 40c0-14 10-24 22-24s22 10 22 24zM6 40h52"/>',jacket:'<path d="M20 8l12 6 12-6 12 10v40H8V18zM32 14v44"/>',
 ext:'<rect x="22" y="18" width="20" height="38" rx="6"/><path d="M28 18v-6h8v6M36 12h10"/>',alarm:'<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="6"/><path d="M32 12v4M32 48v4"/>',aid:'<rect x="10" y="18" width="44" height="34" rx="4"/><path d="M24 18v-6h16v6M32 26v18M23 35h18"/>',
 boards:'<path d="M14 12h14v42H14zM36 12h14v42H36zM14 20h14M14 28h14M36 20h14M36 28h14"/>',lamp:'<path d="M24 14h16M26 14v6h12v-6M22 20h20l-2 30H24zM28 50v6h8v-6"/>',sticker:'<rect x="10" y="16" width="44" height="32" rx="6"/><path d="M18 40l8-14 6 10 4-6 8 10"/>',coupon:'<path d="M8 20h48v8a4 4 0 0 0 0 8v8H8v-8a4 4 0 0 0 0-8z"/><path d="M26 40l12-16M26 26h0M38 38h0" stroke-width="4"/>'
};
let cart=loadJ('ca-cart',{}), pf='الكل', member=store.get('ca-member')==='1';
$('#ismember').checked=member;
const pprice=p=>p.membersOnly?0:(member?p.member:p.price);
function renderStore(){
  const cats=['الكل',...new Set(PRODUCTS.map(p=>p.cat))];
  $('#pchips').innerHTML=cats.map(c=>`<button class="chip" data-f="${c}" aria-pressed="${c===pf}">${c}</button>`).join('');
  $('#pgrid').innerHTML=PRODUCTS.filter(p=>pf==='الكل'||p.cat===pf).map(p=>{
    const dis=p.membersOnly&&!member;
    const priceH=p.membersOnly?`<span class="pp">${member?'مجاناً':'للأعضاء'}</span>`:`<span class="pp">${pprice(p)} درهم${member?`<s>${p.price}</s>`:''}</span>`;
    return `<article class="prod"><div class="pic"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${PICONS[p.icon]}</svg></div><div class="in"><span class="cat">${p.cat}</span><b>${p.name}</b><span class="d">${p.desc}</span><div class="row2">${priceH}<button class="addbtn" data-add="${p.id}" ${dis?'disabled':''}>${cart[p.id]?'أضف واحداً آخر':'أضف إلى السلة'}</button></div>${!member&&!p.membersOnly?`<span class="d" style="font-size:12.5px">للأعضاء: ${p.member} درهم</span>`:''}</div></article>`;
  }).join('');
}
$('#pchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){pf=b.dataset.f;renderStore()}});
$('#ismember').addEventListener('change',e=>{member=e.target.checked;store.set('ca-member',member?'1':'0');renderStore();renderCart()});
$('#pgrid').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;cart[b.dataset.add]=(cart[b.dataset.add]||0)+1;saveJ('ca-cart',cart);updateCounts();renderStore();b.textContent='تمت الإضافة';});
function cartTotal(){return Object.entries(cart).reduce((a,[id,q])=>{const p=PRODUCTS.find(x=>x.id===id);return a+(p?pprice(p)*q:0)},0)}
function renderCart(){
  const items=Object.entries(cart).filter(([id,q])=>q>0&&PRODUCTS.find(p=>p.id===id));
  if(!items.length){$('#cartbody').innerHTML=`<div class="empty" style="margin-top:16px">السلة فارغة. <a href="#/store" onclick="document.getElementById('cartdlg').close()">تصفّح المتجر</a></div>`;return}
  $('#cartbody').innerHTML=items.map(([id,q])=>{const p=PRODUCTS.find(x=>x.id===id);return `<div class="citem"><div><b>${p.name}</b><div class="qty"><button data-q="${id}" data-d="1" aria-label="زيادة">+</button><span>${q}</span><button data-q="${id}" data-d="-1" aria-label="إنقاص">−</button></div></div><div style="font-weight:700">${pprice(p)*q} درهم</div></div>`}).join('')+
  `<div class="ctot"><span>الإجمالي</span><span>${cartTotal()} درهم</span></div><p style="font-size:13.5px;color:var(--muted)">${member?'تُطبَّق أسعار الأعضاء ويُتحقق من العضوية عند الاستلام.':'لديك عضوية؟ فعّل أسعار الأعضاء من صفحة المتجر.'} الاستلام من مقر الجمعية أو في الفعاليات.</p><button class="cta" style="width:100%" id="checkout">أكّد الطلب</button>`;
}
$('#cartbody').addEventListener('click',e=>{
  const b=e.target.closest('[data-q]');
  if(b){const id=b.dataset.q;cart[id]=Math.max(0,(cart[id]||0)+ +b.dataset.d);if(!cart[id])delete cart[id];saveJ('ca-cart',cart);renderCart();updateCounts();renderStore();return}
  if(e.target.id==='checkout'){
    const items=Object.entries(cart).map(([id,q])=>{const p=PRODUCTS.find(x=>x.id===id);return {name:p.name,q,sum:pprice(p)*q}});
    const o={id:genId('OR'),items,total:cartTotal(),date:new Date().toLocaleDateString('ar-AE')};
    const orders=loadJ('ca-orders',[]);orders.unshift(o);saveJ('ca-orders',orders);cart={};saveJ('ca-cart',cart);updateCounts();renderStore();
    $('#cartbody').innerHTML=`<div class="okmsg on" style="margin-top:16px"><b>تم تسجيل طلبك <span class="ref">${o.id}</span></b><p style="margin:6px 0 0;color:var(--muted);font-size:14.5px">الإجمالي ${o.total} درهم. سيتواصل معك فريق الجمعية لتأكيد الدفع والاستلام. تجد الطلب في <a href="#/account" onclick="document.getElementById('cartdlg').close()">حسابي</a>.</p></div>`;
  }
});
$('#cartbtn').addEventListener('click',()=>{renderCart();$('#cartdlg').showModal()});
function updateCounts(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$('#cartcnt').textContent=n||'';}

/* ---------- directory ---------- */
let df='الكل';
function renderDir(){
  const cats=['الكل',...new Set(COMPANIES.map(c=>c.cat))];
  $('#dchips').innerHTML=cats.map(c=>`<button class="chip" data-f="${c}" aria-pressed="${c===df}">${c}</button>`).join('');
  const q=$('#dq').value.trim(), em=$('#dem').value;
  const list=COMPANIES.filter(c=>(df==='الكل'||c.cat===df)&&(!em||c.em===em)&&(!q||(c.name+c.desc+c.tags.join(' ')).includes(q)));
  $('#dlist').innerHTML=list.length?list.map(c=>`<article class="co"><div class="av" aria-hidden="true">${c.name.replace(/^ال/,'').charAt(0)}</div><div><h3>${c.name}${c.tier?`<span class="badge soft">${c.tier==='شريك'?'شريك':'راعٍ '+c.tier}</span>`:''}</h3><div class="sub">${c.cat} — ${c.em}</div><p>${c.desc}</p><div class="tags">${c.discount?`<span class="off">خصم ${c.discount} للأعضاء</span>`:''}${c.tags.map(t=>`<span>${t}</span>`).join('')}</div></div></article>`).join(''):'<div class="empty" style="grid-column:1/-1">لا توجد نتائج. جرّب كلمة أخرى أو إمارة مختلفة.</div>';
}
$('#dchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){df=b.dataset.f;renderDir()}});
$('#dq').addEventListener('input',renderDir);$('#dem').addEventListener('change',renderDir);
const tierCls={'ذهبي':'g','فضي':'s','شريك':'p'};
const spHTML=COMPANIES.filter(c=>c.tier).sort((a,b)=>'ذهبيفضيشريك'.indexOf(a.tier)-'ذهبيفضيشريك'.indexOf(b.tier)).map(c=>`<div class="sp"><span class="tier ${tierCls[c.tier]}">${c.tier==='شريك'?'شريك':'راعٍ '+c.tier}</span><b>${c.name}</b><small style="color:var(--muted)">${c.cat}</small></div>`).join('');
$('#sponsors').innerHTML=spHTML; const hsp=$('#home-sponsors'); hsp.classList.add('marq'); hsp.innerHTML=`<div class="track">${spHTML}${spHTML.replace(/class="sp"/g,'class="sp" aria-hidden="true"')}</div>`;
$('#invest').innerHTML=INVEST.map(i=>`<div><small>${i.k}</small><h3>${i.t}</h3><p>${i.d}</p><a class="more" style="font-weight:600;font-size:14.5px" href="#/contact?type=partner">أبدِ اهتمامك</a></div>`).join('');

/* ---------- community ---------- */
let topics=[...loadJ('ca-topics',[]),...TOPICS], tf='الكل', myReplies=loadJ('ca-replies',{});
function renderTopics(){
  const cats=['الكل','التجهيز','المواقع','الصيانة','الرحلات'];
  $('#tchips').innerHTML=cats.map(c=>`<button class="chip" data-f="${c}" aria-pressed="${c===tf}">${c}</button>`).join('');
  $('#topics').innerHTML=topics.filter(t=>tf==='الكل'||t.cat===tf).map(t=>{const reps=[...t.replies,...(myReplies[t.id]||[])];return `<details><summary><div><b>${esc(t.title)}</b><small>${t.cat} — ${esc(t.by)} — ${t.ago}</small></div><div class="rc"><b>${reps.length}</b><br>ردود</div></summary><div class="post"><div class="msg1">${esc(t.body)}</div>${reps.map(r=>`<div class="reply"><b>${esc(r[0])}</b>${esc(r[1])}</div>`).join('')}<form class="replyform" data-t="${t.id}"><input type="text" placeholder="اكتب رداً" aria-label="اكتب رداً"><button class="addbtn" type="submit">رد</button></form></div></details>`}).join('');
}
$('#tchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){tf=b.dataset.f;renderTopics()}});
$('#topics').addEventListener('submit',e=>{e.preventDefault();const f=e.target.closest('.replyform');const v=f.querySelector('input').value.trim();if(v.length<2)return;(myReplies[f.dataset.t]=myReplies[f.dataset.t]||[]).push(['أنت',v]);saveJ('ca-replies',myReplies);const open=f.dataset.t;renderTopics();$(`.replyform[data-t="${open}"]`).closest('details').open=true});
$('#newtopic').addEventListener('click',()=>{$('#tform').hidden=false;$('#tt').focus()});
$('#tcancel').addEventListener('click',()=>{$('#tform').hidden=true});
$('#tform').addEventListener('submit',e=>{
  e.preventDefault();let ok=true;const bad=(id,b)=>{$(id).closest('.field').classList.toggle('bad',b);if(b)ok=false};
  bad('#tt',$('#tt').value.trim().length<5);bad('#tb',$('#tb').value.trim().length<10);if(!ok)return;
  const t={id:genId('T'),cat:$('#tc').value,title:$('#tt').value.trim(),by:$('#ta').value.trim()||'عضو',ago:'الآن',body:$('#tb').value.trim(),replies:[]};
  const mine=loadJ('ca-topics',[]);mine.unshift(t);saveJ('ca-topics',mine);topics.unshift(t);$('#tform').reset();$('#tform').hidden=true;tf='الكل';renderTopics();
});
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button').forEach(x=>{const on=x===b;x.setAttribute('aria-selected',on);document.getElementById(x.getAttribute('aria-controls')).hidden=!on})}));
let myRev=loadJ('ca-reviews',{});
const allRev=id=>[...(REVIEWS[id]||[]),...(myRev[id]||[])];
const avg=id=>{const r=allRev(id);return r.length?r.reduce((a,x)=>a+x[1],0)/r.length:0};
const starsH=n=>{const r=Math.round(n);return `<span class="stars" aria-label="${n.toFixed(1)} من 5">${'★'.repeat(r)}<span class="off">${'★'.repeat(5-r)}</span></span>`};
function renderReviews(){
  $('#rvgrid').innerHTML=SITES.map(s=>`<article class="rvc" id="rv-${s.id}"><h3><span>${s.name}</span><span>${starsH(avg(s.id))} <small style="color:var(--muted);font-size:13px">${avg(s.id).toFixed(1)} (${allRev(s.id).length})</small></span></h3>${allRev(s.id).map(r=>`<div class="rv"><b>${esc(r[0])}</b> ${starsH(r[1])}<p>${esc(r[2])}</p></div>`).join('')}<form class="rvform" data-s="${s.id}"><div class="starpick" role="radiogroup" aria-label="تقييمك">${[1,2,3,4,5].map(n=>`<button type="button" data-v="${n}" aria-label="${n} نجوم">★</button>`).join('')}</div><input type="text" placeholder="اكتب تقييمك للموقع" aria-label="تقييمك"><button class="addbtn" type="submit">أضف تقييمي</button></form></article>`).join('');
}
$('#rvgrid').addEventListener('click',e=>{const b=e.target.closest('.starpick button');if(!b)return;const p=b.parentElement;p.dataset.v=b.dataset.v;p.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.v<=+b.dataset.v))});
$('#rvgrid').addEventListener('submit',e=>{e.preventDefault();const f=e.target;const v=+(f.querySelector('.starpick').dataset.v||0);const t=f.querySelector('input').value.trim();if(!v||t.length<3){f.querySelector('input').placeholder='اختر النجوم واكتب تعليقاً';return}(myRev[f.dataset.s]=myRev[f.dataset.s]||[]).push(['أنت',v,t]);saveJ('ca-reviews',myRev);renderReviews();renderSites()});

/* ---------- account ---------- */
function renderAccount(){
  tickets=loadJ('ca-tix',[]);
  $('#mytix').innerHTML=tickets.length?tickets.slice().reverse().map(ticketHTML).join(''):`<div class="empty">لا توجد تذاكر بعد. <a href="#/events">تصفّح الفعاليات القادمة</a></div>`;
  const orders=loadJ('ca-orders',[]);
  $('#myord').innerHTML=orders.length?orders.map(o=>`<div class="ticket" style="grid-template-columns:1fr"><div><b>طلب <span class="ref">${o.id}</span></b><small>${o.date} — قيد التأكيد</small>${o.items.map(i=>`<small>${i.name} × ${i.q} — ${i.sum} درهم</small>`).join('')}<small style="font-weight:700;color:var(--text)">الإجمالي: ${o.total} درهم</small></div></div>`).join(''):`<div class="empty">لا توجد طلبات بعد. <a href="#/store">زر المتجر</a></div>`;
}

renderEvents();renderHomeEvents();renderStore();renderDir();renderTopics();renderReviews();updateCounts();

window.__siteRating=id=>{const r=allRev(id);return r.length?`<p style="margin:8px 0 0">${starsH(avg(id))} <a href="#/community" style="font-size:13.5px;color:var(--muted)">${avg(id).toFixed(1)} من ${r.length} تقييمات</a></p>`:''};renderSites();
/* ---------- router ---------- */
const LEGACY={'#about':'about','#sites':'sites','#membership':'membership','#events':'events','#governance':'governance','#join':'join','#contact':'contact','#home':''};
function route(){
  let h=location.hash||'#/';
  if(LEGACY[h]!==undefined){location.replace('#/'+LEGACY[h]);return}
  if(!h.startsWith('#/')) return;
  const [path,qs]=h.slice(2).split('?'); const parts=path.split('/').filter(Boolean);
  let page=parts[0]||'home', ok=true;
  if(page==='account')renderAccount();
  if(page==='knowledge'&&parts[1]){ok=renderArticle(parts[1]);page='article'}
  if(page==='verify'&&parts[1]){const n=decodeURIComponent(parts[1]);$('#vno').value=n;verify(n)}
  if(page==='contact'&&qs){const t=new URLSearchParams(qs).get('type');const r=cform.querySelector(`input[name=ktype][value="${t}"]`);if(r){r.checked=true;ktypeSync()}}
  let el=document.getElementById('p-'+page); if(!el||!ok) el=$('#p-404');
  const swap=()=>$$('.page').forEach(p=>p.classList.toggle('on',p===el));
  const prev=$('.page.on');
  if(prev&&prev!==el&&document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.startViewTransition(swap)}else swap();
  const key=el.id.slice(2);
  $$('.nav a').forEach(a=>{const on=(a.dataset.r||'').split(' ').includes(key);a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.title=(key==='home'?'':(key==='article'?$('#a-title').textContent:el.dataset.title)+' | ')+'جمعية الكرفانات';
  window.scrollTo(0,0);
  $('#main').focus({preventScroll:true});
  window.dispatchEvent(new CustomEvent('ca:page',{detail:el}));
}
window.addEventListener('hashchange',route); route();
})();
