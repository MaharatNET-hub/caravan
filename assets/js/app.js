(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const loadJ=(k,d)=>{try{return JSON.parse(store.get(k)||'null')??d}catch(e){return d}};
const saveJ=(k,v)=>store.set(k,JSON.stringify(v));
const year=new Date().getFullYear();
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return {y,m,d}};
const fmtDay=s=>{const x=pd(s);return `${x.d} ${MONTHS[x.m-1]} ${x.y}`};
const fmtRange=(a,b)=>{const x=pd(a),y=pd(b);if(a===b)return fmtDay(a);if(x.m===y.m)return `${x.d}–${y.d} ${MONTHS[x.m-1]} ${x.y}`;return `${x.d} ${MONTHS[x.m-1]} – ${y.d} ${MONTHS[y.m-1]} ${y.y}`};
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const genId=p=>p+'-'+Date.now().toString(36).toUpperCase().slice(-6);
const fmtSize=b=>b<1024*1024?Math.max(1,Math.round(b/1024))+' ك.ب':(b/1024/1024).toFixed(1)+' م.ب';
const isURL=v=>/^https:\/\/\S+\.\S+/i.test(v);
const telHref=v=>'tel:'+v.replace(/[^\d+]/g,'');
const waHref=v=>'https://wa.me/'+v.replace(/\D/g,'');
const igHref=v=>'https://www.instagram.com/'+v.replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/\/$/,'')+'/';
$('#yr').textContent=year;
const cexp=$('#c-exp'); if(cexp) cexp.textContent='31 ديسمبر '+year;
let toastT;
function toast(msg){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),4200)}

