(() => {
const c=document.getElementById("cosmos"),ctx=c.getContext("2d"),btn=document.getElementById("motionToggle"),wave=document.getElementById("wavePath");
let stars=[],paused=false,raf=0,t0=performance.now(),mouse={x:-999,y:-999},W=0,H=0;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function resize(){W=innerWidth;H=innerHeight;const d=Math.min(devicePixelRatio||1,2);c.width=W*d;c.height=H*d;c.style.width=W+"px";c.style.height=H+"px";ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:Math.min(220,Math.floor(W*H/5800))},()=>({x:Math.random()*W,y:Math.random()*H,r:.3+Math.random()*1.4,a:.12+Math.random()*.7,p:Math.random()*6.28}));}
function bh(x,y,r){let g=ctx.createRadialGradient(x,y,r*.45,x,y,r*1.55);g.addColorStop(0,"#000");g.addColorStop(.58,"#000");g.addColorStop(.72,"rgba(143,211,255,.28)");g.addColorStop(.84,"rgba(245,240,220,.10)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*1.55,0,Math.PI*2);ctx.fill();ctx.fillStyle="#000";ctx.beginPath();ctx.arc(x,y,r*.76,0,Math.PI*2);ctx.fill();}
function ring(x,y,r,a){ctx.strokeStyle=`rgba(143,211,255,${a})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}
function cycle(now){return ((now-t0)%15000)/15000}
function merger(now){const u=cycle(now),cx=W*.78,cy=Math.min(H*.34,285);let amp,freq,state;
 if(u<.72){const q=u/.72;const eased=1-Math.pow(1-q,2.7);const sep=150*(1-eased)+10;const ang=10*Math.PI*(q+q*q*.9);const x1=cx+Math.cos(ang)*sep*.5,y1=cy+Math.sin(ang)*sep*.22;const x2=cx-Math.cos(ang)*sep*.5,y2=cy-Math.sin(ang)*sep*.22;bh(x1,y1,24);bh(x2,y2,24);amp=5+Math.pow(q,3.1)*54;freq=.018+Math.pow(q,2.2)*.105;state={amp,freq,phase:q*48,ring:0};}
 else{const q=(u-.72)/.28;bh(cx,cy,34);for(let k=0;k<4;k++)ring(cx,cy,52+k*22+q*45,.12*(1-q)*(1-k*.14));amp=62*Math.exp(-6.2*q);freq=.128+.018*q;state={amp,freq,phase:48+q*22,ring:q};}
 return state;}
function drawWave(st){let d="M 0 90";for(let xx=0;xx<=1200;xx+=4){const q=xx/1200;let env;if(q<.68)env=3+Math.pow(q/.68,3.1)*st.amp;else env=st.amp*Math.exp(-7*(q-.68));const localF=.018+q*q*(st.freq-.018);const y=90+Math.sin(xx*localF+st.phase)*env;d+=` L ${xx} ${y.toFixed(2)}`;}wave.setAttribute("d",d)}
function frame(now){ctx.clearRect(0,0,W,H);const tt=now*.001;for(const s of stars){let dx=s.x-mouse.x,dy=s.y-mouse.y,dist=Math.hypot(dx,dy);if(dist<120&&dist>1){s.x+=dx/dist*.08;s.y+=dy/dist*.08}const a=s.a*(.55+.45*Math.sin(tt*1.5+s.p));ctx.fillStyle=`rgba(240,245,248,${Math.max(.04,a)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}const st=merger(now);drawWave(st);if(!paused)raf=requestAnimationFrame(frame)}
function setPaused(v){paused=v;btn.textContent=v?"Resume motion":"Pause motion";cancelAnimationFrame(raf);if(!v){t0=performance.now();raf=requestAnimationFrame(frame)}}
addEventListener("resize",resize);addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});btn.addEventListener("click",()=>setPaused(!paused));resize();if(reduce){paused=true;btn.textContent="Resume motion";frame(performance.now())}else raf=requestAnimationFrame(frame);
})();