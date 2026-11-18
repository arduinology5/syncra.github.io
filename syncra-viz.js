/* SYNCRA Visuals: 10 rhythm animations, per device, on/off. Load after syncra-plus.js. */
(()=>{
Object.assign(D.ms,{vis:"Animasi",taken:"Nama ini sedang digunakan dalam stesen. Sila pilih nama lain."});
Object.assign(D.en,{vis:"Animation",taken:"That name is already in use in this station. Choose another."});
const st=document.createElement("style");st.textContent=`
.vzp{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.3,1,.5,1)}.vzp.open{grid-template-rows:1fr}.vzi{overflow:hidden;min-height:0}
.vzp canvas{display:block;width:100%;aspect-ratio:16/9;margin-top:12px;border-radius:22px;background:#07060f;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 10px 30px rgba(0,0,0,.25);cursor:pointer}
.vzp canvas:fullscreen{width:100vw;height:100vh;aspect-ratio:auto;border-radius:0;margin:0}
.vzc{display:flex;gap:6px;overflow-x:auto;padding:10px 0 2px;scrollbar-width:none}.vzc::-webkit-scrollbar{display:none}.vzc button{flex:none;font-size:13px;padding:6px 12px}
`;document.head.append(st);

let on=0,sel=0,vA,fD,tD,W=0,H=0,dp=1,raf=0,T=0,lastP=0,fr=0,bt=0,avg=0,lastB=0;
const lv={bass:0,mid:0,hi:0},sm={},rg=[],pt=[];
let P=["#7b5cff","#4f8cff","#c77dff","#5ee7ff"];
const bk=Array.from({length:14},()=>({a:Math.random()*6,s:.2+Math.random()*.4}));
let tp=0,cv,g;

/* log-spaced, smoothed frequency bands 0..1 */
function bn(n){const o=sm[n]||(sm[n]=new Float32Array(n)),e=i=>2+358*Math.pow(i/n,2.2);
 for(let i=0;i<n;i++){const a=e(i)|0,z=Math.max(a+1,e(i+1)|0);let s=0;for(let j=a;j<z;j++)s+=fD[j];
  const v=Math.min(1,Math.pow(s/(z-a)/255,1.5)*1.3*(1+i/n*.8));o[i]=Math.max(v,o[i]*.86)}return o}
const rr=(x,y,w,h,r)=>g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h);
const lin=(x,y,x2,y2,a,b)=>{const q=g.createLinearGradient(x,y,x2,y2);q.addColorStop(0,a);q.addColorStop(1,b);return q};

const A=[
["Capsules",()=>{const n=28,b=bn(n),w=W/n,r=Math.min(w*.3,10*dp);g.fillStyle=lin(0,H,0,0,P[0],P[2]);g.beginPath();for(let i=0;i<n;i++){const h=Math.max(r*2,b[i]*H*.9);rr(i*w+w*.2,H-h-6*dp,w*.6,h,r)}g.fill()}],
["Mirror",()=>{const n=36,b=bn(n),w=W/n,r=w*.3;g.fillStyle=lin(0,0,W,0,P[1],P[3]);g.beginPath();for(let i=0;i<n;i++){const h=Math.max(r*2,b[i]*H*.85);rr(i*w+w*.2,(H-h)/2,w*.6,h,r)}g.fill()}],
["Waves",1,()=>{for(let k=0;k<3;k++){g.beginPath();for(let i=0;i<=120;i++){const v=(tD[(i/120*(tD.length-1))|0]-128)/128,x=i/120*W,y=H/2+v*H*(.4-k*.08)+Math.sin(i/9+T*(1+k))*H*.03*(1+lv.mid*2);i?g.lineTo(x,y):g.moveTo(x,y)}g.strokeStyle=P[k];g.lineWidth=(3.2-k*.6)*dp;g.lineJoin="round";g.stroke()}}],
["Aurora",1,()=>{for(let k=0;k<4;k++){g.beginPath();g.moveTo(0,H);for(let i=0;i<=40;i++){const x=i/40*W,y=H*(.62-.07*k)-Math.sin(x/W*5+T*(.6+k*.25)+k*2)*H*(.05+lv.bass*.17)-Math.sin(x/W*9-T*.8+k)*H*.03*(1+lv.mid*3);g.lineTo(x,y)}g.lineTo(W,H);g.closePath();const q=g.createLinearGradient(0,H*.2,0,H);q.addColorStop(0,P[k]);q.addColorStop(1,"transparent");g.globalAlpha=.6;g.fillStyle=q;g.fill()}g.globalAlpha=1}],
["Ripples",()=>{const cx=W/2,cy=H/2;if(bt)rg.push({r:H*.08,c:rg.length%4});g.lineWidth=3*dp;
 for(let i=rg.length-1;i>=0;i--){const o=rg[i];o.r+=(1.5+lv.bass*5)*dp;const a=1-o.r/(W*.55);if(a<=0){rg.splice(i,1);continue}g.globalAlpha=a;g.strokeStyle=P[o.c];g.beginPath();g.arc(cx,cy,o.r,0,7);g.stroke()}
 g.fillStyle=P[1];g.globalAlpha=.25;g.beginPath();g.arc(cx,cy,H*(.12+lv.bass*.1),0,7);g.fill();g.globalAlpha=1;g.beginPath();g.arc(cx,cy,H*(.07+lv.bass*.07),0,7);g.fill()}],
["Halo",()=>{const n=64,b=bn(n),cx=W/2,cy=H/2,r0=H*(.22+lv.bass*.03);g.lineCap="round";g.lineWidth=3*dp;
 for(let i=0;i<n;i++){const a=i/n*6.283+T*.12,l=2*dp+b[i]*H*.26;g.strokeStyle=P[(i/16)|0];g.beginPath();g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);g.lineTo(cx+Math.cos(a)*(r0+l),cy+Math.sin(a)*(r0+l));g.stroke()}
 g.globalAlpha=.5;g.strokeStyle=P[3];g.beginPath();g.arc(cx,cy,r0*.82,0,7);g.stroke();g.globalAlpha=1}],
["Bokeh",1,()=>{const b=bn(14);bk.forEach((o,i)=>{const x=(.5+Math.sin(T*o.s+o.a)*.42)*W,y=(.5+Math.cos(T*o.s*.8+o.a*2)*.38)*H,r=(.07+b[i]*.22)*H,q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,P[i%4]);q.addColorStop(1,"transparent");g.globalAlpha=.35+b[i]*.65;g.fillStyle=q;g.beginPath();g.arc(x,y,r,0,7);g.fill()});g.globalAlpha=1}],
["Burst",1,()=>{if(bt)for(let i=0;i<24;i++){const a=Math.random()*6.283,s=(2+Math.random()*5)*dp*(1+lv.bass);pt.push({x:W/2,y:H/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:i%4})}
 if(Math.random()<lv.mid*1.2){const a=Math.random()*6.283;pt.push({x:W/2,y:H/2,vx:Math.cos(a)*2*dp,vy:Math.sin(a)*2*dp,l:.8,c:2})}
 if(pt.length>500)pt.splice(0,100);
 for(let i=pt.length-1;i>=0;i--){const p=pt[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.04*dp;p.vx*=.99;p.l-=.012;if(p.l<=0){pt.splice(i,1);continue}g.globalAlpha=p.l;g.fillStyle=P[p.c];g.beginPath();g.arc(p.x,p.y,(1+p.l*3)*dp,0,7);g.fill()}g.globalAlpha=1}],
["Matrix",()=>{const c=24,r=9,b=bn(c),dx=W/c,dy=H/r,rad=Math.min(dx,dy)*.3;for(let i=0;i<c;i++){const v=b[i]*r;for(let j=0;j<r;j++){const o=j<v;g.globalAlpha=o?1:.1;g.fillStyle=P[Math.min(3,(j/r*4)|0)];g.beginPath();g.arc(dx*(i+.5),H-dy*(j+.5),rad*(o?1:.7),0,7);g.fill()}}g.globalAlpha=1}],
["Tunnel",()=>{tp+=.004+lv.bass*.02;g.lineJoin="round";for(let i=0;i<8;i++){const u=(tp+i/8)%1,w=u*W*1.1,h=u*H*1.1;g.globalAlpha=1-u;g.strokeStyle=P[i%4];g.lineWidth=(1+u*3)*dp;g.beginPath();rr((W-w)/2,(H-h)/2,w,h,u*30*dp);g.stroke()}g.globalAlpha=1}]
];

