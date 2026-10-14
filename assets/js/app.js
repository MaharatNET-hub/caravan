(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const year=new Date().getFullYear();
$('#yr').textContent=year;
const cexp=$('#c-exp'); if(cexp) cexp.textContent='31 ديسمبر '+year;

/* ---------- theme & nav ---------- */
const setTheme=v=>{document.documentElement.dataset.theme=v;store.set('ca-theme',v);$$('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeSet===v))};
setTheme(store.get('ca-theme')==='dark'?'dark':'light');
$$('[data-theme-set]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeSet)));
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
  $('#cok').innerHTML=`<b>تم استلام رسالتك — الرقم المرجعي <span class="ref">${ref}</span></b><p style="margin:8px 0 12px;color:var(--muted);font-size:15px">في النسخة النهائية تصل الرسالة مباشرة إلى بريد الجمعية وإلى لوحة التحكم، ويتابعها الفريق المختص ويرد عليك عبر الهاتف أو البريد. احتفظ بالرقم المرجعي للمتابعة. (في هذه النسخة التوضيحية لا تُرسل الرسالة فعلياً.)</p><p style="margin:0;font-size:14px;color:var(--muted)">التواصل عبر إنستغرام اختياري: <a href="https://ig.me/m/caravan_association" target="_blank" rel="noopener" dir="ltr">@caravan_association</a></p>`;
  $('#cok').classList.add('on');
});

/* ---------- join form (from v1) ---------- */
const form=$('#form'), steps=$$('.fstep'), bars=$$('.progress i'); let cur=0;
const val=n=>{const el=form.elements[n]; if(!el) return ''; if(el instanceof RadioNodeList) return el.value; if(el.type==='checkbox') return el.checked; return el.value.trim()};
const isUAE=()=>val('nat')==='الإمارات العربية المتحدة';
const isMember=()=>val('cat')==='عضو منتسب';
const isNew=()=>['طلب انضمام جديد','إعادة التسجيل'].includes(val('req'));
const isFounder=()=>val('req')==='تحديث بيانات عضو مؤسس';
function sync(){
  $('#f-memno').hidden=isNew();
  const nat=val('nat'); $('#f-pass').hidden=!nat||isUAE(); $('#resident-conds').hidden=!nat||isUAE();
  $('#caravan').hidden=!isMember();
  $('#caravan-detail').style.display=val('ctype').startsWith('لا أملك')?'none':'';
  $('#c-name').textContent=val('name')||'اسم العضو'; $('#c-type').textContent=val('cat'); calc(); if(typeof renderExDoc==='function') renderExDoc();
}
function calc(){
  const founder=isFounder();
  $('#f-ex').hidden=founder;
  if(founder){
    $('#calc').innerHTML=`<div><span>رسم الانضمام</span><span>0 درهم</span></div><div><span>الاشتراك السنوي</span><span>0 درهم</span></div><div class="tot"><span>الإجمالي</span><span>0 درهم</span></div>`;
    $('#calcnote').textContent='الأعضاء المؤسسون معفون من الرسوم (المادة 49/3).';
    return;
  }
  const annual=isMember()?320:300, months=12-new Date().getMonth(), first=isNew();
  const sub=first?Math.round(annual*months/12):annual, join=first?300:0, ex=val('ex1')||val('ex2');
  let h=''; if(join) h+=`<div><span>رسم الانضمام (مرة واحدة)</span><span>${join} درهم</span></div>`;
  h+=`<div><span>الاشتراك السنوي — ${val('cat')}${first?` (تقديري: ${months} ${months>2&&months<11?'أشهر':'شهراً'})`:''}</span><span>${sub} درهم</span></div>`;
  h+=`<div class="tot"><span>${first?'الإجمالي التقديري':'الإجمالي'}</span><span>${join+sub} درهم</span></div>`;
  if(ex) h+=`<div class="exnote">طلب الإعفاء يُعرض على مجلس الإدارة والجمعية العمومية، وتقديمه لا يعني الموافقة (المادة 49/4).</div>`;
  $('#calc').innerHTML=h;
  $('#calcnote').textContent=first?'مبلغ السنة الأولى تقديري، ويُحتسب نهائياً من تاريخ الانضمام بعد قبول الطلب، وأي جزء من الشهر يُحسب شهراً كاملاً.':'تجديد عن سنة كاملة تبدأ في 1 يناير وتنتهي في 31 ديسمبر.';
}
function setBad(id,b){const el=form.elements[id];const f=el&&el.closest('.field');if(f)f.classList.toggle('bad',b);return !b}
function validate(i){
  let ok=true;
  if(i===0&&!isNew()) ok=setBad('memno',!val('memno'))&&ok;
  if(i===1){
    ok=setBad('name',val('name').split(/\s+/).length<2)&&ok;
    ok=setBad('eid',!/^784\d{12}$/.test(val('eid').replace(/[\s-]/g,'')))&&ok;
    const dob=val('dob')?new Date(val('dob')):null;
    ok=setBad('dob',!dob||isNaN(dob)||dob>new Date()||dob.getFullYear()<1900)&&ok; ok=setBad('nat',!val('nat'))&&ok;
    if(!isUAE()&&val('nat')) ok=setBad('pass',!val('pass'))&&ok;
  }
  if(i===2){
    ok=setBad('phone',!/^(\+?971|0)5\d{8}$/.test(val('phone').replace(/[\s-]/g,'')))&&ok;
    ok=setBad('email',!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')))&&ok;
    ok=setBad('emirate',!val('emirate'))&&ok;
  }
  if(i===3){const miss=docList().filter(d=>d.req&&!files[d.k]);$('#f-docs').classList.toggle('bad',!!miss.length);ok=!miss.length;if(!ok){const b=$(`#docs [data-doc="${miss[0].k}"] input`);if(b)b.focus()}}
  if(i===4){let all=['d1','d2','d3','d4','d5'].every(val); if(!isUAE()) all=all&&['r1','r2','r3'].every(val); $('#f-decl').classList.toggle('bad',!all); ok=all}
  if(!ok){const b=steps[i].querySelector('.bad input,.bad select');if(b)b.focus()}
  return ok;
}
/* المستندات المطلوبة حسب نوع الطلب والفئة والجنسية (النموذج ع/01، القسم ب) */
const files={};
function docList(){
  const L=[];
  if(isNew()){
    L.push({k:'eid',t:'صورة بطاقة الهوية الإماراتية',req:true},{k:'photo',t:'صورة شخصية حديثة',req:true});
    if(isMember()){ if(val('ctype').startsWith('لا أملك')) L.push({k:'own',t:'طلب الاستثناء من شرط ملكية الكرفان',req:false,note:'اخترت طلب الاستثناء في الخطوة 3، ويقرره مجلس الإدارة. يمكنك إرفاق ما يدعم طلبك.'}); else L.push({k:'own',t:'مستند رسمي يثبت ملكية الكرفان',req:true}); }
    if(val('nat')&&!isUAE()) L.push({k:'pass',t:'صورة جواز السفر',req:true},{k:'res',t:'صورة الإقامة السارية',req:true},{k:'res3',t:'مستند رسمي يثبت الإقامة في الدولة مدة لا تقل عن 3 سنوات سابقة',req:true});
  }else{
    L.push({k:'card',t:'بطاقة العضوية السابقة',req:true},{k:'chg',t:'المستندات التي تغيّرت أو انتهت صلاحيتها فقط (إن وُجدت)',req:false});
  }
  return L;
}
const fmtSize=b=>b<1024*1024?Math.max(1,Math.round(b/1024))+' ك.ب':(b/1024/1024).toFixed(1)+' م.ب';
const docRow=d=>`<div class="doc${files[d.k]?' ok':''}" data-doc="${d.k}"><div class="dt"><b>${d.t}</b><small>${d.req?'إلزامي':'اختياري'}${d.note?' — '+d.note:''}</small><span class="fn">${files[d.k]?`${esc(files[d.k].name)} — ${fmtSize(files[d.k].size)}`:'لم يُختر ملف بعد'}</span></div><label class="btn2 up">${files[d.k]?'تغيير الملف':'اختر ملفاً'}<input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" aria-label="${d.t}"></label></div>`;
function renderDocs(){
  $('#docs').innerHTML=docList().map(docRow).join('');
  renderExDoc();
}
function renderExDoc(){
  const ex=!isFounder()&&(val('ex1')||val('ex2')); $('#exdoc').hidden=!ex;
  if(ex) $('#exdoc').innerHTML=docRow({k:'exd',t:'مستند رسمي يثبت أنك من كبار المواطنين أو من أصحاب الهمم',req:false,note:'يُرفق مع طلب الإعفاء'});
}
function onFile(e){
  const inp=e.target; if(inp.type!=='file') return; e.stopPropagation();
  const row=inp.closest('[data-doc]'), f=inp.files&&inp.files[0]; if(!row||!f) return;
  if(!/\.(pdf|jpe?g|png)$/i.test(f.name)){row.querySelector('.fn').textContent='صيغة غير مقبولة. اختر ملف PDF أو JPG أو PNG.';row.classList.add('err');inp.value='';return}
  files[row.dataset.doc]={name:f.name,size:f.size}; if(row.closest('#exdoc')) renderExDoc(); else renderDocs(); $('#f-docs').classList.remove('bad');
}
const stopFileInput=e=>{if(e.target.type==='file')e.stopPropagation()};
[$('#docs'),$('#exdoc')].forEach(el=>{el.addEventListener('change',onFile,true);el.addEventListener('input',stopFileInput,true)});
function show(i){cur=i;if(i===3||i===5)renderDocs();steps.forEach((s,k)=>s.classList.toggle('on',k===i));bars.forEach((b,k)=>b.classList.toggle('on',k<=i));$('#steplabel').textContent=`الخطوة ${i+1} من ${steps.length}: ${steps[i].dataset.title}`;$('#prev').hidden=i===0;$('#next').textContent=i===steps.length-1?'أرسل الطلب':'التالي'}
$('#next').addEventListener('click',()=>{if(!validate(cur))return;if(cur<steps.length-1){show(cur+1);$('#p-join .formbox').scrollIntoView({behavior:'smooth',block:'start'})}else finish()});
$('#prev').addEventListener('click',()=>show(Math.max(0,cur-1)));
function finish(){
  const rows=[['نوع الطلب',val('req')],['فئة العضوية',val('cat')],['الاسم',val('name')],['رقم الهوية',val('eid')],['الجنسية',val('nat')],['الهاتف',val('phone')],['البريد الإلكتروني',val('email')],['الإمارة',val('emirate')],['وسيلة الإخطار',val('notify')]];
  if(isMember()) rows.push(['الكرفان',val('ctype')+(val('plate')?' — لوحة '+val('plate'):'')]);
  if(!isFounder()&&(val('ex1')||val('ex2'))) rows.push(['طلب إعفاء',[val('ex1')?'كبار المواطنين':'',val('ex2')?'أصحاب الهمم':''].filter(Boolean).join('، ')]);
  const up=Object.keys(files).filter(k=>docList().some(d=>d.k===k)||k==='exd').length;
  rows.push(['المستندات المرفقة',up?up+' ملف':'—']);
  rows.push(['تاريخ التقديم',new Date().toLocaleDateString('ar-AE')]);
  $('#appno').textContent=`${year}/${String(Math.floor(1000+Math.random()*9000))}`;
  $('#summary').innerHTML=rows.map(r=>`<div><span>${r[0]}</span><span>${esc(r[1]||'—')}</span></div>`).join('');
  form.style.display='none';$('.progress').style.display='none';$('#steplabel').style.display='none';$('#done').classList.add('on');store.del('ca-form');
}
$('#restart').addEventListener('click',()=>{form.reset();Object.keys(files).forEach(k=>delete files[k]);form.style.display='';$('.progress').style.display='';$('#steplabel').style.display='';$('#done').classList.remove('on');$$('.field.bad').forEach(f=>f.classList.remove('bad'));sync();show(0)});
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
/* مكتبة QR تُحمَّل فقط عند عرض أول رمز */
let qrLoading=null;
const loadQR=()=>qrLoading||(qrLoading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='assets/js/vendor/qrcode.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)}));
function qrSVG(text){
  if(window.qrcode){try{const q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:3,margin:2,scalable:true})}
  catch(e){return `<span style="font-size:11px;color:#333;direction:ltr">${esc(text)}</span>`}}
  loadQR().then(()=>$$('[data-qr]').forEach(el=>{el.innerHTML=qrSVG(el.dataset.qr);el.removeAttribute('data-qr')})).catch(()=>{});
  return `<span data-qr="${esc(text)}"></span>`;
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
    const pr=e.price.member===e.price.guest?`<div class="pr">${priceTxt(e.price.member)}${e.membersOnly?'<small>للأعضاء فقط</small>':(e.price.member?'<small>سعر موحّد للجميع</small>':'')}</div>`:`<div class="pr">${priceTxt(e.price.member)}<small>للأعضاء — ${priceTxt(e.price.guest)} لغيرهم</small></div>`;
    return `<article class="evc">${evDate(e)}<div><h3>${e.title}</h3><div class="meta"><span>${e.type}</span><span>${fmtRange(e.start,e.end)}</span><span>${e.place}</span></div><p>${e.desc}</p><div class="seats" title="المقاعد المحجوزة"><i style="width:${Math.min(100,tk/e.cap*100)}%"></i></div><div class="meta" style="margin-top:6px"><span>${full?'اكتمل العدد':`المقاعد المتبقية: ${left} من ${e.cap}`}</span></div></div><div class="evside">${pr}<button class="cta" data-reg="${e.id}" ${full||mine?'disabled':''}>${mine?'مسجّل':full?'اكتمل العدد':'سجّل الآن'}</button></div></article>`;
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

/* ---------- account ---------- */
function renderAccount(){
  tickets=loadJ('ca-tix',[]);
  $('#mytix').innerHTML=tickets.length?tickets.slice().reverse().map(ticketHTML).join(''):`<div class="empty">لا توجد تذاكر بعد. <a href="#/events">تصفّح الفعاليات القادمة</a></div>`;
  const orders=loadJ('ca-orders',[]);
  $('#myord').innerHTML=orders.length?orders.map(o=>`<div class="ticket" style="grid-template-columns:1fr"><div><b>طلب <span class="ref">${o.id}</span></b><small>${o.date} — قيد التأكيد</small>${o.items.map(i=>`<small>${i.name} × ${i.q} — ${i.sum} درهم</small>`).join('')}<small style="font-weight:700;color:var(--text)">الإجمالي: ${o.total} درهم</small></div></div>`).join(''):`<div class="empty">لا توجد طلبات بعد. <a href="#/store">زر المتجر</a></div>`;
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
  let page=parts[0]||'home', ok=true;
  if(page==='account')renderAccount();
  if(page==='knowledge'&&parts[1]){ok=renderArticle(parts[1]);page='article'}
  if(page==='verify'&&parts[1]){const n=decodeURIComponent(parts[1]);$('#vno').value=n;verify(n)}
  if(page==='contact'&&qs){const t=new URLSearchParams(qs).get('type');const r=cform.querySelector(`input[name=ktype][value="${t}"]`);if(r){r.checked=true;ktypeSync()}}
  $$('dialog[open]').forEach(d=>d.close());
  if(routed) delete document.documentElement.dataset.route; routed=true;
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
