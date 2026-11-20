/* SYNCRA Visuals: 10 rhythm animations, per device, on/off. Load after syncra-plus.js. */
(()=>{
Object.assign(D.ms,{vis:"Animasi",taken:"Nama ini sedang digunakan dalam stesen. Sila pilih nama lain."});
Object.assign(D.en,{vis:"Animation",taken:"That name is already in use in this station. Choose another."});
const st=document.createElement("style");st.textContent=`
.vzp{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.3,1,.5,1)}.vzp.open{grid-template-rows:1fr}.vzi{overflow:hidden;min-height:0}
.vzp canvas{display:block;width:100%;aspect-ratio:16/9;margin-top:12px;border-radius:22px;background:#07060f;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 10px 30px rgba(0,0,0,.25);cursor:pointer}
.vzp canvas:fullscreen{width:100vw;height:100vh;aspect-ratio:auto;border-radius:0;margin:0}
.vzp canvas:-webkit-full-screen{width:100vw;height:100vh;aspect-ratio:auto;border-radius:0;margin:0}
`;document.head.append(st);

let lD=0,on=0,sel=0,vA,fD,tD,W=0,H=0,dp=1,raf=0,T=0,lastP=0,fr=0,bt=0,avg=0,lastB=0;
const lv={bass:0,mid:0,hi:0},sm={},rg=[],pt=[];
let P=["#7b5cff","#4f8cff","#c77dff","#5ee7ff"];
const bk=Array.from({length:22},()=>({a:Math.random()*6,s:.2+Math.random()*.4}));
let tp=0,cv,g;

/* log-spaced, smoothed frequency bands 0..1 */
function bn(n){const o=sm[n]||(sm[n]=new Float32Array(n)),e=i=>2+358*Math.pow(i/n,2.2);
 for(let i=0;i<n;i++){const a=e(i)|0,z=Math.max(a+1,e(i+1)|0);let s=0;for(let j=a;j<z;j++)s+=fD[j];
  const v=Math.min(1,Math.pow(s/(z-a)/255,1.5)*1.3*(1+i/n*.8));o[i]=Math.max(v,o[i]*.86)}return o}
const rr=(x,y,w,h,r)=>g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h);
const lin=(x,y,x2,y2,a,b)=>{const q=g.createLinearGradient(x,y,x2,y2);q.addColorStop(0,a);q.addColorStop(1,b);return q};

let clr=1;const pk=new Float32Array(32),fw=[],sr=Array.from({length:240},()=>({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random()}));
/* each: [draw, additive, trail-fade] */
const A=[
/* Peaks */[()=>{const n=32,b=bn(n),w=W/n,r=Math.min(w*.3,9*dp),base=H*.78,mx=H*.66;
 for(let i=0;i<n;i++){const c=(i*4/n)|0,h=Math.max(r*2,b[i]*mx),x=i*w+w*.18,bw=w*.64;pk[i]=Math.max(b[i]*mx,pk[i]-.9*dp);
  g.fillStyle=lin(0,base,0,base-mx,P[c],P[(c+1)%4]);g.beginPath();rr(x,base-h,bw,h,r);g.fill();
  g.globalAlpha=.18;g.fillStyle=P[c];g.beginPath();rr(x,base+4*dp,bw,h*.45,r);g.fill();g.globalAlpha=1;
  g.fillStyle="#fff";g.beginPath();rr(x,base-pk[i]-r*2.4,bw,r*.9,r*.45);g.fill()}},0,0],
/* Mountains */[()=>{const n=24,b=bn(n);for(let k=0;k<3;k++){const p=[];for(let i=0;i<n;i++)p.push([i/(n-1)*W,H*.9-(b[(i+k*3)%n]*(.5+k*.14)+Math.sin(T*.6+i*.5+k)*.03)*H*.85]);
 g.beginPath();g.moveTo(0,H);g.lineTo(p[0][0],p[0][1]);for(let i=1;i<n;i++){const[a,c]=p[i-1],[d,e]=p[i];g.quadraticCurveTo(a,c,(a+d)/2,(c+e)/2)}g.lineTo(W,p[n-1][1]);g.lineTo(W,H);g.closePath();
 g.globalAlpha=.6;g.fillStyle=lin(0,0,0,H,P[k],P[(k+2)%4]);g.fill();g.globalAlpha=.9;g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=1.5*dp;g.stroke()}g.globalAlpha=1},1,0],
/* Scope */[()=>{g.lineJoin="round";for(let k=0;k<4;k++){g.beginPath();for(let i=0;i<=160;i++){const u=i/160,v=(tD[(u*(tD.length-1))|0]-128)/128,e=Math.sin(u*Math.PI),x=u*W,y=H/2+(v*(.44-k*.07)*e+Math.sin(u*10+T*(1.5+k*.4)+k*.9)*.05*(lv.mid+.15))*H;i?g.lineTo(x,y):g.moveTo(x,y)}
 g.strokeStyle=P[k];g.lineWidth=(4-k*.7)*dp;g.globalAlpha=.85;g.stroke()}g.globalAlpha=1},1,.28],
/* Aurora */[()=>{for(let k=0;k<5;k++){g.beginPath();g.moveTo(0,H);for(let i=0;i<=48;i++){const x=i/48*W,y=H*(.66-.07*k)-Math.sin(x/W*5+T*(.6+k*.25)+k*2)*H*(.05+lv.bass*.17)-Math.sin(x/W*9-T*.8+k)*H*.03*(1+lv.mid*3)-Math.sin(x/W*17+T*1.7)*H*.015*lv.hi*3;g.lineTo(x,y)}
 g.lineTo(W,H);g.closePath();const q=g.createLinearGradient(0,H*.15,0,H);q.addColorStop(0,P[k%4]);q.addColorStop(1,"transparent");g.globalAlpha=.55;g.fillStyle=q;g.fill()}g.globalAlpha=1},1,0],
/* Ripples */[()=>{const cx=W/2,cy=H/2;if(bt)rg.push({x:cx,y:cy,r:H*.05,c:rg.length%4,m:W*.55,w:4});if(lv.hi>.3&&Math.random()<.12)rg.push({x:Math.random()*W,y:Math.random()*H,r:2,c:Math.random()*4|0,m:H*.3,w:2});
 for(let i=rg.length-1;i>=0;i--){const o=rg[i];o.r+=(1.5+lv.bass*5)*dp*(o.w>3?1:.5);const a=1-o.r/o.m;if(a<=0){rg.splice(i,1);continue}g.globalAlpha=a;g.lineWidth=o.w*dp;g.strokeStyle=P[o.c];g.beginPath();g.arc(o.x,o.y,o.r,0,7);g.stroke()}
 g.fillStyle=P[1];g.globalAlpha=.25;g.beginPath();g.arc(cx,cy,H*(.12+lv.bass*.1),0,7);g.fill();g.globalAlpha=1;g.beginPath();g.arc(cx,cy,H*(.07+lv.bass*.07),0,7);g.fill()},1,.3],
/* Halo */[()=>{const n=72,b=bn(36),cx=W/2,cy=H/2,r0=H*(.2+lv.bass*.04);g.lineCap="round";
 for(let s=0;s<2;s++){g.lineWidth=(s?2.2:3.6)*dp;for(let i=0;i<n;i++){const a=i/n*6.283+T*(s?-.2:.15),v=b[i<n/2?i:n-1-i]*(s?.6:1),l=2*dp+v*H*.27,r1=s?r0*.88:r0,r2=s?r1-l*.6:r1+l;g.strokeStyle=P[(((i*4/n)|0)+s*2)%4];g.beginPath();g.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);g.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);g.stroke()}}
 const q=g.createRadialGradient(cx,cy,0,cx,cy,r0*.8);q.addColorStop(0,P[1]);q.addColorStop(1,"transparent");g.globalAlpha=.25+lv.bass*.6;g.fillStyle=q;g.beginPath();g.arc(cx,cy,r0*.8,0,7);g.fill();g.globalAlpha=1},1,.35],