/* ---------- theme & nav ---------- */
const setTheme=v=>{document.documentElement.dataset.theme=v;store.set('ca-theme',v);$$('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeSet===v))};
setTheme(store.get('ca-theme')==='dark'?'dark':'light');
$$('[data-theme-set]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeSet)));
const nav=$('#nav'), burger=$('#burger');
burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
nav.addEventListener('click',e=>{if(e.target.tagName==='A'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

/* ---------- النظام الأساسي المعتمد (حسابي ونموذج العضوية) ---------- */
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-statute]'); if(!a) return; e.preventDefault();
  if(SETTINGS.statutePdf) window.open(SETTINGS.statutePdf,'_blank','noopener');
  else toast('نسخة توضيحية: يُرفع ملف النظام الأساسي المعتمد هنا عند الإطلاق.');
});

/* ---------- news ---------- */
const newsDate=n=>n.date?`<time datetime="${n.date}">${fmtDay(n.date)}</time>`:'<span class="nodate">تاريخ النشر يُضاف</span>';
function newsHTML(list){return list.map(n=>`<article><a class="thumb" href="#/news/${n.id}" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">${ART[n.art]}</svg></a><div><div class="kind">${n.cat}<span class="dot" aria-hidden="true">·</span>${newsDate(n)}</div><h3><a href="#/news/${n.id}">${n.title}</a></h3><p>${n.body}</p><a class="more" href="#/news/${n.id}">اقرأ المزيد</a></div></article>`).join('')}
$('#home-news').innerHTML=newsHTML(NEWS.slice(0,3));
function renderNews(f){$('#news').innerHTML=newsHTML(NEWS.filter(n=>f==='all'||n.cat===f))}
renderNews('all');
$('#nchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('#nchips .chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderNews(b.dataset.f)});
function renderNewsItem(id){
  const n=NEWS.find(x=>x.id===id); if(!n) return false;
  $('#n-crumb').textContent=n.title; $('#n-title').textContent=n.title;
  $('#n-date').innerHTML=`${n.cat} — ${n.date?'نُشر في '+fmtDay(n.date):'تاريخ النشر يُضاف'}`;
  $('#n-img').innerHTML=n.imgs&&n.imgs.length?n.imgs.map(src=>`<img src="${esc(src)}" alt="" loading="lazy">`).join(''):`<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART[n.art]}</svg>`;
  $('#n-body').innerHTML=(n.full||n.body).split(/\n\s*\n/).map(p=>`<p>${p}</p>`).join('');
  return true;
}

$('#chapters').innerHTML=CHAPTERS.map((c,i)=>`<details${i===0?' open':''}><summary><span class="no">الباب ${i+1}</span><b>${c.t}<small>${c.a}</small></b></summary><div class="body"><dl>${c.items.map(x=>`<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join('')}</dl></div></details>`).join('');
$('#privacy').innerHTML=PRIVACY.map(x=>`<h2>${x[0]}</h2>${x[1]}`).join('');
$('#rereg-note').textContent=SETTINGS.reregJoinFee==null?'إعادة التسجيل بعد انتهاء العضوية: يُحدَّد رسم الانضمام وفق الإجراء الذي تعتمده الجمعية، ويُوضَّح كل رسم بشكل منفصل قبل إرسال الطلب.':(SETTINGS.reregJoinFee?`إعادة التسجيل بعد انتهاء العضوية: يُحصَّل رسم الانضمام (${SETTINGS.reregJoinFee} درهم) مرة ثانية.`:'إعادة التسجيل بعد انتهاء العضوية: لا يُحصَّل رسم الانضمام مرة ثانية.');

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


/* التحقق التجريبي من رقم العضوية — يُستبدل بواجهة سجل الأعضاء */
const normMem=n=>n.trim().toUpperCase().replace(/\s/g,'').replace(/^CA-?/,'CA-');
const memberOk=n=>normMem(n)==='CA-1001';

/* ---------- picked images (contact report, company logo) ---------- */
const IMG_RX=/\.(jpe?g|png|webp)$/i, IMG_MIME=/^image\/(jpeg|png|webp)$/;
const imgOk=f=>IMG_RX.test(f.name)&&(!f.type||IMG_MIME.test(f.type));

/* contact */
const cform=$('#cform'); let kimgs=[];
const RI=SETTINGS.reportImages;
$('#kimg-hint').textContent=`حتى ${RI.max} صور بصيغة JPG أو PNG أو WEBP، وبحد أقصى ${RI.maxMB} ميجابايت للصورة.`;
const ktypeSync=()=>{
  const v=cform.elements.ktype.value, loc=v==='report'||v==='suggest';
  $('#f-kloc').hidden=!loc; $('#f-kmap').hidden=!loc; $('#f-kimg').hidden=!loc;
  $('#f-kplace').hidden=!loc||cform.elements.kloc.value!=='other';
  $('#kmsg-l').textContent={inquiry:'رسالتك',report:'وصف البلاغ: ماذا لاحظت ومتى؟',suggest:'وصف الموقع المقترح ومكانه'}[v];
};
cform.addEventListener('change',e=>{if(e.target.id!=='kimg')ktypeSync()}); ktypeSync();
function renderKimgs(){$('#kthumbs').innerHTML=kimgs.map((x,i)=>`<figure><img src="${x.url}" alt=""><figcaption>${esc(x.f.name)} — ${fmtSize(x.f.size)}</figcaption><button type="button" class="x" data-rm="${i}" aria-label="إزالة الصورة">×</button></figure>`).join('')}
$('#kimg').addEventListener('change',e=>{
  const msg=[]; Array.from(e.target.files||[]).forEach(f=>{
    if(kimgs.length>=RI.max){msg.push(`الحد الأقصى ${RI.max} صور.`);return}
    if(!imgOk(f)){msg.push(`«${f.name}»: صيغة الملف غير مدعومة. يرجى اختيار JPG أو PNG أو WEBP.`);return}
    if(f.size>RI.maxMB*1024*1024){msg.push(`«${f.name}»: حجم الملف يتجاوز ${RI.maxMB} ميجابايت. يرجى رفع صورة بحجم أصغر.`);return}
    kimgs.push({f,url:URL.createObjectURL(f)});
  });
  e.target.value=''; $('#kimg-msg').textContent=[...new Set(msg)].join(' '); $('#f-kimg').classList.toggle('bad',!!msg.length); renderKimgs();
});
$('#kthumbs').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b)return;URL.revokeObjectURL(kimgs[+b.dataset.rm].url);kimgs.splice(+b.dataset.rm,1);renderKimgs();$('#f-kimg').classList.remove('bad')});
cform.addEventListener('submit',e=>{
  e.preventDefault(); const v=cform.elements; let ok=true;
  const bad=(id,b)=>{v[id].closest('.field').classList.toggle('bad',b);if(b)ok=false};
  const loc=!$('#f-kloc').hidden;
  bad('kname',v.kname.value.trim().length<2);
  bad('kphone',!/^(\+?971|0)5\d{8}$/.test(v.kphone.value.replace(/[\s-]/g,'')));
  bad('kmail',!!v.kmail.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.kmail.value.trim()));
  if(loc){
    bad('kloc',v.kloc.value==='' && v.ktype.value==='report');
    bad('kplace',!$('#f-kplace').hidden&&v.kplace.value.trim().length<2);
    const m=v.kmap.value.trim(); bad('kmap',!!m&&!isURL(m)&&!/^-?\d{1,2}(\.\d+)?\s*[,،]\s*-?\d{1,3}(\.\d+)?$/.test(m));
  }
  bad('ksub',v.ksub.value.trim().length<3);
  bad('kmsg',v.kmsg.value.trim().length<20);
  if(!ok){cform.querySelector('.bad input,.bad select,.bad textarea').focus();return}
  const d=new Date(), ref=`CA-${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000+Math.random()*9000)}`;
  const label={inquiry:'استفسار',report:'بلاغ',suggest:'اقتراح موقع'}[v.ktype.value];
  const extra=loc?[v.kloc.value==='other'?'الموقع: '+v.kplace.value.trim():(v.kloc.value?'الموقع: '+v.kloc.value:''),v.kmap.value.trim()?'الخريطة: '+v.kmap.value.trim():'',kimgs.length?`الصور المرفقة: ${kimgs.length}`:''].filter(Boolean):[];
  $('#cok').innerHTML=`<b>تم استلام ${label==='استفسار'?'رسالتك':label==='بلاغ'?'بلاغك':'اقتراحك'} — الرقم المرجعي <span class="ref">${ref}</span></b>${extra.length?`<p style="margin:8px 0 0;font-size:14.5px">${extra.map(esc).join('<br>')}</p>`:''}<p style="margin:8px 0 12px;color:var(--muted);font-size:15px">في النسخة النهائية تصل الرسالة مباشرة إلى بريد الجمعية وإلى لوحة التحكم، ويتابعها الفريق المختص ويرد عليك عبر الهاتف أو البريد. احتفظ بالرقم المرجعي للمتابعة. (في هذه النسخة التوضيحية لا تُرسل الرسالة فعلياً.)</p><p style="margin:0;font-size:14px;color:var(--muted)">التواصل عبر إنستغرام اختياري: <a href="https://ig.me/m/caravan_association" target="_blank" rel="noopener" dir="ltr">@caravan_association</a></p>`;
  $('#cok').classList.add('on');
});

/* ---------- join form ---------- */
const form=$('#form'), steps=$$('.fstep'), bars=$$('.progress i'); let cur=0;
const LAST=steps.length-1;
const val=n=>{const el=form.elements[n]; if(!el) return ''; if(el instanceof RadioNodeList) return el.value; if(el.type==='checkbox') return el.checked; return el.value.trim()};
const isUAE=()=>val('nat')==='الإمارات العربية المتحدة';
const isMember=()=>val('cat')==='عضو منتسب';
const isJoin=()=>val('req')==='طلب انضمام جديد';
const isRereg=()=>val('req')==='إعادة التسجيل';
const isNew=()=>isJoin()||isRereg();
const isFounder=()=>val('req')==='تحديث بيانات عضو مؤسس';
const noCaravan=()=>val('ctype').startsWith('لا أملك');
const caravanReq=()=>SETTINGS.caravanRequired[val('ctype')]||[];
$('#dob').max=todayISO();
$('#dob-hint').textContent=`يُشترط بلوغ سن الرشد وفق التشريعات السارية (${SETTINGS.minAge} سنة).`;
function sync(){
  $('#f-memno').hidden=isNew();
  const nat=val('nat'); $('#f-pass').hidden=!nat||isUAE(); $('#resident-conds').hidden=!nat||isUAE();
  $('#caravan').hidden=!isMember();
  $('#caravan-detail').hidden=noCaravan(); $('#caravan-hint').hidden=noCaravan(); $('#caravan-ex').hidden=!noCaravan();
  const rq=caravanReq(); $$('#caravan-detail [data-cf]').forEach(f=>f.classList.toggle('isreq',rq.includes(f.dataset.cf)));
  $('#c-name').textContent=val('name')||'اسم العضو'; $('#c-type').textContent=val('cat'); calc(); renderExDoc();
}
/* بنود الرسوم المعروضة في خطوة الرسوم وفي المراجعة */
function fees(){
  if(isFounder()) return {rows:[['رسم الانضمام','0 درهم'],['الاشتراك السنوي','0 درهم']],tot:['الإجمالي','0 درهم'],note:'الأعضاء المؤسسون معفون من الرسوم (المادة 49/3).',ex:false};
  const annual=isMember()?320:300, months=12-new Date().getMonth(), first=isNew();
  const sub=first?Math.round(annual*months/12):annual, ex=!!(val('ex1')||val('ex2'));
  const rows=[]; let join=0, pending=false;
  if(isJoin()){join=300;rows.push(['رسم الانضمام (مرة واحدة)','300 درهم'])}
  if(isRereg()){const r=SETTINGS.reregJoinFee;if(r==null){pending=true;rows.push(['رسم الانضمام عند إعادة التسجيل','يُحدَّد من الجمعية'])}else if(r){join=r;rows.push(['رسم الانضمام عند إعادة التسجيل',r+' درهم'])}}
  rows.push([`الاشتراك السنوي — ${val('cat')}${first?` (تقديري: ${months} ${months>2&&months<11?'أشهر':'شهراً'})`:''}`,sub+' درهم']);
  const tot=[first?(pending?'الإجمالي التقديري (دون رسم الانضمام)':'الإجمالي التقديري'):'الإجمالي المستحق',(join+sub)+' درهم'];
  let note=first?'مبلغ السنة الأولى تقديري، ويُحتسب نهائياً من تاريخ الانضمام بعد قبول الطلب، وأي جزء من الشهر يُحسب شهراً كاملاً.':'التجديد يشمل الاشتراك السنوي المستحق فقط عن سنة كاملة تبدأ في 1 يناير وتنتهي في 31 ديسمبر، مع أي إعفاء معتمد.';
  if(pending) note+=' رسم الانضمام عند إعادة التسجيل يُحدَّد وفق الإجراء الذي تعتمده الجمعية، ويُبلَّغ لك قبل السداد.';
  return {rows,tot,note,ex};
}
function feesHTML(f){return f.rows.map(r=>`<div><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')+`<div class="tot"><span>${f.tot[0]}</span><span>${f.tot[1]}</span></div>`+(f.ex?`<div class="exnote">طلب الإعفاء يُعرض على مجلس الإدارة والجمعية العمومية، وتقديمه لا يعني الموافقة (المادة 49/4).</div>`:'')}
function calc(){
  $('#f-ex').hidden=isFounder();
  const f=fees(); $('#calc').innerHTML=feesHTML(f); $('#calcnote').textContent=f.note;
}
function setBad(id,b){const el=form.elements[id];const f=el&&(el.closest?el.closest('.field'):null);if(f)f.classList.toggle('bad',b);return !b}
const ageOn=(dob,now)=>now.getFullYear()-dob.getFullYear()-((now.getMonth()<dob.getMonth()||(now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate()))?1:0);
function dobError(){
  const v=val('dob'); if(!v) return 'يرجى إدخال تاريخ الميلاد.';
  const d=new Date(v+'T00:00:00'), now=new Date();
  if(isNaN(d)||d.getFullYear()<1900) return 'يرجى إدخال تاريخ ميلاد صحيح.';
  if(v>todayISO()) return 'يرجى إدخال تاريخ ميلاد صحيح، لا يمكن أن يكون في المستقبل.';
  if(ageOn(d,now)<SETTINGS.minAge) return 'لا يمكن إكمال الطلب لأن العمر لا يستوفي شرط العضوية.';
  return '';
}
function validate(i){
  let ok=true;
  if(i===0&&!isNew()) ok=setBad('memno',!val('memno'))&&ok;
  if(i===1){
    ok=setBad('name',val('name').split(/\s+/).length<2)&&ok;
    ok=setBad('eid',!/^784\d{12}$/.test(val('eid').replace(/[\s-]/g,'')))&&ok;
    const de=dobError(); if(de) $('#dob-msg').textContent=de; ok=setBad('dob',!!de)&&ok;
    ok=setBad('nat',!val('nat'))&&ok;
    if(!isUAE()&&val('nat')) ok=setBad('pass',!val('pass'))&&ok;
  }
  if(i===2){
    ok=setBad('phone',!/^(\+?971|0)5\d{8}$/.test(val('phone').replace(/[\s-]/g,'')))&&ok;
    ok=setBad('email',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')))&&ok;
    ok=setBad('emirate',!val('emirate'))&&ok;
    let cv=true;
    if(isMember()){
      if(noCaravan()) cv=setBad('exwhy',val('exwhy').length<20)&&cv;
      else{
        const rq=caravanReq(), yr=+val('year');
        $$('#caravan-detail [data-cf]').forEach(f=>f.classList.remove('bad'));
        rq.forEach(k=>{cv=setBad(k,k==='year'?!(yr>=1960&&yr<=year+1):!val(k))&&cv});
        if(!rq.includes('year')&&val('year')) cv=setBad('year',!(yr>=1960&&yr<=year+1))&&cv;
      }
    }
    $('#f-caravan').classList.toggle('bad',!cv); ok=ok&&cv;
  }
  if(i===3){const miss=docList().filter(d=>d.req&&!files[d.k]);$('#f-docs').classList.toggle('bad',!!miss.length);ok=!miss.length;if(!ok){const b=$(`#docs [data-doc="${miss[0].k}"] input`);if(b)b.focus()}}
  if(i===4){let all=['d1','d2','d3','d4','d5'].every(val); if(!isUAE()) all=all&&['r1','r2','r3'].every(val); $('#f-decl').classList.toggle('bad',!all); ok=all}
  if(!ok&&i!==3){const b=steps[i].querySelector('.bad input,.bad select,.bad textarea');if(b)b.focus()}
  return ok;
}
/* المستندات المطلوبة حسب نوع الطلب والفئة والجنسية (النموذج ع/01، القسم ب) */
const files={};
function docList(){
  const L=[];
  if(isNew()){
    L.push({k:'eid',t:'صورة بطاقة الهوية الإماراتية',req:true},{k:'photo',t:'صورة شخصية حديثة',req:true});
    if(isMember()){ if(noCaravan()) L.push({k:'own',t:'ما يدعم طلب الاستثناء من شرط ملكية الكرفان',req:false,note:'اخترت طلب الاستثناء في الخطوة 3، ويقرره مجلس الإدارة.'}); else L.push({k:'own',t:'مستند رسمي يثبت ملكية الكرفان',req:true}); }
    if(val('nat')&&!isUAE()) L.push({k:'pass',t:'صورة جواز السفر',req:true},{k:'res',t:'صورة الإقامة السارية',req:true},{k:'res3',t:'مستند رسمي يثبت الإقامة في الدولة مدة لا تقل عن 3 سنوات سابقة',req:true});
  }else{
    L.push({k:'card',t:'بطاقة العضوية السابقة',req:true},{k:'chg',t:'المستندات التي تغيّرت أو انتهت صلاحيتها فقط (إن وُجدت)',req:false});
  }
  return L;
}
const EXDOC={k:'exd',t:'مستند رسمي يثبت أنك من كبار المواطنين أو من أصحاب الهمم',req:false,note:'يُرفق مع طلب الإعفاء'};
const docRow=d=>`<div class="doc${files[d.k]?' ok':''}" data-doc="${d.k}"><div class="dt"><b>${d.t}</b><small>${d.req?'إلزامي':'اختياري'}${d.note?' — '+d.note:''}</small><span class="fn">${files[d.k]?`${esc(files[d.k].name)} — ${fmtSize(files[d.k].size)}`:'لم يُختر ملف بعد'}</span></div><label class="btn2 up">${files[d.k]?'تغيير الملف':'اختر ملفاً'}<input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" aria-label="${d.t}"></label></div>`;
function renderDocs(){$('#docs').innerHTML=docList().map(docRow).join('');renderExDoc()}
const exReq=()=>!isFounder()&&!!(val('ex1')||val('ex2'));
function renderExDoc(){const ex=exReq(); $('#exdoc').hidden=!ex; if(ex) $('#exdoc').innerHTML=docRow(EXDOC)}
function onFile(e){
  const inp=e.target; if(inp.type!=='file') return; e.stopPropagation();
  const row=inp.closest('[data-doc]'), f=inp.files&&inp.files[0]; if(!row||!f) return;
  if(!/\.(pdf|jpe?g|png)$/i.test(f.name)){row.querySelector('.fn').textContent='صيغة غير مقبولة. اختر ملف PDF أو JPG أو PNG.';row.classList.add('err');inp.value='';return}
  files[row.dataset.doc]={name:f.name,size:f.size}; if(row.closest('#exdoc')) renderExDoc(); else renderDocs(); $('#f-docs').classList.remove('bad');
}
const stopFileInput=e=>{if(e.target.type==='file')e.stopPropagation()};
[$('#docs'),$('#exdoc')].forEach(el=>{el.addEventListener('change',onFile,true);el.addEventListener('input',stopFileInput,true)});

/* خطوة «راجع طلبك قبل الإرسال» */
function reviewSections(){
  const S=[];
  const r0=[['نوع الطلب',val('req')],['فئة العضوية',val('cat')]]; if(!isNew()) r0.push(['رقم العضوية الحالي',val('memno')]);
  S.push({t:'نوع الطلب وفئة العضوية',go:0,rows:r0});
  const r1=[['الاسم',val('name')],['رقم الهوية',val('eid')],['تاريخ الميلاد',val('dob')?fmtDay(val('dob')):''],['الجنسية',val('nat')]]; if(val('nat')&&!isUAE()) r1.push(['رقم جواز السفر',val('pass')]);
  S.push({t:'البيانات الشخصية',go:1,rows:r1});
  S.push({t:'بيانات الاتصال والعنوان',go:2,rows:[['الهاتف',val('phone')],['البريد الإلكتروني',val('email')],['المهنة',val('job')],['وسيلة الإخطار',val('notify')],['الإمارة',val('emirate')],['المدينة',val('city')]]});
  if(isMember()) S.push(noCaravan()?{t:'طلب الاستثناء من ملكية الكرفان',go:2,rows:[['الحالة','لا أملك كرفاناً (طلب استثناء)'],['المبررات',val('exwhy')]]}:{t:'بيانات الكرفان',go:2,rows:[['نوع الكرفان',val('ctype')],['سنة الصنع',val('year')],['بلد الصنع',val('made')],['إمارة التسجيل',val('cemirate')],['رقم اللوحة',val('plate')]]});
  const docs=docList().concat(exReq()?[EXDOC]:[]);
  S.push({t:'المرفقات',go:3,rows:docs.map(d=>[d.t,files[d.k]?files[d.k].name:(d.req?'لم يُرفق':'— (اختياري)')])});
  const f=fees(); const r5=f.rows.slice(); r5.push(f.tot);
  if(!isFounder()) r5.push(['طلب الإعفاء',exReq()?[val('ex1')?'كبار المواطنين':'',val('ex2')?'أصحاب الهمم':''].filter(Boolean).join('، ')+' — يُعرض على مجلس الإدارة والجمعية العمومية':'لا يوجد']);
  S.push({t:'الرسوم والإعفاء المطلوب',go:5,rows:r5});
  return S;
}
function renderReview(){$('#review').innerHTML=reviewSections().map(s=>`<section class="rvsec"><header><h4>${s.t}</h4><button type="button" class="btn2 sm" data-go="${s.go}">تعديل</button></header><div class="summary">${s.rows.map(r=>`<div><span>${r[0]}</span><span>${esc(r[1]||'—')}</span></div>`).join('')}</div></section>`).join('')}
$('#review').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){show(+b.dataset.go);$('#p-join .formbox').scrollIntoView({behavior:'smooth',block:'start'})}});

function show(i){
  cur=i; if(i===3) renderDocs(); if(i===5) renderExDoc(); if(i===LAST) renderReview();
  steps.forEach((s,k)=>s.classList.toggle('on',k===i)); bars.forEach((b,k)=>b.classList.toggle('on',k<=i));
  $('#steplabel').textContent=`الخطوة ${i+1} من ${steps.length}: ${steps[i].dataset.title}`;
  $('#prev').hidden=i===0; $('#next').textContent=i===LAST?'إرسال طلب العضوية':'التالي';
}
$('#next').addEventListener('click',()=>{if(!validate(cur))return;if(cur<LAST){show(cur+1);$('#p-join .formbox').scrollIntoView({behavior:'smooth',block:'start'})}else finish()});
$('#prev').addEventListener('click',()=>show(Math.max(0,cur-1)));

/* المسودة: تُحفظ فقط عند الضغط على «حفظ الطلب كمسودة»، وتظهر في حسابي */
function collect(){const d={};Array.from(form.elements).forEach(el=>{if(!el.name||el.type==='file')return;if(el.type==='radio'){if(el.checked)d[el.name]=el.value}else if(el.type==='checkbox')d[el.name]=el.checked;else d[el.name]=el.value});return d}
function apply(d){Array.from(form.elements).forEach(el=>{if(!el.name||!(el.name in d))return;if(el.type==='radio')el.checked=el.value===d[el.name];else if(el.type==='checkbox')el.checked=!!d[el.name];else el.value=d[el.name]})}
const fmtStamp=iso=>{const d=new Date(iso);return d.toLocaleDateString('ar-AE')+' '+d.toLocaleTimeString('ar-AE',{hour:'2-digit',minute:'2-digit'})};
function renderDraftBar(){
  const dr=loadJ('ca-draft',null), bar=$('#draftbar');
  bar.hidden=!dr; if(!dr) return;
  bar.innerHTML=`<span><b>مسودة غير مكتملة</b> — آخر حفظ ${fmtStamp(dr.at)}. لا تدخل المسودة مرحلة المراجعة إلا بعد إرسالها.</span><button type="button" class="btn2 sm" id="dropdraft">حذف المسودة والبدء من جديد</button>`;
}
$('#draftbar').addEventListener('click',e=>{if(e.target.id==='dropdraft'){store.del('ca-draft');resetForm();toast('حُذفت المسودة.')}});
$('#savedraft').addEventListener('click',()=>{saveJ('ca-draft',{data:collect(),files:{...files},step:cur,at:new Date().toISOString()});renderDraftBar();toast('تم حفظ طلبك كمسودة. يمكنك استكماله لاحقاً من «حسابي».')});
function finish(){
  const no=`${year}/${String(Math.floor(1000+Math.random()*9000))}`;
  $('#appno').textContent=no;
  $('#summary').innerHTML=[['نوع الطلب',val('req')],['فئة العضوية',val('cat')],['الاسم',val('name')],['المستندات المرفقة',Object.keys(files).filter(k=>docList().some(d=>d.k===k)||(k==='exd'&&exReq())).length+' ملف'],['تاريخ التقديم',new Date().toLocaleDateString('ar-AE')]].map(r=>`<div><span>${r[0]}</span><span>${esc(r[1]||'—')}</span></div>`).join('');
  const apps=loadJ('ca-apps',[]); apps.unshift({no,req:val('req'),cat:val('cat'),name:val('name'),date:new Date().toLocaleDateString('ar-AE')}); saveJ('ca-apps',apps);
  store.del('ca-draft'); renderDraftBar();
  form.style.display='none';$('.progress').style.display='none';$('#steplabel').style.display='none';$('#done').classList.add('on');
}
function resetForm(){form.reset();Object.keys(files).forEach(k=>delete files[k]);form.style.display='';$('.progress').style.display='';$('#steplabel').style.display='';$('#done').classList.remove('on');$$('#form .bad').forEach(f=>f.classList.remove('bad'));renderDraftBar();sync();show(0)}
$('#restart').addEventListener('click',resetForm);
form.addEventListener('input',sync);form.addEventListener('change',sync);
store.del('ca-form'); /* الحفظ التلقائي القديم */
function loadDraft(){const dr=loadJ('ca-draft',null);Object.keys(files).forEach(k=>delete files[k]);if(!dr){form.reset();return 0}form.reset();apply(dr.data||{});Object.assign(files,dr.files||{});return Math.min(dr.step||0,LAST)}
const startStep=loadDraft(); renderDraftBar(); sync(); show(startStep);

/* ---------- QR ---------- */
let qrLoading=null;
const loadQR=()=>qrLoading||(qrLoading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='assets/js/vendor/qrcode.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)}));
function qrSVG(text){
  if(window.qrcode){try{const q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true})}
  catch(e){return `<span style="font-size:11px;color:#333;direction:ltr">${esc(text)}</span>`}}
  loadQR().then(()=>$$('[data-qr]').forEach(el=>{el.innerHTML=qrSVG(el.dataset.qr);el.removeAttribute('data-qr')})).catch(()=>{});
  return `<span data-qr="${esc(text)}"></span>`;
}