function draw(){T=performance.now()/1000;
 const w=cv.clientWidth*dp|0,h=cv.clientHeight*dp|0;if(w!=W||h!=H){W=cv.width=w;H=cv.height=h}
 vA.getByteFrequencyData(fD);vA.getByteTimeDomainData(tD);
 const m=(a,z)=>{let s=0;for(let i=a;i<z;i++)s+=fD[i];return s/(z-a)/255};
 lv.bass=Math.max(m(1,6),lv.bass*.88);lv.mid=Math.max(m(6,60)*1.6,lv.mid*.88);lv.hi=Math.max(m(60,300)*2.5,lv.hi*.88);
 avg=avg*.95+lv.bass*.05;bt=lv.bass>avg*1.35+.05&&lv.bass>.3&&T-lastB>.22;if(bt)lastB=T;
 if(!(fr++%20)){const c=$$("#bg i").map(e=>getComputedStyle(e).getPropertyValue("--c").trim()).filter(Boolean);if(c.length==4)P=c}
 g.globalCompositeOperation="source-over";g.globalAlpha=1;g.fillStyle="#07060f";g.fillRect(0,0,W,H);
 const a=A[sel],add=a[1]===1;g.globalCompositeOperation=add?"lighter":"source-over";(add?a[2]:a[1])();g.globalCompositeOperation="source-over"}