/* Bubbles */[()=>{const b=bn(22);bk.forEach((o,i)=>{const x=(.5+Math.sin(T*o.s+o.a)*.44)*W,y=(.5+Math.cos(T*o.s*.8+o.a*2)*.4)*H,r=(.05+b[i]*.2)*H,q=g.createRadialGradient(x,y,r*.2,x,y,r);q.addColorStop(0,"rgba(255,255,255,.04)");q.addColorStop(.8,P[i%4]);q.addColorStop(1,"transparent");
 g.globalAlpha=.3+b[i]*.6;g.fillStyle=q;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=.35+b[i]*.5;g.strokeStyle="#fff";g.lineWidth=1.2*dp;g.stroke()});g.globalAlpha=1},1,0],
/* Fireworks */[()=>{if(bt||(lv.mid>.55&&Math.random()<.04))fw.push({x:W*(.15+Math.random()*.7),y:H,vy:-(H*.016+Math.random()*H*.006),t:H*(.2+Math.random()*.35),c:Math.random()*4|0});
 for(let i=fw.length-1;i>=0;i--){const f=fw[i];f.y+=f.vy;f.vy*=.985;g.fillStyle="#fff";g.beginPath();g.arc(f.x,f.y,2*dp,0,7);g.fill();
  if(f.y<=f.t||f.vy>-1.5*dp){const n=36+(lv.bass*30|0);for(let j=0;j<n;j++){const a=j/n*6.283,s=(1.5+Math.random()*3.5)*dp*(1+lv.bass*.6);pt.push({x:f.x,y:f.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:(f.c+(j%2))%4})}fw.splice(i,1)}}
 if(pt.length>900)pt.splice(0,200);g.lineCap="round";g.lineWidth=2*dp;
 for(let i=pt.length-1;i>=0;i--){const p=pt[i],ox=p.x,oy=p.y;p.x+=p.vx;p.y+=p.vy;p.vx*=.975;p.vy=p.vy*.975+.05*dp;p.l-=.014;if(p.l<=0){pt.splice(i,1);continue}g.globalAlpha=p.l;g.strokeStyle=P[p.c];g.beginPath();g.moveTo(ox,oy);g.lineTo(p.x,p.y);g.stroke()}g.globalAlpha=1},1,.2],