/* ---------- contact info ---------- */
const ci=`<ul class="contact-list"><li>الهاتف: <a href="tel:${CONTACT.phone.replace(/\s/g,'')}"><span>${CONTACT.phone}</span></a></li><li>واتساب: <a href="https://wa.me/${CONTACT.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener"><span>${CONTACT.whatsapp}</span></a></li><li>البريد: <a href="mailto:${CONTACT.email}"><span>${CONTACT.email}</span></a></li><li>${CONTACT.hours}</li></ul>`;
$$('[data-contact]').forEach(el=>el.innerHTML=ci);

/* ---------- events ---------- */
/* كل تسجيل: status = confirmed (حجز مؤكد) أو waitlist (قيد الانتظار، لا يحجز مقعداً) */
let tickets=loadJ('ca-tix',[]).map(t=>({status:'confirmed',...t}));
const taken=ev=>ev.taken+tickets.filter(t=>t.ev===ev.id&&t.status==='confirmed').reduce((a,t)=>a+1,0);
const upcoming=()=>EVENTS.slice().sort((a,b)=>a.start.localeCompare(b.start));
const regOpen=ev=>!ev.closes||todayISO()<=ev.closes;
const priceTxt=n=>n===0?'مجاناً':n+' درهم';
function evDate(ev){const x=pd(ev.start);return `<div class="evdate"><b>${x.d}</b><small>${MONTHS[x.m-1]}</small></div>`}
const compTxt=e=>e.maxComp?`حتى ${e.maxComp} ${e.maxComp>2&&e.maxComp<11?'مرافقين':'مرافقاً'}، ${e.compIncluded?'مشمولون في الرسوم':'غير مشمولين في الرسوم'}`:'لا يُسمح بمرافقين';
const mapLink=e=>e.map?`<a href="${esc(e.map)}" target="_blank" rel="noopener">افتح الموقع على الخريطة</a>`:'يُرسَل رابط الخريطة للمسجلين';
function evFacts(e){
  const r=[['التاريخ',fmtRange(e.start,e.end)],['الوقت',e.time],['المكان',e.place]];
  if(e.trip&&e.meet) r.push(['التجمع والانطلاق',e.meet]);
  r.push(['آخر موعد للتسجيل',e.closes?fmtDay(e.closes):'—'],['التسجيل',e.per==='كرفان'?'لكل كرفان مع مرافقيه':'للفرد'],['المرافقون',compTxt(e)]);
  return `<dl class="evfacts">${r.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl>`;
}
let evF='الكل';
function renderEvents(){
  const types=['الكل',...new Set(EVENTS.map(e=>e.type))];
  $('#evchips').innerHTML=types.map(t=>`<button class="chip" data-f="${t}" aria-pressed="${t===evF}">${t}</button>`).join('');
  const list=upcoming().filter(e=>evF==='الكل'||e.type===evF);
  $('#evlist').innerHTML=list.map(e=>{
    const tk=taken(e), left=Math.max(0,e.cap-tk), full=left===0, mine=tickets.find(t=>t.ev===e.id), open=regOpen(e);
    const pr=e.price.member===e.price.guest?`<div class="pr">${priceTxt(e.price.member)}${e.membersOnly?'<small>للأعضاء فقط</small>':(e.price.member?'<small>سعر موحّد للجميع</small>':'')}</div>`:`<div class="pr">${priceTxt(e.price.member)}<small>للأعضاء — ${priceTxt(e.price.guest)} لغيرهم</small></div>`;
    const btn=mine?(mine.status==='waitlist'?'قيد الانتظار':'مسجّل'):!open?'أُغلق التسجيل':full?'سجّل في قائمة الانتظار':'سجّل الآن';
    return `<article class="evc">${evDate(e)}<div><h3>${e.title}</h3><div class="meta"><span>${e.type}</span><span>${fmtRange(e.start,e.end)}</span><span>${e.place}</span></div><p>${e.desc}</p><div class="seats" title="المقاعد المحجوزة"><i style="width:${Math.min(100,tk/e.cap*100)}%"></i></div><div class="meta" style="margin-top:6px"><span>${full?'اكتمل العدد — يمكن التسجيل في قائمة الانتظار':`المقاعد المتبقية: ${left} من ${e.cap}`}</span>${e.closes?`<span>يُغلق التسجيل ${fmtDay(e.closes)}</span>`:''}</div><details class="evmore"><summary>تفاصيل الفعالية</summary>${evFacts(e)}</details></div><div class="evside">${pr}<button class="cta" data-reg="${e.id}" ${mine||!open?'disabled':''}>${btn}</button></div></article>`;
  }).join('');
}
$('#evchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){evF=b.dataset.f;renderEvents()}});
$('#evlist').addEventListener('click',e=>{const b=e.target.closest('[data-reg]');if(b&&!b.disabled)openReg(b.dataset.reg)});
const termsHTML=e=>`<details class="terms"><summary>اطّلع على شروط السلامة والمشاركة</summary><ul>${EVENT_TERMS.map(t=>`<li>${t}</li>`).join('')}</ul>${e.trip?'<p>راجع أيضاً <a href="#/knowledge/pre-trip">قائمة الفحص قبل الرحلة</a>.</p>':''}</details>`;
const refundHTML=()=>`<details class="terms"><summary>سياسة الإلغاء والاسترداد</summary><ul>${REFUND_POLICY.map(t=>`<li>${t}</li>`).join('')}</ul></details>`;
function openReg(id){
  const e=EVENTS.find(x=>x.id===id); const dlg=$('#regdlg'); const paid=!!(e.price.member||e.price.guest);
  $('#regbody').innerHTML=`<h2 class="h" id="reg-title" style="font-size:22px">التسجيل: ${e.title}</h2>${evFacts(e)}
  <form id="regform" novalidate>
    <div class="row"><div class="field"><label for="rn">الاسم</label><input id="rn" type="text" autocomplete="name"><div class="msg">اكتب اسمك الكامل.</div></div>
    <div class="field"><label for="rp">الهاتف</label><input id="rp" type="tel" dir="ltr" placeholder="05X XXX XXXX"><div class="msg">رقم إماراتي يبدأ بـ 05.</div></div></div>
    <div class="field"><label for="re">البريد الإلكتروني</label><input id="re" type="email" dir="ltr"><div class="msg">بريد صحيح لإرسال رسالة التأكيد.</div></div>
    <div class="field"><span class="legend">صفتك</span><div class="opts"><label class="opt"><input type="radio" name="rm" value="member" checked><span>عضو في الجمعية</span></label>${e.membersOnly?'':'<label class="opt"><input type="radio" name="rm" value="guest"><span>غير عضو</span></label>'}</div>${e.membersOnly?'<div class="hint">هذه الفعالية مخصصة للأعضاء فقط.</div>':''}</div>
    <div class="field" id="f-rmem"><label for="rmem">رقم العضوية</label><input id="rmem" type="text" dir="ltr" placeholder="CA-0000" autocomplete="off"><div class="msg" id="rmem-msg">تعذر التحقق من العضوية. يرجى مراجعة رقم العضوية أو التواصل مع الجمعية.</div><div class="hint">نتحقق من أن الرقم يخصك وأن عضويتك سارية. للتجربة: <b dir="ltr">CA-1001</b></div></div>
    ${e.trip?`<div class="row"><div class="field"><label for="rct">نوع الكرفان</label><select id="rct"><option>موترهوم</option><option>مقطورة سحب</option><option>كامبر</option></select></div>
    <div class="field"><label for="rpl">رقم اللوحة</label><input id="rpl" type="text" dir="ltr"><div class="msg">أدخل رقم اللوحة.</div></div></div>`:''}
    ${e.maxComp||e.trip?`<div class="row">${e.maxComp?`<div class="field"><label for="rcm">عدد المرافقين</label><input id="rcm" type="number" min="0" max="${e.maxComp}" value="0" dir="ltr"><div class="hint">${compTxt(e)}.</div><div class="msg">الحد الأقصى ${e.maxComp}.</div></div>`:''}
    ${e.trip?`<div class="field"><label for="rem">رقم للطوارئ (غير مشارك)</label><input id="rem" type="tel" dir="ltr"><div class="msg">رقم طوارئ مطلوب للرحلات.</div></div>`:''}</div>`:''}
    ${termsHTML(e)}
    ${e.trip?`<label class="check"><input type="checkbox" id="rsafe">أقر بشروط السلامة وجاهزية الكرفان، وبالالتزام بتعليمات قائد القافلة.</label>
    <div class="field" id="f-rsafe"><div class="msg">يلزم الإقرار بشروط السلامة.</div></div>`:''}
    ${paid?refundHTML():''}
    <div class="fees-calc" id="regcost" style="margin:12px 0 10px"></div>
    ${e.membersOnly?'':'<p class="hint prio">الأولوية لأعضاء جمعية الكرفانات ذوي العضوية السارية، ويُقبل غير الأعضاء حسب الأماكن المتبقية بعد استكمال طلبات الأعضاء.</p>'}
    <p class="hint consent">بالتسجيل توافق على معالجة بياناتك وفق <a href="#/privacy">سياسة الخصوصية</a>.</p>
    <button class="cta" type="submit">${paid?'أكّد التسجيل':'احجز مقعدي'}</button>
  </form>`;
  const f=$('#regform'); const savedMem=store.get('ca-memno')||''; $('#rmem').value=savedMem;
  const role=()=>f.querySelector('input[name=rm]:checked').value;
  const cost=()=>{const m=role();$('#f-rmem').hidden=m!=='member';const p=m==='member'?e.price.member:e.price.guest;$('#regcost').innerHTML=`<div class="tot"><span>المبلغ${e.per==='كرفان'?' (للكرفان)':''}</span><span>${priceTxt(p)}</span></div>`+(e.maxComp&&!e.compIncluded?'<div><span>المرافقون</span><span>رسومهم غير مشمولة وتُوضَّح عند التأكيد</span></div>':'');return p};
  f.addEventListener('change',cost); cost();
  f.addEventListener('submit',ev=>{
    ev.preventDefault(); let ok=true;
    const bad=(id,b)=>{const el=document.getElementById(id);el.closest('.field').classList.toggle('bad',b);if(b)ok=false};
    bad('rn',$('#rn').value.trim().split(/\s+/).length<2);
    bad('rp',!/^(\+?971|0)5\d{8}$/.test($('#rp').value.replace(/[\s-]/g,'')));
    bad('re',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#re').value.trim()));
    const isMem=role()==='member';
    if(isMem){const n=$('#rmem').value.trim();$('#rmem-msg').textContent=n?'تعذر التحقق من العضوية. يرجى مراجعة رقم العضوية أو التواصل مع الجمعية.':'أدخل رقم العضوية.';bad('rmem',!n||!memberOk(n))}
    if($('#rcm')){const c=+$('#rcm').value||0;bad('rcm',c<0||c>e.maxComp)}
    if(e.trip){bad('rpl',!$('#rpl').value.trim());bad('rem',!/^(\+?971|0)\d{8,9}$/.test($('#rem').value.replace(/[\s-]/g,'')));$('#f-rsafe').classList.toggle('bad',!$('#rsafe').checked);if(!$('#rsafe').checked)ok=false}
    if(!ok){f.querySelector('.bad input')?.focus();return}
    if(isMem) store.set('ca-memno',normMem($('#rmem').value));
    const comp=$('#rcm')?+$('#rcm').value||0:0;
    const status=isMem&&taken(e)<e.cap?'confirmed':'waitlist';
    const t={id:genId(status==='confirmed'?'TK':'WL'),ev:e.id,status,guest:!isMem,title:e.title,date:fmtRange(e.start,e.end),place:e.place,name:$('#rn').value.trim(),email:$('#re').value.trim(),price:cost(),companions:comp};
    tickets.push(t); saveJ('ca-tix',tickets); renderEvents(); renderHomeEvents();
    $('#regbody').innerHTML=status==='confirmed'?confirmHTML(e,t):waitHTML(e,t);
  });
  dlg.showModal(); setTimeout(()=>$('#rn')?.focus(),50);
}
const people=t=>1+(t.companions||0);
function mailPreview(e,t,head){
  return `<div class="mailprev"><div class="mh"><small>رسالة تلقائية إلى <span dir="ltr">${esc(t.email)}</span></small><b>${head}</b></div><ul>
  <li><b>${e.title}</b> — رقم الحجز <span class="ref">${t.id}</span> — عدد الأشخاص: ${people(t)}</li>
  <li>${fmtRange(e.start,e.end)} — ${e.time}</li>
  <li>${e.place}. ${mapLink(e)}${e.directions?`. ${e.directions}`:''}</li>
  ${e.trip&&e.meet?`<li>التجمع والانطلاق: ${e.meet}</li>`:''}
  <li>تعليمات المشاركة والسلامة: ${EVENT_TERMS.slice(0,2).join(' ')}</li>
  <li>للاستفسار: منظم الفعالية <a href="${telHref(e.organizer||CONTACT.phone)}" dir="ltr">${e.organizer||CONTACT.phone}</a></li></ul>
  <p>التفاصيل متاحة دائماً في <a href="#/account">حسابي</a>، ونرسل لك تنبيهاً إذا تغيّر الموعد أو الموقع أو أُلغيت الفعالية.</p></div>`;
}
function confirmHTML(e,t){return `<h2 class="h" style="font-size:22px">تم تأكيد تسجيلك</h2><p style="color:var(--muted)">${t.price?'يصلك رابط الدفع مع رسالة التأكيد، ويُوضَّح فيه موعد السداد. ':''}احتفظ بالتذكرة، وتجدها دائماً في <a href="#/account">حسابي</a>.</p>${mailPreview(e,t,'تأكيد الحجز')}${ticketHTML(t)}<p class="samplenote">نسخة توضيحية: لا تُرسل الرسائل فعلياً.</p><button class="btn2" type="button" onclick="this.closest('dialog').close()">إغلاق</button>`}
function waitHTML(e,t){
  const msg=t.guest?'تم استلام طلبك وهو قيد الانتظار. سنؤكد مشاركتك إذا توفرت أماكن بعد استكمال تسجيل الأعضاء.':'اكتمل العدد حالياً، وطلبك قيد الانتظار حسب أسبقية التسجيل. سنؤكد مشاركتك إذا توفر مكان.';
  return `<h2 class="h" style="font-size:22px">تم استلام طلب التسجيل</h2><div class="okmsg on wait"><b>${msg}</b><p style="margin:6px 0 0;color:var(--muted);font-size:14.5px">لا يُصدر لك تأكيد نهائي أو تذكرة إلا بعد تخصيص مكان لك${t.price?'، ويُحدَّد عند التأكيد موعد السداد':''}.</p></div>
  <div class="mailprev"><div class="mh"><small>رسالة تلقائية إلى <span dir="ltr">${esc(t.email)}</span></small><b>تم استلام طلب التسجيل</b></div><p>${e.title} — رقم الطلب <span class="ref">${t.id}</span>. الحجز لم يتأكد بعد، وتبقى الأولوية لأعضاء الجمعية ذوي العضوية السارية. سنراسلك عند تأكيد مشاركتك.</p></div>
  <p class="samplenote">نسخة توضيحية: لا تُرسل الرسائل فعلياً.</p><button class="btn2" type="button" onclick="this.closest('dialog').close()">إغلاق</button>`;
}
function ticketHTML(t){
  const e=EVENTS.find(x=>x.id===t.ev);
  const more=e?`<details class="evmore"><summary>تفاصيل الفعالية</summary>${evFacts(e)}<p style="font-size:13.5px;margin:6px 0 0">${mapLink(e)} — المنظم: <a href="${telHref(e.organizer||CONTACT.phone)}" dir="ltr">${e.organizer||CONTACT.phone}</a></p></details>`:'';
  if(t.status==='waitlist') return `<div class="ticket wait" style="grid-template-columns:1fr"><div><b>${t.title}</b><small>${t.date}</small><small>${t.place}</small><small>باسم: ${esc(t.name)}${t.companions?` + ${t.companions} مرافقين`:''}</small><small class="st">قيد الانتظار — لم يتأكد الحجز بعد</small><small class="ref" style="margin-top:6px">${t.id}</small>${more}</div></div>`;
  return `<div class="ticket"><div><b>${t.title}</b><small>${t.date}</small><small>${t.place}</small><small>باسم: ${esc(t.name)}${t.companions?` + ${t.companions} مرافقين`:''}</small><small class="ref" style="margin-top:6px">${t.id}</small>${more}</div><div class="qr" aria-label="رمز QR للتذكرة">${qrSVG('CA-TICKET:'+t.id)}</div></div>`;
}
function renderHomeEvents(){
  $('#home-events').innerHTML=upcoming().slice(0,3).map(e=>`<a href="#/events">${evDate(e)}<div><h3>${e.title}</h3><span>${fmtRange(e.start,e.end)}</span></div></a>`).join('');
}

/* ---------- store ---------- */
const PICONS={
 shirt:'<path d="M18 10l10-4h8l10 4 8 10-8 6-4-4v34H18V22l-4 4-8-6z"/>',cap:'<path d="M10 40c0-14 10-24 22-24s22 10 22 24zM6 40h52"/>',jacket:'<path d="M20 8l12 6 12-6 12 10v40H8V18zM32 14v44"/>',
 ext:'<rect x="22" y="18" width="20" height="38" rx="6"/><path d="M28 18v-6h8v6M36 12h10"/>',alarm:'<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="6"/><path d="M32 12v4M32 48v4"/>',aid:'<rect x="10" y="18" width="44" height="34" rx="4"/><path d="M24 18v-6h16v6M32 26v18M23 35h18"/>',
 boards:'<path d="M14 12h14v42H14zM36 12h14v42H36zM14 20h14M14 28h14M36 20h14M36 28h14"/>',lamp:'<path d="M24 14h16M26 14v6h12v-6M22 20h20l-2 30H24zM28 50v6h8v-6"/>',sticker:'<rect x="10" y="16" width="44" height="32" rx="6"/><path d="M18 40l8-14 6 10 4-6 8 10"/>',coupon:'<path d="M8 20h48v8a4 4 0 0 0 0 8v8H8v-8a4 4 0 0 0 0-8z"/><path d="M26 40l12-16M26 26h0M38 38h0" stroke-width="4"/>'
};

/* مفتاح السلة: رقم المنتج، أو رقم المنتج|المقاس للقطع ذات المقاسات */
let cart=loadJ('ca-cart',{}), pf='الكل', member=store.get('ca-member')==='1'; const pickSize={};
$('#ismember').checked=member;
const pprice=p=>p.membersOnly?0:(member?p.member:p.price);
const splitKey=k=>{const [id,size]=k.split('|');return {p:PRODUCTS.find(x=>x.id===id),size}};
const keyName=k=>{const {p,size}=splitKey(k);return p?p.name+(size?` — مقاس ${size}`:''):''};
function renderStore(){
  const cats=['الكل',...new Set(PRODUCTS.map(p=>p.cat))];
  $('#pchips').innerHTML=cats.map(c=>`<button class="chip" data-f="${c}" aria-pressed="${c===pf}">${c}</button>`).join('');
  $('#pgrid').innerHTML=PRODUCTS.filter(p=>pf==='الكل'||p.cat===pf).map(p=>{
    const dis=p.membersOnly&&!member, inCart=Object.keys(cart).some(k=>k.split('|')[0]===p.id);
    const priceH=p.membersOnly?`<span class="pp">${member?'مجاناً':'للأعضاء'}</span>`:`<span class="pp">${pprice(p)} درهم${member?`<s>${p.price}</s>`:''}</span>`;
    const sizeH=p.sizes?`<label class="psize"><span>المقاس</span><select data-size="${p.id}" aria-label="اختر المقاس — ${p.name}"><option value="">اختر المقاس</option>${p.sizes.map(z=>`<option${pickSize[p.id]===z?' selected':''}>${z}</option>`).join('')}</select></label><span class="perr" id="perr-${p.id}" hidden>يرجى اختيار المقاس قبل الإضافة إلى السلة.</span>`:'';
    return `<article class="prod"><div class="pic"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${PICONS[p.icon]}</svg></div><div class="in"><span class="cat">${p.cat}</span><b>${p.name}</b><span class="d">${p.desc}</span>${sizeH}<div class="row2">${priceH}<button class="addbtn" data-add="${p.id}" ${dis?'disabled':''}>${inCart?'أضف واحداً آخر':'أضف إلى السلة'}</button></div>${!member&&!p.membersOnly?`<span class="d" style="font-size:12.5px">للأعضاء: ${p.member} درهم</span>`:''}</div></article>`;
  }).join('');
}
$('#pchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){pf=b.dataset.f;renderStore()}});
$('#pgrid').addEventListener('change',e=>{const s=e.target.closest('[data-size]');if(s){pickSize[s.dataset.size]=s.value;if(s.value)$('#perr-'+s.dataset.size).hidden=true}});
$('#ismember').addEventListener('change',e=>{member=e.target.checked;store.set('ca-member',member?'1':'0');renderStore();renderCart()});
$('#pgrid').addEventListener('click',e=>{
  const b=e.target.closest('[data-add]');if(!b)return; const p=PRODUCTS.find(x=>x.id===b.dataset.add);
  let k=p.id;
  if(p.sizes){const z=pickSize[p.id];if(!z){$('#perr-'+p.id).hidden=false;b.closest('.prod').querySelector('[data-size]').focus();return}k=p.id+'|'+z}
  cart[k]=(cart[k]||0)+1;saveJ('ca-cart',cart);updateCounts();renderStore();
  const nb=$(`[data-add="${p.id}"]`); if(nb) nb.textContent='تمت الإضافة';
});
function cartTotal(){return Object.entries(cart).reduce((a,[k,q])=>{const {p}=splitKey(k);return a+(p?pprice(p)*q:0)},0)}
function renderCart(){
  const items=Object.entries(cart).filter(([k,q])=>q>0&&splitKey(k).p);
  if(!items.length){$('#cartbody').innerHTML=`<div class="empty" style="margin-top:16px">السلة فارغة. <a href="#/store" onclick="document.getElementById('cartdlg').close()">تصفّح المتجر</a></div>`;return}
  $('#cartbody').innerHTML=items.map(([k,q])=>{const {p}=splitKey(k);return `<div class="citem"><div><b>${keyName(k)}</b><div class="qty"><button data-q="${esc(k)}" data-d="1" aria-label="زيادة">+</button><span>${q}</span><button data-q="${esc(k)}" data-d="-1" aria-label="إنقاص">−</button></div></div><div style="font-weight:700">${pprice(p)*q} درهم</div></div>`}).join('')+
  `<div class="ctot"><span>الإجمالي</span><span>${cartTotal()} درهم</span></div><p style="font-size:13.5px;color:var(--muted)">${member?'تُطبَّق أسعار الأعضاء ويُتحقق من العضوية عند الاستلام.':'لديك عضوية؟ فعّل أسعار الأعضاء من صفحة المتجر.'} الاستلام من مقر الجمعية أو في الفعاليات.</p><button class="cta" style="width:100%" id="checkout">أكّد الطلب</button>`;
}
$('#cartbody').addEventListener('click',e=>{
  const b=e.target.closest('[data-q]');
  if(b){const k=b.dataset.q;cart[k]=Math.max(0,(cart[k]||0)+ +b.dataset.d);if(!cart[k])delete cart[k];saveJ('ca-cart',cart);renderCart();updateCounts();renderStore();return}
  if(e.target.id==='checkout'){
    const items=Object.entries(cart).filter(([k])=>splitKey(k).p).map(([k,q])=>{const {p}=splitKey(k);return {name:keyName(k),q,sum:pprice(p)*q}});
    const o={id:genId('OR'),items,total:cartTotal(),date:new Date().toLocaleDateString('ar-AE')};
    const orders=loadJ('ca-orders',[]);orders.unshift(o);saveJ('ca-orders',orders);cart={};saveJ('ca-cart',cart);updateCounts();renderStore();
    $('#cartbody').innerHTML=`<div class="okmsg on" style="margin-top:16px"><b>تم تسجيل طلبك <span class="ref">${o.id}</span></b><p style="margin:6px 0 0;color:var(--muted);font-size:14.5px">${o.items.map(i=>`${i.name} × ${i.q}`).join('، ')}. الإجمالي ${o.total} درهم. سيتواصل معك فريق الجمعية لتأكيد الدفع والاستلام. تجد الطلب في <a href="#/account" onclick="document.getElementById('cartdlg').close()">حسابي</a>.</p></div>`;
  }
});
$('#cartbtn').addEventListener('click',()=>{renderCart();$('#cartdlg').showModal()});
function updateCounts(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$('#cartcnt').textContent=n||'';}

/* ---------- directory ---------- */
const tierLabel=t=>t==='شريك'?'شريك':'راعٍ '+t;
const discLine=(lbl,d)=>d?`<li><b>${lbl}: ${esc(d.pct)}</b><span>${esc(d.items)}${d.until?` — ${esc(d.until)}`:''}</span></li>`:'';
function coCard(c,opts={}){
  const acts=[c.phone&&`<a href="${telHref(c.phone)}">اتصال</a>`,c.whatsapp&&`<a href="${waHref(c.whatsapp)}" target="_blank" rel="noopener">واتساب</a>`,c.instagram&&`<a href="${igHref(c.instagram)}" target="_blank" rel="noopener">إنستغرام</a>`,c.web&&`<a href="${esc(c.web)}" target="_blank" rel="noopener">الموقع الإلكتروني</a>`,c.map&&`<a href="${esc(c.map)}" target="_blank" rel="noopener">الموقع على الخريطة</a>`].filter(Boolean);
  const disc=discLine('خصم الخدمات والصيانة',c.svc)+discLine('خصم المنتجات',c.prod);
  return `<article class="co"><div class="av" aria-hidden="true">${c.logo?`<img src="${esc(c.logo)}" alt="">`:c.name.replace(/^ال/,'').charAt(0)}</div><div><h3>${esc(c.name)}${c.tier?`<span class="badge soft">${tierLabel(c.tier)}</span>`:''}${opts.pending?'<span class="badge">قيد المراجعة</span>':''}</h3><div class="sub">${esc(c.acts.join('، '))} — ${esc(c.country)}${c.city?'، '+esc(c.city):''}</div><p>${esc(c.services)}</p>${disc?`<ul class="disc-list">${disc}</ul>`:''}${acts.length?`<div class="coacts">${acts.join('')}</div>`:''}</div></article>`;
}
let df='الكل';
$('#dcountry').insertAdjacentHTML('beforeend',GCC.map(c=>`<option>${c}</option>`).join(''));
$('#dem').insertAdjacentHTML('beforeend',EMIRATES.map(c=>`<option>${c}</option>`).join(''));
$('#dterms').textContent=DISCOUNT_TERMS;
function renderDir(){
  $('#dchips').innerHTML=['الكل',...ACTIVITIES].map(c=>`<button class="chip" data-f="${c}" aria-pressed="${c===df}">${c}</button>`).join('');
  const q=$('#dq').value.trim(), co=$('#dcountry').value; $('#dem').hidden=co!=='الإمارات'; if(co!=='الإمارات') $('#dem').value='';
  const em=$('#dem').value;
  const list=COMPANIES.filter(c=>(df==='الكل'||c.acts.includes(df))&&(!co||c.country===co)&&(!em||c.city===em)&&(!q||(c.name+' '+c.services+' '+c.acts.join(' ')).includes(q)));
  $('#dlist').innerHTML=list.length?list.map(c=>coCard(c)).join(''):'<div class="empty" style="grid-column:1/-1">لا توجد نتائج. جرّب كلمة أخرى أو نشاطاً أو دولة مختلفة.</div>';
}
$('#dchips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){df=b.dataset.f;renderDir()}});
$('#dq').addEventListener('input',renderDir);$('#dcountry').addEventListener('change',renderDir);$('#dem').addEventListener('change',renderDir);
const tierCls={'ذهبي':'g','فضي':'s','شريك':'p'};
const spCard=c=>`<div class="sp"><span class="tier ${tierCls[c.tier]||'p'}">${tierLabel(c.tier)}</span><b>${esc(c.name)}</b><small style="color:var(--muted)">${esc(c.acts[0]||'')}</small></div>`;
const spHTML=COMPANIES.filter(c=>c.tier).sort((a,b)=>'ذهبيفضيشريك'.indexOf(a.tier)-'ذهبيفضيشريك'.indexOf(b.tier)).map(spCard).join('');
$('#sponsors').innerHTML=spHTML; const hsp=$('#home-sponsors'); hsp.classList.add('marq'); hsp.innerHTML=`<div class="track">${spHTML}${spHTML.replace(/class="sp"/g,'class="sp" aria-hidden="true"')}</div>`;
$('#invest').innerHTML=INVEST.map(i=>`<div><small>${i.k}</small><h3>${i.t}</h3><p>${i.d}</p><a class="more" style="font-weight:600;font-size:14.5px" href="#/register-company?coop=sponsor">أبدِ اهتمامك</a></div>`).join('');

/* ---------- company registration ---------- */
const coform=$('#coform'), cov=n=>coform.elements[n]; let coLogo=null;
$('#co-country').insertAdjacentHTML('beforeend',GCC.map(c=>`<option>${c}</option>`).join(''));
$('#co-em').insertAdjacentHTML('beforeend',EMIRATES.map(c=>`<option>${c}</option>`).join(''));
$('#co-acts').innerHTML=ACTIVITIES.map(a=>`<label class="opt"><input type="checkbox" name="coact" value="${a}"><span>${a}</span></label>`).join('');
$('#co-terms').textContent='شروط الاستفادة الموحدة: «'+DISCOUNT_TERMS+'»';
$('#co-logo-hint').textContent=`يرجى رفع شعار الشركة بصورة واضحة وكاملة، بدون قص أو تشويه. الصيغ المقبولة: PNG أو JPG أو JPEG أو WEBP، وبحجم لا يتجاوز ${SETTINGS.logoMaxMB} ميجابايت. يُفضّل استخدام PNG بخلفية شفافة.`;
function coSync(){
  const uae=cov('cocountry').value==='الإمارات'; $('#f-co-em').hidden=!uae; $('#co-city').previousElementSibling.textContent=uae?'المدينة (اختياري)':'المدينة';
  $$('#coform fieldset.disc').forEach(fs=>{fs.querySelector('.row3').hidden=!fs.querySelector('legend input').checked});
  $('#f-co-disc').hidden=cov('coop').value!=='discount';
}
coform.addEventListener('change',e=>{if(e.target.id!=='co-logo')coSync()}); coSync();
$('#co-logo').addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0]; if(!f) return; let m='';
  if(!imgOk(f)) m='صيغة الملف غير مدعومة. يرجى اختيار إحدى الصيغ الموضحة.';
  else if(f.size>SETTINGS.logoMaxMB*1024*1024) m=`حجم الملف يتجاوز ${SETTINGS.logoMaxMB} ميجابايت. يرجى رفع صورة بحجم أصغر.`;
  $('#co-logo-msg').textContent=m; $('#f-co-logo').classList.toggle('bad',!!m);
  if(m){e.target.value='';return}
  if(coLogo) URL.revokeObjectURL(coLogo.url); coLogo={f,url:URL.createObjectURL(f)};
  $('#co-logo-prev').innerHTML=`<img src="${coLogo.url}" alt="معاينة الشعار">`; $('#co-logo-prev').nextElementSibling.firstChild.textContent='تغيير الشعار ';
});
const pctOk=v=>{const m=/^(\d{1,3})\s*%?$/.exec(v.trim());return !!m&&+m[1]>=1&&+m[1]<=100};
coform.addEventListener('submit',e=>{
  e.preventDefault(); let ok=true;
  const bad=(id,b)=>{const el=document.getElementById(id);(el.closest('.field')).classList.toggle('bad',b);if(b)ok=false};
  const uae=cov('cocountry').value==='الإمارات';
  bad('co-name',cov('coname').value.trim().length<2);
  bad('co-country',!cov('cocountry').value);
  if(uae){bad('co-em',!cov('coem').value);$('#f-co-city').classList.remove('bad')}else bad('co-city',cov('cocity').value.trim().length<2);
  const acts=$$('#co-acts input:checked').map(i=>i.value); $('#f-co-acts').classList.toggle('bad',!acts.length); if(!acts.length) ok=false;
  bad('co-svc',cov('cosvc').value.trim().length<5);
  bad('co-phone',!/^\+?\d[\d\s-]{7,}$/.test(cov('cophone').value.trim()));
  ['co-web','co-map'].forEach(id=>{const v=document.getElementById(id).value.trim();bad(id,!!v&&!isURL(v))});
  if(!coLogo){$('#co-logo-msg').textContent='يرجى رفع شعار الشركة.';$('#f-co-logo').classList.add('bad');ok=false}
  const disc={};
  [['d1','svc'],['d2','prod']].forEach(([d,k])=>{if(!cov('co'+d).checked)return;bad(`co-${d}p`,!pctOk(cov(`co${d}p`).value));bad(`co-${d}i`,cov(`co${d}i`).value.trim().length<2);bad(`co-${d}u`,cov(`co${d}u`).value.trim().length<3);const p=cov(`co${d}p`).value.trim();disc[k]={pct:p.endsWith('%')?p:p+'%',items:cov(`co${d}i`).value.trim(),until:cov(`co${d}u`).value.trim()}});
  const sponsor=cov('coop').value==='sponsor';
  $('#f-co-disc').classList.toggle('bad',!sponsor&&!disc.svc&&!disc.prod); if(!sponsor&&!disc.svc&&!disc.prod) ok=false;
  bad('co-pn',cov('copn').value.trim().length<2);
  bad('co-pp',!/^\+?\d[\d\s-]{7,}$/.test(cov('copp').value.trim()));
  bad('co-pe',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cov('cope').value.trim()));
  $('#f-co-ok').classList.toggle('bad',!cov('cook').checked); if(!cov('cook').checked) ok=false;
  if(!ok){coform.querySelector('.bad input,.bad select,.bad textarea')?.focus();return}
  const c={name:cov('coname').value.trim(),country:cov('cocountry').value,city:uae?(cov('coem').value+(cov('cocity').value.trim()?' — '+cov('cocity').value.trim():'')):cov('cocity').value.trim(),acts,services:cov('cosvc').value.trim(),svc:disc.svc||null,prod:disc.prod||null,phone:cov('cophone').value.trim(),whatsapp:cov('cowa').value.trim(),instagram:cov('coig').value.trim(),web:cov('coweb').value.trim(),map:cov('comap').value.trim(),logo:coLogo.url,tier:sponsor?'شريك':''};
  const ref=genId('CO'); const regs=loadJ('ca-coreg',[]); regs.unshift({ref,...c,logo:'',contact:{name:cov('copn').value.trim(),phone:cov('copp').value.trim(),email:cov('cope').value.trim()},status:'قيد المراجعة',at:new Date().toISOString()}); saveJ('ca-coreg',regs);
  $('#co-done').innerHTML=`<b>تم استلام طلب تسجيل شركتك. سنراجع البيانات والعرض، وتظهر الشركة في الدليل بعد اعتماد الجمعية.</b><p style="margin:6px 0 12px;color:var(--muted);font-size:14.5px">رقم الطلب <span class="ref">${ref}</span> — الحالة: قيد المراجعة.</p><p style="margin:0 0 8px;font-size:14px;font-weight:600">معاينة بطاقة شركتك في الدليل بعد الاعتماد:</p><div class="dlist" style="grid-template-columns:1fr">${coCard(c,{pending:true})}</div><p class="samplenote">نسخة توضيحية: لا يُرسل الطلب فعلياً. في النسخة النهائية يصل الطلب إلى لوحة تحكم الجمعية، وعند الاعتماد تُنشر البطاقة تلقائياً من البيانات نفسها.</p>`;
  $('#co-done').classList.add('on'); $('#co-done').scrollIntoView({behavior:'smooth',block:'nearest'});
});

