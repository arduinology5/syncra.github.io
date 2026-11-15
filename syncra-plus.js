/* SYNCRA Plus: icon, liquid-glass polish, refined copy, Karaoke and Auto volume.
   Load AFTER the main script, just before </body>:  <script src="syncra-plus.js"></script> */
(()=>{
const IC="icons/icon-app.webp";

/* ---------- refined copy ---------- */
Object.assign(D.ms,{sub:"Dengar muzik bersama, tepat pada masa yang sama. Cipta stesen, kongsi PIN dan berbual semasa lagu dimainkan.",name:"Nama paparan anda",pin:"PIN stesen (sekurang-kurangnya 8 aksara)",gen:"Jana PIN",agree:"Saya berhak atau mendapat kebenaran untuk memainkan dan berkongsi lagu yang saya pilih.",go:"Mula siaran",enter:"Sertai",priv:"Tiada akaun. Tiada data disimpan. Lagu dihantar terus antara peranti, tidak dimuat naik ke pelayan, dan dipadam apabila tab ditutup. Pelayan sambungan awam hanya membantu peranti saling mencari dan tidak dapat melihat lagu atau mesej anda.",addf:"Tambah lagu",empty:"Belum ada lagu. Tambah lagu untuk bermula.",lp:"Jeda untuk saya",rs:"Sambung mendengar",local:"Hanya menjeda peranti anda. Siaran diteruskan untuk semua orang.",rcv:"Memuat turun lagu",nf:"Stesen tidak dijumpai. Semak PIN dan pastikan hos masih menyiarkan.",noroom:"Tidak dapat menghubungi pelayan sambungan. Semak internet anda dan cuba lagi.",end:"Sambungan ke hos terputus. Sila sertai semula.",back:"Keluar dari stesen",pins:"PIN mesti sekurang-kurangnya 8 aksara.",needag:"Sila sahkan bahawa anda berhak memainkan lagu yang dipilih.",unsup:"Format ini tidak disokong oleh pelayar anda.",dbg:"Maklumat sambungan",eqn:"EQ, Karaoke dan Volum auto memproses audio pada peranti anda. Pada iPhone dan iPad, audio mungkin terhenti apabila skrin dikunci.",https:"Aplikasi ini memerlukan HTTPS. Buka melalui alamat https://, bukan fail setempat.",used:"PIN ini sedang digunakan. Sila pilih PIN lain.",skip:"fail bukan audio dilangkau",fmt:"Menyokong MP3, M4A/AAC, OGG/Opus, FLAC, WAV dan AIFF. FLAC, WAV dan AIFF dimainkan tanpa kehilangan kualiti (lossless).",cmt:"Tulis mesej…",ppl:"Dalam stesen",ctl:"Kawalan",aa:"Benarkan pendengar menambah lagu",ctn:"Beri pendengar kawalan untuk main, jeda, langkau dan buang lagu.",noadd:"Hos tidak membenarkan penambahan lagu.",big:"Fail terlalu besar. Had maksimum ialah 150 MB.",noc:"Belum ada mesej. Mulakan perbualan!",needn:"Masukkan nama paparan untuk menyertai.",rm:"Keluarkan",removed:"telah dikeluarkan dari stesen",kicked:"Hos telah mengeluarkan anda dari stesen.",sig:"Menyambung…",viz:"Latar bergerak mengikut rentak",sing:"Karaoke",auto:"Volum auto",voc:"Tahap vokal",vol0:"Tiada vokal",vol1:"Vokal penuh",kh:"Mengurangkan suara penyanyi pada peranti anda. Paling berkesan pada rakaman stereo studio.",aon:"Volum auto hidup: lagu dimainkan pada kelantangan yang seragam",aoff:"Volum auto mati",fxi:"iPhone dan iPad: audio mungkin terhenti apabila skrin dikunci semasa Karaoke atau Volum auto aktif."});
Object.assign(D.en,{sub:"Listen together, perfectly in sync. Create a station, share the PIN and chat while the music plays.",name:"Your display name",pin:"Station PIN (8+ characters)",gen:"Generate",agree:"I own or have permission to play and share the songs I choose.",go:"Start station",enter:"Join",priv:"No accounts. No stored data. Songs travel directly between devices, are never uploaded to a server and disappear when the tab closes. The public connection service only helps devices find each other and can’t see your songs or messages.",addf:"Add songs",empty:"No songs yet. Add some to get started.",lp:"Pause for me",rs:"Resume",local:"Pauses audio on your device only. The station keeps playing for everyone else.",rcv:"Downloading song",nf:"Station not found. Check the PIN and make sure the host is still online.",noroom:"Can’t reach the connection service. Check your internet and try again.",end:"Lost connection to the host. Please rejoin.",back:"Leave station",pins:"PIN must be at least 8 characters.",needag:"Please confirm you have the right to play the songs you choose.",unsup:"Your browser can’t play this format.",dbg:"Connection details",eqn:"EQ, Karaoke and Auto volume process audio on your device. On iPhone and iPad, audio may pause when the screen locks.",https:"HTTPS is required. Open the app from its https:// address, not a local file.",used:"That PIN is already in use. Choose another.",skip:"non-audio files skipped",fmt:"Supports MP3, M4A/AAC, OGG/Opus, FLAC, WAV and AIFF. FLAC, WAV and AIFF play losslessly.",cmt:"Send a message…",ppl:"In this station",ctl:"Control",aa:"Let listeners add songs",ctn:"Give a listener control to play, pause, skip and remove songs.",noadd:"The host isn’t accepting added songs.",big:"File too large. The limit is 150 MB.",noc:"No messages yet. Say hello!",needn:"Enter a display name to join.",rm:"Remove",removed:"was removed from the station",kicked:"The host removed you from the station.",sig:"Connecting…",viz:"Background moves with the beat",sing:"Karaoke",auto:"Auto volume",voc:"Vocal level",vol0:"No vocals",vol1:"Full vocals",kh:"Reduces the lead vocal on your device. Works best on studio stereo recordings.",aon:"Auto volume on: songs play at a consistent loudness",aoff:"Auto volume off",fxi:"iPhone and iPad: audio may pause when the screen locks while Karaoke or Auto volume is on."});

/* ---------- styles ---------- */
const st=document.createElement("style");st.textContent=`
:root{--ac:#6b4bf5}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--ac:#9a85ff}}
:root[data-theme="dark"]{--ac:#9a85ff}
.pri{background:linear-gradient(180deg,#9a85ff,var(--ac));box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 6px 18px rgba(107,75,245,.38)}
#bg i{translate:calc(var(--px,0)*-3vmax) calc(var(--py,0)*-3vmax);transition:--c 2.4s,translate .9s cubic-bezier(.2,.8,.2,1)}
.gl{position:relative}
.card::after,.gl::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(260px circle at var(--mx,50%) var(--my,0),rgba(255,255,255,.3),rgba(255,255,255,.06) 45%,transparent 70%)}
.hot::after{opacity:1}
button{transition:transform .35s cubic-bezier(.3,1.6,.5,1),background .2s}
button:active{transform:scale(.92)}
.brand{display:flex;align-items:center;gap:10px}.brand img{width:38px;height:38px;filter:drop-shadow(0 4px 10px rgba(90,60,255,.45))}
.hero{display:block;width:104px;height:104px;margin:6px auto 4px;filter:drop-shadow(0 14px 28px rgba(90,60,255,.5));translate:calc(var(--px,0)*10px) calc(var(--py,0)*8px);transition:translate .6s;animation:fl 6s ease-in-out infinite alternate}
@keyframes fl{to{transform:translateY(-6px) rotate(-2deg)}}
@media(min-width:960px){#home>.hero{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.hero{animation:none}}
.art.ph{box-shadow:none;filter:drop-shadow(0 18px 34px rgba(70,50,230,.5))}
#tb button.on{background:none}
#tb .lens{position:absolute;top:6px;bottom:6px;left:0;width:0;border-radius:999px;background:var(--fl);box-shadow:inset 0 1px 0 var(--hi),0 4px 14px rgba(0,0,0,.15);backdrop-filter:blur(8px) saturate(200%) brightness(1.08);-webkit-backdrop-filter:blur(8px) saturate(200%) brightness(1.08);transition:transform .45s cubic-bezier(.3,1.25,.5,1),width .45s cubic-bezier(.3,1.25,.5,1);pointer-events:none}
.fxr{display:flex;gap:8px;margin-top:14px}
.fxb{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 8px;font-size:14px;font-weight:600}
.fxb em{font-style:normal;font-size:11px;font-weight:500;opacity:.85}
.fxb.on{background:linear-gradient(180deg,#9a85ff,var(--ac));color:#fff;box-shadow:0 6px 20px rgba(107,75,245,.4),inset 0 1px 0 rgba(255,255,255,.4)}
.kp{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.3,1,.5,1)}
.kp.open{grid-template-rows:1fr}.kpi{overflow:hidden;min-height:0}
.kl{display:flex;justify-content:space-between;font-weight:600;font-size:14px;margin-top:12px}.kl b{color:var(--ac);font-variant-numeric:tabular-nums}
`;document.head.append(st);

/* ---------- head tags (skipped if already present) ---------- */
const hd=(g,a)=>{const k=g=="meta"?"name":"rel";if(!document.head.querySelector(g+"["+k+'="'+a[k]+'"]')){const e=document.createElement(g);for(const x in a)e.setAttribute(x,a[x]);document.head.append(e)}};
hd("link",{rel:"icon",type:"image/png",href:"icons/favicon.png"});
hd("link",{rel:"apple-touch-icon",href:"icons/apple-touch-icon.png"});
hd("link",{rel:"manifest",href:"manifest.webmanifest"});
hd("meta",{name:"theme-color",content:"#0b0820"});
hd("meta",{name:"description",content:"SYNCRA: Dengar bersama, serentak. Listen together, in sync."});
hd("meta",{name:"apple-mobile-web-app-capable",content:"yes"});
if(window.MediaMetadata){const MM=window.MediaMetadata;window.MediaMetadata=function(o){if(o&&!(o.artwork&&o.artwork.length))o.artwork=[{src:new URL("icons/icon-512.png",location.href).href,sizes:"512x512",type:"image/png"}];return new MM(o)}}

/* ---------- branding ---------- */
const h1=$("header h1"),bw=mk("div","brand"),bi=new Image();
bi.src=IC;bi.alt="";bi.width=bi.height=38;h1.before(bw);bw.append(bi,h1);
const hr=new Image();hr.src=IC;hr.alt="SYNCRA";hr.className="hero";hr.width=hr.height=104;$("#home").prepend(hr);

/* ---------- liquid glass: pointer light + background parallax ---------- */
let hot=null,raf=0,px=0,py=0;
const mv=e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
 const r=document.documentElement.style;r.setProperty("--px",(px/innerWidth-.5).toFixed(3));r.setProperty("--py",(py/innerHeight-.5).toFixed(3));
 const g=document.elementFromPoint(px,py),el=g&&g.closest(".card,.gl");
 if(hot&&hot!==el)hot.classList.remove("hot");
 if(el){const b=el.getBoundingClientRect();el.style.setProperty("--mx",px-b.left+"px");el.style.setProperty("--my",py-b.top+"px");el.classList.add("hot")}
 hot=el})};
