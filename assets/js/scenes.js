/* =====================================================================
   جمعية الكرفانات — مكتبة الرسومات التوضيحية (SVG)
   رسومات مرسومة بالكود بألوان الهوية: كرفانات، صحراء، ساحل، جبال، ليل.
   لاستبدال أي رسمة بصورة حقيقية: أضف الحقل img في data.js (انظر README).
   ===================================================================== */
(function(){
const SPRITE=`
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
<defs>
  <linearGradient id="gGold" x1="0" x2="1"><stop offset="0" stop-color="#8C6418"/><stop offset=".35" stop-color="#C99A35"/><stop offset=".6" stop-color="#F2D27E"/><stop offset="1" stop-color="#9A6E1E"/></linearGradient>
  <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#E4DACA"/></linearGradient>
  <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A4A70"/><stop offset="1" stop-color="#1B2440"/></linearGradient>
  <linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121B33"/><stop offset=".42" stop-color="#2B3456"/><stop offset=".75" stop-color="#8E5A3C"/><stop offset="1" stop-color="#E5A957"/></linearGradient>
  <linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1020"/><stop offset=".6" stop-color="#18213C"/><stop offset="1" stop-color="#3A2E35"/></linearGradient>
  <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5F95B8"/><stop offset=".6" stop-color="#B9D3DE"/><stop offset="1" stop-color="#F1E2C4"/></linearGradient>
  <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B4876"/><stop offset="1" stop-color="#14274A"/></linearGradient>
  <linearGradient id="gSeaDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3F7EA6"/><stop offset="1" stop-color="#1F4E78"/></linearGradient>
  <linearGradient id="gSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8D3A6"/><stop offset="1" stop-color="#C9A86E"/></linearGradient>
  <radialGradient id="gSun"><stop offset="0" stop-color="#F6D58A" stop-opacity=".95"/><stop offset=".35" stop-color="#E5A957" stop-opacity=".45"/><stop offset="1" stop-color="#E5A957" stop-opacity="0"/></radialGradient>
  <radialGradient id="gFire"><stop offset="0" stop-color="#FFC56B" stop-opacity=".85"/><stop offset=".4" stop-color="#E5772E" stop-opacity=".35"/><stop offset="1" stop-color="#E5772E" stop-opacity="0"/></radialGradient>
</defs>
<symbol id="rv-wheel" viewBox="-15 -15 30 30"><circle r="14" fill="#1A1617"/><circle r="8" fill="#9E9384"/><circle r="7" fill="#7A7065"/><circle r="2.4" fill="#1A1617"/></symbol>
<symbol id="rv-mh" viewBox="0 0 240 120">
  <ellipse cx="122" cy="112" rx="112" ry="5" fill="#000" opacity=".28"/>
  <rect x="54" y="8" width="32" height="10" rx="3" fill="#D6CEC0"/><rect x="132" y="10" width="18" height="7" rx="2" fill="#D6CEC0"/>
  <path d="M14 96V30Q14 16 28 16H196Q206 16 208 26L210 40L224 60Q233 62 233 73V96Z" fill="url(#gBody)"/>
  <path d="M14 69H233V77H14Z" fill="url(#gGold)"/><path d="M14 79H233V82H14Z" fill="#231F20" opacity=".85"/>
  <rect x="24" y="23" width="82" height="5" rx="2.5" fill="#8C6418"/>
  <rect x="30" y="33" width="40" height="21" rx="4" fill="url(#gGlass)"/><path d="M33 35H46L37 52H33Z" fill="#fff" opacity=".16"/>
  <rect x="124" y="33" width="36" height="21" rx="4" fill="url(#gGlass)"/><path d="M127 35H138L130 52H127Z" fill="#fff" opacity=".16"/>
  <rect x="168" y="21" width="28" height="8" rx="3" fill="url(#gGlass)"/>
  <path d="M171 42H208L221 61H171Z" fill="url(#gGlass)"/><path d="M174 44H190L182 59H174Z" fill="#fff" opacity=".14"/>
  <rect x="88" y="31" width="24" height="50" rx="4" fill="none" stroke="#B9AE9B" stroke-width="2"/><circle cx="107" cy="58" r="1.8" fill="#8C6418"/>
  <rect x="227" y="64" width="6" height="6" rx="1.5" fill="#FFE7A8"/><rect x="14" y="58" width="4" height="9" fill="#B5432F"/>
  <path d="M40 96a22 22 0 0 1 44 0M174 96a22 22 0 0 1 44 0" fill="#3B3433"/>
  <path d="M14 96H233" stroke="#2E2928" stroke-width="4" stroke-linecap="round"/>
  <use href="#rv-wheel" x="47" y="83" width="30" height="30"/><use href="#rv-wheel" x="181" y="83" width="30" height="30"/>
</symbol>
<symbol id="rv-tt" viewBox="0 0 200 110">
  <ellipse cx="104" cy="104" rx="90" ry="4.5" fill="#000" opacity=".28"/>
  <path d="M0 90H26" stroke="#3B3433" stroke-width="4" stroke-linecap="round"/><path d="M12 92V103" stroke="#3B3433" stroke-width="3"/>
  <rect x="88" y="6" width="22" height="9" rx="3" fill="#D6CEC0"/>
  <path d="M24 90V40Q24 14 54 14H170Q189 14 189 34V90Z" fill="url(#gBody)"/>
  <path d="M24 63H189V70H24Z" fill="url(#gGold)"/><path d="M24 72H189V75H24Z" fill="#231F20" opacity=".85"/>
  <rect x="34" y="30" width="32" height="19" rx="8" fill="url(#gGlass)"/>
  <rect x="122" y="30" width="48" height="19" rx="4" fill="url(#gGlass)"/><path d="M125 32H137L129 47H125Z" fill="#fff" opacity=".16"/>
  <rect x="80" y="28" width="22" height="54" rx="4" fill="none" stroke="#B9AE9B" stroke-width="2"/><circle cx="97" cy="56" r="1.8" fill="#8C6418"/>
  <path d="M104 90a19 19 0 0 1 38 0" fill="#3B3433"/>
  <path d="M24 90H189" stroke="#2E2928" stroke-width="4" stroke-linecap="round"/>
  <use href="#rv-wheel" x="109" y="79" width="28" height="28"/>
</symbol>
<symbol id="rv-tow" viewBox="0 0 330 110">
  <use href="#rv-tt" width="200" height="110" transform="translate(200 0) scale(-1 1)"/>
  <ellipse cx="262" cy="104" rx="60" ry="4.5" fill="#000" opacity=".28"/>
  <path d="M202 94V66Q202 58 210 58H228L244 40Q248 36 255 36H300Q309 36 311 45L317 62Q322 64 322 71V94Z" fill="#2E2928"/>
  <path d="M232 58L247 42H272V58Z" fill="url(#gGlass)"/><path d="M277 42H300Q304 42 305 47L308 58H277Z" fill="url(#gGlass)"/>
  <path d="M202 74H322" stroke="url(#gGold)" stroke-width="3"/>
  <rect x="316" y="64" width="6" height="5" rx="1.5" fill="#FFE7A8"/>
  <path d="M212 94a17 17 0 0 1 34 0M276 94a17 17 0 0 1 34 0" fill="#1F1B1C"/>
  <use href="#rv-wheel" x="216" y="81" width="26" height="26"/><use href="#rv-wheel" x="280" y="81" width="26" height="26"/>
</symbol>
<symbol id="palm" viewBox="0 0 80 140"><path d="M40 140Q44 100 38 52" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"/><g fill="currentColor"><path d="M38 52Q14 38 2 48Q20 40 38 56Z"/><path d="M38 52Q60 34 78 44Q58 40 40 57Z"/><path d="M38 52Q30 22 12 14Q32 22 41 50Z"/><path d="M38 52Q52 20 70 16Q52 26 42 52Z"/><path d="M38 52Q40 30 38 8Q44 30 42 52Z"/></g></symbol>
<symbol id="kite" viewBox="0 0 80 40"><path d="M2 32Q40-8 78 32Q40 12 2 32Z" fill="currentColor"/><path d="M2 32Q40 12 78 32" fill="none" stroke="#231F20" stroke-width="1" opacity=".4"/></symbol>
</svg>`;
document.body.insertAdjacentHTML('afterbegin',SPRITE);

/* نجوم بتوزيع ثابت */
function stars(n,w,h,seed){let s=seed||7,o='';const r=()=>(s=(s*9301+49297)%233280)/233280;for(let i=0;i<n;i++){o+=`<circle class="tw" cx="${(r()*w).toFixed(1)}" cy="${(r()*h).toFixed(1)}" r="${(r()*1.3+.4).toFixed(2)}" fill="#FFF6DD" style="animation-delay:${(r()*3).toFixed(2)}s"/>`}return o}
const fire=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle class="glow2" r="46" fill="url(#gFire)"/><path d="M-14 6L14 0M-14 0L14 6" stroke="#3B2A20" stroke-width="4" stroke-linecap="round"/><path class="fl" d="M0 2C-10 -6 -6 -16 0 -26C6 -16 10 -6 0 2Z" fill="#F2A23A"/><path class="fl fl2" d="M0 2C-5 -3 -3 -10 0 -16C3 -10 5 -3 0 2Z" fill="#FFE08A"/></g>`;

const SCENES={
coast:()=>`<rect width="400" height="240" fill="url(#gDusk)"/>${stars(14,400,90,3)}
<circle class="glow" cx="292" cy="150" r="70" fill="url(#gSun)"/><circle cx="292" cy="150" r="17" fill="#F7DA92"/>
<path d="M0 150H400V240H0Z" fill="url(#gSea)"/>
<g class="shim" stroke="#F2D27E" stroke-linecap="round"><path d="M252 160H332" stroke-width="2"/><path d="M264 170H320" stroke-width="2"/><path d="M276 180H308" stroke-width="1.6"/><path d="M286 189H298" stroke-width="1.4"/></g>
<path d="M0 172H190V177H0Z" fill="#1A1617"/><g fill="#1A1617"><rect x="20" y="177" width="3" height="16"/><rect x="70" y="177" width="3" height="16"/><rect x="120" y="177" width="3" height="16"/><rect x="170" y="177" width="3" height="16"/></g>
<path d="M0 204Q120 188 240 200T400 196V240H0Z" fill="#2E2928"/>
<g stroke="#C99A35" stroke-width="1.5" opacity=".55"><path d="M60 240L90 206"/><path d="M150 240L172 204"/><path d="M240 240L254 203"/><path d="M330 240L338 200"/></g>
<use href="#rv-mh" x="70" y="148" width="150" height="75"/>
<use href="#palm" x="336" y="118" width="46" height="84" style="color:#151213"/><use href="#palm" x="10" y="140" width="34" height="62" style="color:#151213"/>`,

mountain:()=>`<rect width="400" height="240" fill="url(#gDusk)"/>${stars(22,400,100,11)}
<circle class="glow" cx="90" cy="120" r="60" fill="url(#gSun)"/>
<path d="M0 160L50 112L92 142L150 72L214 138L270 98L330 132L400 104V240H0Z" fill="#4A3F3D"/>
<path d="M150 72L170 92L160 96L176 112L150 100Z" fill="#5C4F4B"/>
<path d="M0 182L80 150L150 176L230 146L310 172L400 150V240H0Z" fill="#3B3433"/>
<path d="M0 190H400V200H0Z" fill="url(#gSea)" opacity=".9"/>
<path d="M0 206Q140 196 260 206T400 204V240H0Z" fill="#2A2425"/>
<use href="#rv-tt" x="200" y="150" width="140" height="77"/>${fire(140,214,.8)}
<use href="#rv-mh" x="18" y="160" width="110" height="55"/>`,

kite:()=>`<rect width="400" height="240" fill="url(#gDay)"/>
<circle cx="70" cy="56" r="16" fill="#FFF3D1"/><circle cx="70" cy="56" r="40" fill="#FFF3D1" opacity=".25"/>
<g class="cloud" fill="#fff" opacity=".7"><ellipse cx="160" cy="44" rx="26" ry="7"/><ellipse cx="176" cy="38" rx="16" ry="8"/></g>
<path d="M0 140H400V196H0Z" fill="url(#gSeaDay)"/>
<g class="shim" stroke="#fff" stroke-linecap="round" opacity=".7"><path d="M40 156H90" stroke-width="1.5"/><path d="M220 166H280" stroke-width="1.5"/><path d="M320 152H360" stroke-width="1.5"/></g>
<path d="M0 184Q120 172 230 182T400 178V240H0Z" fill="url(#gSand)"/>
<g class="bob"><use href="#kite" x="232" y="26" width="70" height="35" style="color:#C99A35"/></g>
<g class="bob b2"><use href="#kite" x="310" y="58" width="50" height="25" style="color:#1B3358"/></g>
<path d="M266 52Q300 120 336 186M334 76Q350 130 352 184" stroke="#231F20" stroke-width=".7" fill="none" opacity=".5"/>
<use href="#rv-mh" x="40" y="146" width="150" height="75"/>
<use href="#palm" x="10" y="120" width="40" height="76" style="color:#2E4A3A"/>`,

tiles:()=>`<rect width="400" height="240" fill="url(#gDay)"/>
<path d="M0 132L60 104L110 120L180 86L250 116L320 92L400 120V160H0Z" fill="#A99682" opacity=".7"/>
<path d="M0 150L80 130L160 146L240 126L320 142L400 128V170H0Z" fill="#8E7C69" opacity=".8"/>
<g><path d="M0 170H400V240H0Z" fill="#CDB389"/>
<path d="M0 196L400 166V178L0 208Z" fill="#C99A35"/><path d="M0 214L400 184V196L0 226Z" fill="#8C6418"/><path d="M0 232L400 202V214L0 244Z" fill="#E8D3A6"/></g>
<use href="#rv-mh" x="18" y="128" width="160" height="80"/><use href="#rv-tow" x="196" y="140" width="190" height="64"/>`,

night:()=>`<rect width="400" height="240" fill="url(#gNight)"/>${stars(60,400,150,21)}
<path class="shoot" d="M60 30L110 50" stroke="#FFF6DD" stroke-width="1.4" stroke-linecap="round"/>
<path d="M330 40a18 18 0 1 0 14 30a14 14 0 1 1 -14 -30Z" fill="#F6E7C0"/>
<path d="M0 170Q100 146 200 164T400 156V240H0Z" fill="#2E2928"/>
<path d="M0 196Q130 182 250 194T400 190V240H0Z" fill="#231F20"/>
<use href="#rv-tt" x="26" y="122" width="150" height="82"/>
<path d="M176 140Q236 168 296 150" stroke="#3B3433" stroke-width="1" fill="none"/><path d="M296 150V196" stroke="#3B3433" stroke-width="2"/>
<g fill="#FFD983">${[0,1,2,3,4,5,6,7].map(i=>{const t=i/7,x=176+t*120,y=140+Math.sin(t*Math.PI)*20+(t*10);return `<circle class="tw" cx="${x.toFixed(1)}" cy="${(y+2).toFixed(1)}" r="2.4" style="animation-delay:${(i*.3).toFixed(1)}s"/>`}).join('')}</g>
${fire(232,208,1)}`,

mourn:()=>`<rect width="400" height="240" fill="url(#gNight)"/>${stars(30,400,140,5)}
<path d="M200 60a26 26 0 1 0 20 44a20 20 0 1 1 -20 -44Z" fill="#E9DFC8"/>
<path d="M0 190Q100 170 200 186T400 180V240H0Z" fill="#231F20"/>`,

doc:()=>`<rect width="400" height="240" fill="#1B3358"/><path d="M0 200Q120 180 240 196T400 190V240H0Z" fill="#14274A"/>
<g transform="translate(150 34)"><rect width="100" height="136" rx="6" fill="#FBF8F2"/><path d="M16 26H84M16 42H84M16 58H84M16 74H60" stroke="#CDB389" stroke-width="5" stroke-linecap="round"/><circle cx="72" cy="108" r="16" fill="url(#gGold)"/><circle cx="72" cy="108" r="10" fill="none" stroke="#8C6418" stroke-width="1.5"/></g>`,

desert:()=>`<rect width="400" height="240" fill="url(#gDusk)"/>${stars(18,400,90,9)}
<circle class="glow" cx="200" cy="150" r="80" fill="url(#gSun)"/><circle cx="200" cy="150" r="22" fill="#F7DA92"/>
<path d="M0 160Q90 130 180 156T400 146V240H0Z" fill="#8E5A3C" opacity=".85"/>
<path d="M0 186Q120 160 240 182T400 172V240H0Z" fill="#5A3E33"/>
<path d="M0 210Q140 196 280 210T400 206V240H0Z" fill="#2E2928"/>
<use href="#rv-tow" x="96" y="160" width="210" height="70"/>`
};
SCENES.port=SCENES.coast; SCENES.mount=SCENES.mountain;

window.CA_SCENES=SCENES;
window.sceneSVG=(key,cls='')=>`<svg class="scene ${cls}" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${(SCENES[key]||SCENES.desert)()}</svg>`;
window.caFire=fire; window.caStars=stars;
/* ربط الرسومات القديمة الصغيرة بالمشاهد الجديدة */
if(typeof ART==='object'){Object.keys(SCENES).forEach(k=>{ART[k]=SCENES[k]()})}
})();