/* ---------- account ---------- */
function renderAccount(){
  tickets=loadJ('ca-tix',[]).map(t=>({status:'confirmed',...t}));
  const dr=loadJ('ca-draft',null), apps=loadJ('ca-apps',[]);
  let h=dr?`<div class="ticket" style="grid-template-columns:1fr auto"><div><b>${esc(dr.data.req||'طلب عضوية')} — ${esc(dr.data.cat||'')}</b><small class="st">مسودة غير مكتملة</small><small>آخر حفظ ${fmtStamp(dr.at)}</small></div><a class="cta" href="#/join?draft=1" style="text-decoration:none">استكمال الطلب</a></div>`:'';
  h+=apps.map(a=>`<div class="ticket" style="grid-template-columns:1fr"><div><b>${esc(a.req)} — ${esc(a.cat)}</b><small>رقم الطلب <span class="ref">${esc(a.no)}</span> — ${esc(a.date)}</small><small class="st ok">قيد التدقيق</small></div></div>`).join('');
  $('#myapp').innerHTML=h||`<div class="empty">لا توجد طلبات عضوية. <a href="#/join">قدّم طلب العضوية</a></div>`;
  $('#mytix').innerHTML=tickets.length?tickets.slice().reverse().map(ticketHTML).join(''):`<div class="empty">لا توجد تذاكر بعد. <a href="#/events">تصفّح الفعاليات القادمة</a></div>`;
  const orders=loadJ('ca-orders',[]);
  $('#myord').innerHTML=orders.length?orders.map(o=>`<div class="ticket" style="grid-template-columns:1fr"><div><b>طلب <span class="ref">${o.id}</span></b><small>${o.date} — قيد التأكيد</small>${o.items.map(i=>`<small>${esc(i.name)} × ${i.q} — ${i.sum} درهم</small>`).join('')}<small style="font-weight:700;color:var(--text)">الإجمالي: ${o.total} درهم</small></div></div>`).join(''):`<div class="empty">لا توجد طلبات بعد. <a href="#/store">زر المتجر</a></div>`;
}