/* Warp */[()=>{const cx=W/2,cy=H/2,sp=.004+lv.bass*.03+lv.mid*.006,k=W*.25;g.lineCap="round";
 sr.forEach((s,i)=>{const pz=s.z;s.z-=sp;if(s.z<=.01){s.x=Math.random()*2-1;s.y=Math.random()*2-1;s.z=1;return}
  g.globalAlpha=Math.min(1,(1-s.z)*1.5);g.strokeStyle=P[i%4];g.lineWidth=(.8+(1-s.z)*2.4)*dp;g.beginPath();g.moveTo(cx+s.x/pz*k,cy+s.y/pz*k);g.lineTo(cx+s.x/s.z*k,cy+s.y/s.z*k);g.stroke()});
 g.globalAlpha=.2+lv.bass*.5;g.fillStyle=P[2];g.beginPath();g.arc(cx,cy,H*(.02+lv.bass*.05),0,7);g.fill();g.globalAlpha=1},1,.25],
/* Tunnel */[()=>{tp+=.005+lv.bass*.022;g.lineJoin="round";const cx=W/2,cy=H/2;for(let i=0;i<12;i++){const u=(tp+i/12)%1,s=u*u*1.3,w=s*W,h=s*H;g.save();g.translate(cx,cy);g.rotate(Math.sin(T*.4)*.5+u*.9*(1+lv.mid));g.globalAlpha=Math.min(1,(1-u)*1.4);g.strokeStyle=P[i%4];g.lineWidth=(1+u*4)*dp;g.beginPath();rr(-w/2,-h/2,w,h,s*60*dp);g.stroke();g.restore()}g.globalAlpha=1},1,.3]
];