addEventListener("pointermove",mv,{passive:true});addEventListener("pointerdown",mv,{passive:true});
addEventListener("pointerup",e=>{if(e.pointerType!="mouse")setTimeout(()=>{if(hot){hot.classList.remove("hot");hot=null}},350)});

/* sliding glass lens behind the active tab */
const nv=$("#tb"),ln=mk("i","lens");nv.prepend(ln);
const lens=()=>{const b=nv.querySelector("button.on");if(!b||nv.hidden)return;ln.style.width=b.offsetWidth+"px";ln.style.transform="translateX("+b.offsetLeft+"px)"};
const _sw=sw,_sh=show;sw=i=>{_sw(i);lens()};show=i=>{_sh(i);requestAnimationFrame(lens)};addEventListener("resize",lens);

/* ---------- artwork: icon placeholder + background colours from the cover ---------- */
function pal(u){const m=new Image();m.onload=()=>{try{const c=document.createElement("canvas");c.width=c.height=20;const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(m,0,0,20,20);
 const d=g.getImageData(0,0,20,20).data,hs=[];
 for(let i=0;i<d.length;i+=4){const r=d[i]/255,q=d[i+1]/255,b=d[i+2]/255,mx=Math.max(r,q,b),mn=Math.min(r,q,b),l=(mx+mn)/2,s=mx==mn?0:(mx-mn)/(1-Math.abs(2*l-1));
  if(s<.28||l<.15||l>.88)continue;const h=mx==r?((q-b)/(mx-mn)+6)%6:mx==q?(b-r)/(mx-mn)+2:(r-q)/(mx-mn)+4;hs.push([h*60,s])}
 hs.sort((x,y)=>y[1]-x[1]);const p=[];
 for(const [h] of hs){if(p.every(z=>{const f=Math.abs(z-h);return Math.min(f,360-f)>35}))p.push(h);if(p.length>3)break}
 if(p.length)$$("#bg i").forEach((e,i)=>e.style.setProperty("--c","hsl("+p[i%p.length]+",80%,"+(52+i%2*8)+"%)"))}catch(e){}};m.src=u}