renderEvents();renderHomeEvents();renderStore();renderDir();updateCounts();

/* ---------- router ---------- */
const LEGACY={'#about':'about','#sites':'','#membership':'membership','#events':'events','#governance':'governance','#join':'join','#contact':'contact','#home':''};
let routed=false;
function route(){
  let h=location.hash||'#/';
  if(LEGACY[h]!==undefined){location.replace('#/'+LEGACY[h]);return}
  if(!h.startsWith('#/')) return;
  const [path,qs]=h.slice(2).split('?'); const parts=path.split('/').filter(Boolean);
  const params=new URLSearchParams(qs||'');
  let page=parts[0]||'home', ok=true;
  if(page==='contact'&&params.get('type')==='partner'){location.replace('#/register-company');return}
  if(page==='account')renderAccount();
  if(page==='join'&&params.get('draft')){$('#done').classList.remove('on');form.style.display='';$('.progress').style.display='';$('#steplabel').style.display='';const st=loadDraft();renderDraftBar();sync();show(st)}
  if(page==='knowledge'&&parts[1]){ok=renderArticle(parts[1]);page='article'}
  if(page==='news'&&parts[1]){ok=renderNewsItem(decodeURIComponent(parts[1]));page='newsitem'}
  if(page==='verify'&&parts[1]){const n=decodeURIComponent(parts[1]);$('#vno').value=n;verify(n)}
  if(page==='contact'&&params.get('type')){const r=cform.querySelector(`input[name=ktype][value="${params.get('type')}"]`);if(r){r.checked=true;ktypeSync()}}
  if(page==='register-company'&&params.get('coop')){const r=coform.querySelector(`input[name=coop][value="${params.get('coop')}"]`);if(r){r.checked=true;coSync()}}
  $$('dialog[open]').forEach(d=>d.close());
  if(routed) delete document.documentElement.dataset.route; routed=true;
  let el=document.getElementById('p-'+page); if(!el||!ok) el=$('#p-404');
  const swap=()=>$$('.page').forEach(p=>p.classList.toggle('on',p===el));
  const prev=$('.page.on');
  if(prev&&prev!==el&&document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.startViewTransition(swap)}else swap();
  const key=el.id.slice(2);
  $$('.nav a').forEach(a=>{const on=(a.dataset.r||'').split(' ').includes(key);a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.title=(key==='home'?'':(key==='article'?$('#a-title').textContent:key==='newsitem'?$('#n-title').textContent:el.dataset.title)+' | ')+'جمعية الكرفانات';
  window.scrollTo(0,0);
  $('#main').focus({preventScroll:true});
  window.dispatchEvent(new CustomEvent('ca:page',{detail:el}));
}
window.addEventListener('hashchange',route); route();
})();