function loop(){raf=0;if(!on||document.hidden)return;
 if(!cv.offsetWidth){setTimeout(()=>{if(on&&!raf)raf=requestAnimationFrame(loop)},400);return}
 if(!au.paused)lastP=performance.now();draw();
 if(performance.now()-lastP<2500)raf=requestAnimationFrame(loop)}
const kick=()=>{lastP=performance.now();if(on&&vA&&!raf)raf=requestAnimationFrame(loop)};
au.addEventListener("play",kick);document.addEventListener("visibilitychange",kick);

/* ---------- UI ---------- */
const row=mk("div","fxr"),pn=mk("div","vzp");
row.innerHTML='<button class="fxb" id="vb" aria-pressed="false"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M3 12h2v0zm2-3h2v6H5zm4-5h2v16H9zm4 4h2v8h-2zm4-2h2v12h-2z"/></svg><span data-i="vis"></span></button>';
pn.innerHTML='<div class="vzi"><canvas id="vc"></canvas><div class="vzc" id="vn"></div></div>';
($("#kp")||$("#vol").closest(".row")).after(row,pn);
cv=$("#vc");g=cv.getContext("2d");dp=Math.min(2,devicePixelRatio||1);
const nm=$("#vn");
A.forEach((a,i)=>{const b=mk("button",i?"":"on",a[0]);b.onclick=()=>pick(i);nm.append(b)});
const fs=mk("button","","⤢");fs.setAttribute("aria-label","Fullscreen");fs.onclick=()=>{try{(cv.requestFullscreen||cv.webkitRequestFullscreen).call(cv)}catch(e){}};nm.append(fs);
function pick(i){sel=(i+A.length)%A.length;rg.length=pt.length=0;[...nm.children].forEach((b,j)=>b.classList.toggle("on",j==sel));if(on&&!raf)raf=requestAnimationFrame(loop)}
cv.onclick=()=>pick(sel+1);
$("#vb").onclick=()=>{on=on?0:1;
 if(on){try{eqInit();if(!vA){vA=ctx.createAnalyser();vA.fftSize=1024;vA.smoothingTimeConstant=.78;an.connect(vA);const z=ctx.createGain();z.gain.value=0;vA.connect(z);z.connect(ctx.destination);fD=new Uint8Array(vA.frequencyBinCount);tD=new Uint8Array(vA.fftSize)}}catch(e){on=0;toast(t("unsup"))}}
 $("#vb").classList.toggle("on",!!on);$("#vb").setAttribute("aria-pressed",!!on);pn.classList.toggle("open",!!on);if(on){lastP=performance.now();raf=requestAnimationFrame(loop)}};
tr();
})();