const _art=art;
art=x=>{_art(x);const a=$(".art"),u=x&&CV.get(x.id);a.classList.toggle("ph",!u);
 if(u)pal(u);else{a.style.background="center/contain no-repeat url("+IC+")";a.textContent=""}};

/* ---------- audio: Karaoke (vocal level) + Auto volume ---------- */
const K={},TG=-17;let kOn=0,kv=0,aOn=0,lvl=null,nF=0,key="";
function wire(){const c=ctx,fb=(t,f,v)=>{const b=c.createBiquadFilter();b.type=t;b.frequency.value=f;if(v!=null)b.gain.value=v;return b};
 an.disconnect();
 const up=c.createGain(),sp=c.createChannelSplitter(2),mg=c.createChannelMerger(2),mid=c.createGain(),inv=c.createGain(),oL=c.createGain(),oR=c.createGain(),gn=c.createGain(),lim=c.createDynamicsCompressor(),la=c.createAnalyser(),z=c.createGain();
 up.channelCount=2;up.channelCountMode="explicit";mid.gain.value=.5;inv.gain.value=0;z.gain.value=0;la.fftSize=2048;
 lim.knee.value=0;lim.attack.value=.002;lim.release.value=.12;
 /* karaoke: remove the centre-panned vocal band (200 Hz-6 kHz); bass, kick and highs stay untouched */
 an.connect(up);up.connect(sp);sp.connect(oL,0);sp.connect(oR,1);sp.connect(mid,0);sp.connect(mid,1);
 mid.connect(fb("highpass",200)).connect(fb("lowpass",6000)).connect(inv);inv.connect(oL);inv.connect(oR);
 oL.connect(mg,0,0);oR.connect(mg,0,1);
 /* auto volume: gain + limiter, measured on a loudness-weighted tap */
 mg.connect(gn);gn.connect(lim);lim.connect(c.destination);
 mg.connect(fb("highpass",80)).connect(fb("highshelf",2000,4)).connect(la);la.connect(z);z.connect(c.destination);
 Object.assign(K,{c,inv,gn,lim,la,buf:new Float32Array(2048)})}
