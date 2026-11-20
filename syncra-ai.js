/* SYNCRA AI: HTDemucs karaoke + Whisper lyrics. PC + NVIDIA GPU only, runs locally per device.
   Load after syncra-viz.js. Models download from their original source (Hugging Face) into Downloads/syncraAI. */
(()=>{
const V="https://cdn.jsdelivr.net/npm/",ORT=V+"onnxruntime-web@1.30.0/dist/",DEM=V+"demucs-web@1.0.2/src/index.js",TJS=V+"@huggingface/transformers@3.8.1/+esm",HOST="https://syncra-ai.local/";
const S={aik:["Karaoke AI","AI Karaoke"],ail:["Lirik AI","AI Lyrics"],need:["AI memerlukan PC dengan GPU NVIDIA (Chrome atau Edge).","AI needs a PC with an NVIDIA GPU (Chrome or Edge)."],st:["Model AI","AI models"],
intro:["Ciri AI berjalan sepenuhnya pada PC anda. Model dimuat turun sekali terus dari sumber asalnya (Hugging Face) dan disimpan dalam folder Downloads/syncraAI.","AI features run entirely on your PC. Models are downloaded once, directly from their original source (Hugging Face), and kept in your Downloads/syncraAI folder."],
agree:["Saya bersetuju memuat turun fail model AI (HTDemucs, Whisper) dari sumber asalnya (Hugging Face) dan menyimpannya dalam folder yang saya pilih. Model berlesen sumber terbuka dan berjalan pada peranti ini sahaja; audio tidak dimuat naik.","I agree to download the AI model files (HTDemucs, Whisper) from their original source (Hugging Face) and save them to the folder I choose. The models use open-source licences and run on this device only; no audio is uploaded."],
tip:["Cipta folder bernama syncraAI dalam Downloads, kemudian pilih.","Create a folder named syncraAI inside Downloads, then select it."],pick:["Pilih folder syncraAI","Choose syncraAI folder"],cont:["Teruskan","Continue"],close:["Tutup","Close"],
nag:["Sila tandakan persetujuan dahulu.","Please tick the agreement first."],chk:["Menyemak model…","Checking models…"],dl:["Memuat turun","Downloading"],ready:["Model sedia.","Models ready."],nomf:["Senarai model AI tidak dijumpai di tapak ini.","The AI model list wasn’t found on this site."],fail:["Gagal","Failed"],
ldm:["Memuatkan model AI…","Loading AI model…"],lyg:["Menjana lirik…","Generating lyrics…"],lyw:["Mainkan lagu untuk menjana lirik.","Play a song to generate lyrics."],lyn:["Tiada lirik dikesan.","No lyrics detected."],lyh:["Lirik dijana AI pada peranti anda dan mungkin tidak tepat.","Lyrics are AI-generated on your device and may be inaccurate."]};
const x=k=>S[k][lang=="ms"?0:1],mb=n=>Math.round(n/1048576);
const HF="https://huggingface.co/",WR=HF+"onnx-community/whisper-base/resolve/main/";
const wf=(a,o)=>a.map(n=>({p:"whisper-base/"+n,u:WR+n,m:n.endsWith(".onnx")?5e6:1,o}));
const MD={htdemucs:{label:"HTDemucs (AI karaoke)",sz:"≈180 MB",files:[{p:"htdemucs/htdemucs_embedded.onnx",u:HF+"timcsy/demucs-web-onnx/resolve/main/htdemucs_embedded.onnx",m:1e8}]},
 whisper:{label:"Whisper base (AI lyrics)",sz:"≈100–250 MB",files:[...wf(["onnx/encoder_model.onnx","onnx/decoder_model_merged_q4.onnx","config.json","preprocessor_config.json","tokenizer.json","tokenizer_config.json","generation_config.json"]),...wf(["normalizer.json","added_tokens.json","special_tokens_map.json","vocab.json","merges.txt"],1)]}};
let IDX={};

const st=document.createElement("style");st.textContent=`
.aiov{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.aisheet{width:min(92vw,460px);margin:0}.aib{height:6px;border-radius:6px;background:var(--fl);overflow:hidden;margin:10px 0}.aib i{display:block;height:100%;width:0;background:var(--ac);transition:width .2s}
#lyp{display:none}body.ly #lyp{display:block}
body.ly #pl .pane:nth-child(n+2),body.ly #tb,body.ly #fl{display:none!important}
#lyp .card{height:70vh;margin:0;display:flex;flex-direction:column}
#lyl{position:relative;flex:1;overflow-y:auto;scroll-behavior:smooth;padding:28vh 6px;scrollbar-width:none;-webkit-mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent)}
#lyl::-webkit-scrollbar{display:none}
#lyl p{font-size:clamp(24px,3.2vw,40px);font-weight:800;line-height:1.25;margin:0 0 .6em;color:var(--t2);opacity:.4;transform-origin:left;transition:opacity .35s,transform .35s,color .35s;cursor:pointer}
#lyl p.on{color:var(--tx);opacity:1;transform:scale(1.04)}
@media(min-width:960px){body.ly #pl:not([hidden]){grid-template-columns:minmax(380px,.9fr) 1.6fr}body.ly #lyp{grid-column:2;grid-row:1/3}#lyp .card{height:calc(100vh - 40px)}}
`;document.head.append(st);

/* capture the media-element source so the original path can be muted while AI stems play */
const SX={},_c=AudioContext.prototype.createMediaElementSource;
AudioContext.prototype.createMediaElementSource=function(e){const n=_c.call(this,e);SX.src=n;return n};

/* ---------- eligibility: PC + NVIDIA GPU + File System Access ---------- */
async function elig(){try{if(!window.showDirectoryPicker||!navigator.gpu||IOS||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||(navigator.userAgentData&&navigator.userAgentData.mobile))return 0;
 const a=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!a)return 0;const i=a.info||{};
 if(/nvidia/i.test(i.vendor+" "+i.description+" "+i.architecture))return 1;
 const c=document.createElement("canvas").getContext("webgl"),e=c&&c.getExtension("WEBGL_debug_renderer_info");return e&&/nvidia/i.test(c.getParameter(e.UNMASKED_RENDERER_WEBGL))?1:0}catch(e){return 0}}

/* ---------- model folder (Downloads/syncraAI) ---------- */
let DIR=null;
const idb=(m,v)=>new Promise((ok,no)=>{const r=indexedDB.open("syncra-ai",1);r.onupgradeneeded=()=>r.result.createObjectStore("k");r.onerror=no;r.onsuccess=()=>{const s=r.result.transaction("k",m=="get"?"readonly":"readwrite").objectStore("k"),q=m=="get"?s.get("dir"):s.put(v,"dir");q.onsuccess=()=>ok(q.result);q.onerror=no}});
const perm=async(h,ask)=>{const o={mode:"readwrite"};return await h.queryPermission(o)=="granted"||(ask&&await h.requestPermission(o)=="granted")};
async function fh(p,create){const a=p.split("/");let d=DIR;for(const s of a.slice(0,-1))d=await d.getDirectoryHandle(s,{create});return d.getFileHandle(a[a.length-1],{create})}
const file=async p=>(await fh(p)).getFile();
const has=async f=>{try{const z=(await file(f.p)).size;return z>0&&(IDX[f.p]==z||(f.m>1e6&&z>=f.m))}catch(e){return 0}};
const loadIdx=async()=>{try{IDX=JSON.parse(await(await file(".syncra-index.json")).text())}catch(e){IDX={}}},saveIdx=async()=>{const w=await(await fh(".syncra-index.json",1)).createWritable();await w.write(JSON.stringify(IDX));await w.close()};
async function dl(f,cb){const r=await fetch(f.u);if(!r.ok)throw Error(r.status+" "+f.p.split("/").pop());const tot=+r.headers.get("content-length")||0,enc=r.headers.get("content-encoding"),w=await(await fh(f.p,1)).createWritable();
 try{const rd=r.body.getReader();let n=0;for(;;){const q=await rd.read();if(q.done)break;await w.write(q.value);n+=q.value.length;cb(n,tot)}if(tot&&!enc&&n!=tot)throw Error("incomplete "+f.p);await w.close();IDX[f.p]=n;await saveIdx()}catch(e){try{await w.abort()}catch(_){}throw e}}
function sheet(g){return new Promise(res=>{const o=mk("div","aiov"),m=MD[g];
 o.innerHTML='<div class="card aisheet"><h2></h2><p class="nt"></p><p class="nt"><b></b></p><label class="ck"><input type="checkbox" id="aic"><span></span></label><p class="nt"></p><div class="aib"><i id="aip"></i></div><p class="nt" id="ais"></p><div class="row"><button class="pri" id="aig"></button><button id="aix"></button></div></div>';
 const q=o.querySelectorAll("h2,p,b,span");q[0].textContent=x("st");q[1].textContent=x("intro");q[2].textContent=m.label+" · "+m.sz;q[3].textContent=x("agree");q[4].textContent=x("tip");
 document.body.append(o);const c=$("#aic"),gb=$("#aig"),sx=$("#ais"),bar=$("#aip");let ok=0;try{ok=localStorage.sx_ai=="1"}catch(e){}c.checked=ok;gb.textContent=DIR?x("cont"):x("pick");$("#aix").textContent=x("close");
 const end=v=>{o.remove();res(v)};$("#aix").onclick=()=>end(0);
 gb.onclick=async()=>{if(!c.checked)return toast(x("nag"));gb.disabled=true;
  try{if(!DIR||!await perm(DIR,1)){DIR=await showDirectoryPicker({id:"syncraAI",mode:"readwrite",startIn:"downloads"});await idb("put",DIR)}
   try{localStorage.sx_ai="1"}catch(e){}sx.textContent=x("chk");await loadIdx();const miss=[];for(const f of m.files)if(!await has(f))miss.push(f);
   for(let i=0;i<miss.length;i++){const f=miss[i],lb=x("dl")+" "+f.p.split("/").pop()+" ("+(i+1)+"/"+miss.length+")";sx.textContent=lb;bar.style.width="0";
    try{await dl(f,(n,t)=>{sx.textContent=lb+" · "+mb(n)+(t?" / "+mb(t):"")+" MB";if(t)bar.style.width=100*n/t+"%"})}catch(e){if(!f.o)throw e}}
   bar.style.width="100%";sx.textContent=x("ready");end(1)}catch(e){sx.textContent=e.name=="AbortError"?"":x("fail")+": "+(e.message||e);gb.disabled=false}}})}
async function ensure(g){const m=MD[g];
 try{if(!DIR)DIR=await idb("get");if(DIR&&localStorage.sx_ai=="1"&&await perm(DIR,1)){await loadIdx();let ok=1;for(const f of m.files)if(!f.o&&!await has(f)){ok=0;break}if(ok)return 1}}catch(e){}
 return sheet(g)}
/* serve Whisper files from the local folder: transformers.js fetches https://syncra-ai.local/<model>/<file> */
const _f=window.fetch;window.fetch=async function(u){const s=typeof u=="string"?u:u.url;
 if(s.startsWith(HOST)){try{const f=await file(decodeURIComponent(s.slice(HOST.length).split("?")[0]));return new Response(f,{headers:{"content-type":f.type||"application/octet-stream","content-length":f.size}})}catch(e){return new Response("",{status:404})}}
 return _f.apply(this,arguments)};

/* one GPU job at a time */
let GP=Promise.resolve();const GQ=f=>GP=GP.catch(()=>{}).then(f);

/* ---------- AI Karaoke (HTDemucs) ---------- */
const ks=$("#ks"),K={on:0},ST=new Map();let ps=null,proc=null;
const setK=v=>{const e=$("#aikE");if(e)e.textContent=v||""};
function hook(){if(SX.og||!SX.src||!fl.length)return;const c=ctx;SX.og=c.createGain();SX.ig=c.createGain();SX.vg=c.createGain();SX.sv=c.createGain();
 SX.src.disconnect();SX.src.connect(SX.og);SX.og.connect(fl[0]);SX.ig.connect(SX.sv);SX.vg.connect(SX.sv);SX.sv.connect(fl[0]);SX.sv.gain.value=au.volume}
au.addEventListener("volumechange",()=>{if(SX.sv)SX.sv.gain.value=au.volume});
const mix=()=>{if(SX.vg)SX.vg.gain.value=ks.value/100};
function stopP(){if(ps){try{ps.i.stop();ps.v.stop()}catch(e){}ps=null}if(SX.og)SX.og.gain.value=1}
function playP(){stopP();const b=ST.get(au.src);if(!K.on||!b||au.paused||!SX.og)return;
 const mk2=(f,g)=>{const s=ctx.createBufferSource();s.buffer=f;s.connect(g);return s},i=mk2(b.ib,SX.ig),v=mk2(b.vb,SX.vg),o=au.currentTime;
 i.start(0,o);v.start(0,o);ps={i,v,t0:ctx.currentTime,off:o};SX.og.gain.value=0}
async function sep(k){return GQ(async()=>{if(ST.has(k))return;if(!K.on||au.src!=k)return;
 if(!proc){setK("…");const ort=await import(ORT+"ort.webgpu.min.mjs"),{DemucsProcessor}=await import(DEM);ort.env.wasm.numThreads=1;ort.env.wasm.wasmPaths=ORT;
  proc=new DemucsProcessor({ort,sessionOptions:{executionProviders:["webgpu"]},onProgress:i=>setK(Math.round(100*(typeof i=="number"?i:i.progress))+"%")});
  await proc.loadModel(await(await file("htdemucs/htdemucs_embedded.onnx")).arrayBuffer())}
 setK("0%");const ac=new AudioContext({sampleRate:44100}),b=await ac.decodeAudioData(await(await fetch(k)).arrayBuffer());ac.close();
 const l=b.getChannelData(0),r=await proc.separate(l,b.numberOfChannels>1?b.getChannelData(1):l),n=l.length;
 const sum=c=>{const o=new Float32Array(n);for(const s of [r.drums,r.bass,r.other]){const d=s[c];for(let i=0;i<n;i++)o[i]+=d[i]}return o};
 const ib=ctx.createBuffer(2,n,44100),vb=ctx.createBuffer(2,n,44100);ib.copyToChannel(sum("left"),0);ib.copyToChannel(sum("right"),1);vb.copyToChannel(r.vocals.left,0);vb.copyToChannel(r.vocals.right,1);
 ST.set(k,{ib,vb});while(ST.size>2)ST.delete(ST.keys().next().value);setK("")})}
function run(){const k=au.src;if(!K.on||!k||k.startsWith("data:"))return;if(ST.has(k))return playP();
 sep(k).then(()=>{if(K.on&&au.src==k)playP()}).catch(e=>{toast(x("fail")+": "+(e.message||e));offK()})}
["play","playing","seeked"].forEach(e=>au.addEventListener(e,()=>{if(K.on)playP()}));
au.addEventListener("pause",stopP);au.addEventListener("loadstart",()=>{stopP();run()});
setInterval(()=>{if(ps&&!au.paused&&Math.abs(ps.off+ctx.currentTime-ps.t0-au.currentTime)>.15)playP()},1000);
function offK(){K.on=0;stopP();$("#aik").classList.remove("on");setK("");$("#kb").disabled=false;$("#kp").classList.remove("open")}
async function togK(){if(K.on)return offK();if(!await ensure("htdemucs"))return;
 const kb=$("#kb");if(kb.classList.contains("on"))kb.click();kb.disabled=true;K.on=1;$("#aik").classList.add("on");
 eqInit();hook();$("#kp").classList.add("open");ks.value=0;ks.dispatchEvent(new Event("input"));mix();run()}
ks.addEventListener("input",mix);

/* ---------- AI Lyrics (Whisper) ---------- */
const L={on:0},LC=new Map();let WP=null,LN=[],LI=-1;
const ly=mk("div");ly.id="lyp";ly.innerHTML='<div class="card"><h2 id="lyh"></h2><p class="nt" id="lys"></p><div id="lyl"></div></div>';$("#pl").append(ly);
function split(c,dur){const out=[];c.forEach((h,i)=>{const s=h.timestamp[0]||0,e=h.timestamp[1]!=null?h.timestamp[1]:(c[i+1]?c[i+1].timestamp[0]:dur)||s+5,w=h.text.trim().split(/\s+/).filter(Boolean);if(!w.length)return;
 const ls=[];let cur="";for(const z of w){if(cur&&(cur+" "+z).length>38){ls.push(cur);cur=z}else cur=cur?cur+" "+z:z}if(cur)ls.push(cur);
 const tl=ls.reduce((a,b)=>a+b.length,0);let t=s;for(const q of ls){const d=(e-s)*q.length/tl;out.push({s:t,e:t+d,t:q});t+=d}});return out}
function render(ls){LN=ls;LI=-1;$("#lyl").replaceChildren(...ls.map(l=>{const p=mk("p","",l.t);p.onclick=()=>{if(isC())act("sk",l.s)};return p}))}
au.addEventListener("timeupdate",()=>{if(!L.on||!LN.length)return;const t=au.currentTime+.15;let i=LN.findIndex(l=>t>=l.s&&t<l.e);if(i<0)i=LN.filter(l=>l.s<=t).length-1;
 if(i!=LI){LI=i;const el=$("#lyl"),c=[...el.children];c.forEach((p,j)=>p.classList.toggle("on",j==i));if(c[i])el.scrollTo({top:c[i].offsetTop-el.clientHeight/2+c[i].offsetHeight/2})}});
function gen(){const k=au.src,sx=$("#lys");if(!L.on)return;
 if(!k||k.startsWith("data:")){render([]);sx.textContent=x("lyw");return}
 if(LC.has(k)){const ls=LC.get(k);render(ls);sx.textContent=ls.length?x("lyh"):x("lyn");return}
 render([]);sx.textContent=x("ldm");
 GQ(async()=>{if(!L.on||au.src!=k)return;
  if(!WP){const T=await import(TJS);T.env.allowLocalModels=false;T.env.allowRemoteModels=true;T.env.remoteHost=HOST;T.env.remotePathTemplate="{model}/";T.env.useBrowserCache=false;
   WP=await T.pipeline("automatic-speech-recognition","whisper-base",{device:"webgpu",dtype:{encoder_model:"fp32",decoder_model_merged:"q4"}})}
  sx.textContent=x("lyg");const ac=new AudioContext({sampleRate:16000}),b=await ac.decodeAudioData(await(await fetch(k)).arrayBuffer());ac.close();
  let a=b.getChannelData(0);if(b.numberOfChannels>1){const c=b.getChannelData(1);a=a.map((v,i)=>(v+c[i])/2)}
  const o=await WP(a,{return_timestamps:true,chunk_length_s:30,stride_length_s:5,task:"transcribe"}),ls=split(o.chunks||[],b.duration);
  LC.set(k,ls);while(LC.size>6)LC.delete(LC.keys().next().value);
  if(L.on&&au.src==k){render(ls);sx.textContent=ls.length?x("lyh"):x("lyn")}}).catch(e=>{sx.textContent=x("fail")+": "+(e.message||e)})}
au.addEventListener("loadstart",gen);
async function togL(){if(L.on){L.on=0;document.body.classList.remove("ly");$("#ail").classList.remove("on");return}
 if(!await ensure("whisper"))return;L.on=1;document.body.classList.add("ly");$("#ail").classList.add("on");$("#lyh").textContent=x("ail");gen()}

/* ---------- buttons ---------- */
const row=mk("div","fxr"),note=mk("p","nt"),em=mk("em");em.id="aikE";let E=0;
row.innerHTML='<button class="fxb" id="aik" disabled></button><button class="fxb" id="ail" disabled></button>';
($(".vzp")||$("#kp")||$("#vol").closest(".row")).after(row,note);
const lab=()=>{$("#aik").replaceChildren("✦ "+x("aik")+" ",em);$("#ail").textContent="✦ "+x("ail");note.textContent=E?"":x("need")};
$("#aik").onclick=togK;$("#ail").onclick=togL;
const _tr=tr;tr=()=>{_tr();lab()};
const _s2=show;show=i=>{if(i=="home"){if(L.on)togL();if(K.on)offK()}_s2(i)};
elig().then(v=>{E=v;$("#aik").disabled=$("#ail").disabled=!v;lab()});tr();
})();