function draw(){T=performance.now()/1000;
 dp=Math.min(window.SXBUSY?1.25:3,devicePixelRatio||1);const w=cv.clientWidth*dp|0,h=cv.clientHeight*dp|0;if(w!=W||h!=H){W=cv.width=w;H=cv.height=h}
 vA.getByteFrequencyData(fD);vA.getByteTimeDomainData(tD);
 const m=(a,z)=>{let s=0;for(let i=a;i<z;i++)s+=fD[i];return s/(z-a)/255};
 lv.bass=Math.max(m(1,6),lv.bass*.88);lv.mid=Math.max(m(6,60)*1.6,lv.mid*.88);lv.hi=Math.max(m(60,300)*2.5,lv.hi*.88);
 avg=avg*.95+lv.bass*.05;bt=lv.bass>avg*1.35+.05&&lv.bass>.3&&T-lastB>.22;if(bt)lastB=T;
 if(!(fr++%20)){const c=$$("#bg i").map(e=>getComputedStyle(e).getPropertyValue("--c").trim()).filter(Boolean);if(c.length==4)P=c}
 const a=A[sel];g.globalCompositeOperation="source-over";g.globalAlpha=1;g.fillStyle=clr||!a[2]?"#07060f":"rgba(7,6,15,"+a[2]+")";g.fillRect(0,0,W,H);clr=0;g.globalCompositeOperation=a[1]?"lighter":"source-over";a[0]();g.globalCompositeOperation="source-over"}
function loop(){raf=0;if(!on||document.hidden)return;
 if(!cv.offsetWidth){setTimeout(()=>{if(on&&!raf)raf=requestAnimationFrame(loop)},400);return}
 if(!au.paused)lastP=performance.now();if(window.SXBUSY&&performance.now()-lD<32){raf=requestAnimationFrame(loop);return}lD=performance.now();draw();
 if(performance.now()-lastP<2500)raf=requestAnimationFrame(loop)}
const kick=()=>{lastP=performance.now();if(on&&vA&&!raf)raf=requestAnimationFrame(loop)};
au.addEventListener("play",kick);document.addEventListener("fullscreenchange",kick);document.addEventListener("webkitfullscreenchange",kick);document.addEventListener("visibilitychange",kick);

/* ---------- UI ---------- */
const row=mk("div","fxr"),pn=mk("div","vzp");
row.innerHTML='<button class="fxb" id="vb" aria-pressed="false"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M3 12h2v0zm2-3h2v6H5zm4-5h2v16H9zm4 4h2v8h-2zm4-2h2v12h-2z"/></svg><span data-i="vis"></span></button><button class="fxb" id="fsb" disabled aria-label="Fullscreen" style="flex:none;width:54px"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>';
pn.innerHTML='<div class="vzi"><canvas id="vc"></canvas></div>';
($("#kp")||$("#vol").closest(".row")).after(row,pn);
cv=$("#vc");g=cv.getContext("2d");dp=Math.min(2,devicePixelRatio||1);
function pick(i){sel=(i+A.length)%A.length;clr=1;rg.length=pt.length=fw.length=0;if(on&&!raf)raf=requestAnimationFrame(loop)}
cv.onclick=()=>pick(sel+1);
$("#fsb").onclick=()=>{try{(cv.requestFullscreen||cv.webkitRequestFullscreen).call(cv)}catch(e){}};
$("#vb").onclick=()=>{on=on?0:1;
 if(on){try{eqInit();if(!vA){vA=ctx.createAnalyser();vA.fftSize=1024;vA.smoothingTimeConstant=.78;an.connect(vA);const z=ctx.createGain();z.gain.value=0;vA.connect(z);z.connect(ctx.destination);fD=new Uint8Array(vA.frequencyBinCount);tD=new Uint8Array(vA.fftSize)}}catch(e){on=0;toast(t("unsup"))}}
 $("#vb").classList.toggle("on",!!on);$("#vb").setAttribute("aria-pressed",!!on);pn.classList.toggle("open",!!on);$("#fsb").disabled=!on;if(on){lastP=performance.now();raf=requestAnimationFrame(loop)}};
tr();
})();