function gdb(g){const e=$("#gdb");if(e)e.textContent=aOn&&Math.abs(g)>=.5?(g>0?"+":"")+g.toFixed(0)+" dB":""}
function apply(){if(!K.c)return;const n=K.c.currentTime;K.inv.gain.setTargetAtTime(kOn?kv-1:0,n,.06);
 K.lim.threshold.value=aOn?-3:0;K.lim.ratio.value=aOn?20:1;
 if(!aOn){lvl=null;K.gn.gain.setTargetAtTime(1,n,.15);gdb(0)}}
const _eq=eqInit;
eqInit=function(){const n=!ctx;_eq();if(n&&ctx&&!K.c)try{wire()}catch(e){LOG("fx "+e)}apply()};
setInterval(()=>{if(!aOn||!K.c||au.paused)return;
 K.la.getFloatTimeDomainData(K.buf);let s=0;for(const v of K.buf)s+=v*v;const db=10*Math.log10(s/K.buf.length+1e-12);
 if(au.src!=key){key=au.src;lvl=null;nF=0}
 if(db<-55)return;
 nF++;lvl=lvl==null?db:lvl+(db-lvl)*(nF<40?.15:.015);
 const g=Math.max(-14,Math.min(12,TG-lvl));
 K.gn.gain.setTargetAtTime(Math.pow(10,g/20),K.c.currentTime,nF<40?.25:1);gdb(g)},100);

/* ---------- controls ---------- */
const fx=mk("div","fx"),I1='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>',I2='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M4 10h3v4H4zm6-5h3v14h-3zm6 3h3v8h-3z"/></svg>';
fx.innerHTML='<div class="fxr"><button class="fxb" id="kb" aria-pressed="false">'+I1+'<span data-i="sing"></span></button><button class="fxb" id="ab" aria-pressed="false">'+I2+'<span data-i="auto"></span><em id="gdb"></em></button></div>'
 +'<div class="kp" id="kp"><div class="kpi"><div class="kl"><span data-i="voc"></span><b id="kv">0%</b></div><input type="range" id="ks" min="0" max="100" step="1" value="0" aria-label="Vocal level"><div class="tm"><span data-i="vol0"></span><span data-i="vol1"></span></div><p class="nt" data-i="kh"></p></div></div><p class="nt" id="fxn"></p>';
$("#vol").closest(".row").after(fx);
if(IOS)$("#fxn").dataset.i="fxi";
const kb=$("#kb"),ab=$("#ab"),ks=$("#ks"),kp=$("#kp"),boot=()=>{try{eqInit()}catch(e){toast(t("unsup"))}};
kb.onclick=()=>{kOn=!kOn;if(kOn)boot();kb.classList.toggle("on",!!kOn);kb.setAttribute("aria-pressed",!!kOn);kp.classList.toggle("open",!!kOn);apply()};
ab.onclick=()=>{aOn=!aOn;if(aOn)boot();ab.classList.toggle("on",!!aOn);ab.setAttribute("aria-pressed",!!aOn);apply();toast(t(aOn?"aon":"aoff"))};
ks.oninput=()=>{kv=ks.value/100;$("#kv").textContent=ks.value+"%";pg(ks);apply()};pg(ks);

tr();art(Q[cur]);lens();
})();
