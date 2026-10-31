import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/MTLLoader.js';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bb6c8);
scene.fog = new THREE.FogExp2(0x8bb6c8, .00125);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 1800);
const renderer = new THREE.WebGLRenderer({canvas:$('game-canvas'),antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
scene.add(new THREE.HemisphereLight(0xd9f4ff,0x273341,2));
const sun=new THREE.DirectionalLight(0xffe5c0,2.1);sun.position.set(-170,260,90);scene.add(sun);
const fill=new THREE.DirectionalLight(0x6bdcff,.65);fill.position.set(80,65,-140);scene.add(fill);
const world=new THREE.Group();scene.add(world);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshStandardMaterial({color:0x26323c,roughness:.96}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.12;world.add(ground);
function buildCity(){
 const roadMat=new THREE.MeshStandardMaterial({color:0x101922,roughness:1});
 const road=new THREE.Mesh(new THREE.PlaneGeometry(900,900),roadMat);road.rotation.x=-Math.PI/2;road.position.y=-.06;world.add(road);
 const lineMat=new THREE.MeshBasicMaterial({color:0x60727b,transparent:true,opacity:.22});
 for(let k=-400;k<=400;k+=80){
  const a=new THREE.Mesh(new THREE.PlaneGeometry(18,900),roadMat);a.rotation.x=-Math.PI/2;a.position.set(k,-.045,0);world.add(a);
  const b=new THREE.Mesh(new THREE.PlaneGeometry(900,18),roadMat);b.rotation.x=-Math.PI/2;b.position.set(0,-.044,k);world.add(b);
  const c=new THREE.Mesh(new THREE.PlaneGeometry(.22,900),lineMat);c.rotation.x=-Math.PI/2;c.position.set(k+9.5,-.035,0);world.add(c);
  const d=new THREE.Mesh(new THREE.PlaneGeometry(900,.22),lineMat);d.rotation.x=-Math.PI/2;d.position.set(0,-.034,k+9.5);world.add(d);
 }
 const colors=[0x45515b,0x58636b,0x303e4b,0x69757a,0x3b4a58,0x6c7074,0x354958];
 const mats=colors.map(color=>new THREE.MeshStandardMaterial({color,roughness:.84,metalness:.14}));
 const boxGeo=new THREE.BoxGeometry(1,1,1),windowMat=new THREE.MeshBasicMaterial({color:0x92d9e8,transparent:true,opacity:.17});
 for(let gx=-4;gx<=4;gx++)for(let gz=-4;gz<=4;gz++){
  if(Math.abs(gx)<1&&Math.abs(gz)<1)continue;
  for(let n=0;n<2+Math.floor(Math.random()*3);n++){
   const x=gx*80+(Math.random()-.5)*35,z=gz*80+(Math.random()-.5)*35;
   const w=18+Math.random()*23,d=18+Math.random()*23,h=22+Math.pow(Math.random(),1.5)*150;
   const building=new THREE.Mesh(boxGeo,mats[Math.floor(Math.random()*mats.length)]);
   building.scale.set(w,h,d);building.position.set(x,h/2,z);world.add(building);
   if(h>62)for(let row=1;row<Math.min(7,Math.floor(h/23));row++){
    const strip=new THREE.Mesh(new THREE.BoxGeometry(w*.72,.45,.12),windowMat);
    strip.position.set(x,h*(row/Math.min(7,Math.floor(h/23))),z+d/2+.07);world.add(strip);
   }
  }
 }
 const grid=new THREE.GridHelper(900,90,0x61808c,0x324b57);grid.position.y=-.02;grid.material.transparent=true;grid.material.opacity=.13;world.add(grid);
 const landmarkMat=new THREE.MeshStandardMaterial({color:0x344958,metalness:.3,roughness:.6});
 for(const [x,z,h,w] of [[-75,-240,235,20],[220,-120,190,15],[-250,180,165,18],[260,250,210,17]]){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),landmarkMat);m.position.set(x,h/2,z);world.add(m);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(w*.28,Math.min(20,h*.2),6),landmarkMat);tip.position.set(x,h+Math.min(10,h*.1),z);world.add(tip);
 }
}
buildCity();

const suit=new THREE.Group();scene.add(suit);
const material=(color,metalness=.72,roughness=.28)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const red=material(0x9d1822),gold=material(0xf3b94d),dark=material(0x17212a),glow=new THREE.MeshBasicMaterial({color:0x6ef5ff});
function addBox(parent,size,mat,pos){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.position.set(...pos);parent.add(m);return m;}
function addSphere(parent,r,mat,pos){const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,10),mat);m.position.set(...pos);parent.add(m);return m;}
function createFallbackSuit(){
 const body=new THREE.Group();addBox(body,[.92,.82,.46],red,[0,1.35,0]);addBox(body,[.54,.32,.49],gold,[0,1.66,.005]);
 const reactor=addSphere(body,.205,glow,[0,1.45,.25]);reactor.scale.set(1,1,.28);
 const head=addSphere(body,.32,gold,[0,2.02,0]);head.scale.set(.82,1,.8);addBox(body,[.35,.1,.04],dark,[0,2.04,.252]);
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.61,1.57,0);body.add(arm);addBox(arm,[.28,.7,.32],red,[0,-.28,0]);addSphere(arm,.19,gold,[0,-.65,0]);
  const palm=addSphere(arm,.16,glow,[0,-.68,.14]);palm.scale.z=.3;
  const leg=new THREE.Group();leg.position.set(side*.25,.98,0);body.add(leg);addBox(leg,[.34,.76,.36],red,[0,-.36,0]);addBox(leg,[.36,.2,.49],gold,[0,-.76,.06]);
 }
 return body;
}
const fallback=createFallbackSuit();suit.add(fallback);suit.position.set(0,1,0);
async function loadCompressedOBJ(path,loader){
 const response=await fetch(path);
 if(!response.ok)throw new Error('Model file not found: '+path);
 if(!('DecompressionStream' in window))throw new Error('This browser cannot decompress the optimized model.');
 const stream=response.body.pipeThrough(new DecompressionStream('gzip'));
 const objText=await new Response(stream).text();
 return loader.parse(objText);
}
async function loadArmor(){
 try{
  const mats=await new Promise((ok,no)=>new MTLLoader().load('./assets/armor/hero_ironman01.mtl',ok,undefined,no));mats.preload();
  const loader=new OBJLoader();loader.setMaterials(mats);
  const obj=await loadCompressedOBJ('./assets/armor/hero_ironman01.obj.gz',loader);
  const bounds=new THREE.Box3().setFromObject(obj),size=bounds.getSize(new THREE.Vector3());
  const center=bounds.getCenter(new THREE.Vector3()),scale=2.35/Math.max(size.y,.001);
  obj.scale.setScalar(scale);obj.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  obj.traverse(n=>{if(n.isMesh)n.frustumCulled=true;});
  suit.remove(fallback);suit.add(obj);notify('NANO-ARMOR MODEL LOADED');
 }catch(e){console.info('Armor asset not installed yet; using built-in suit.',e);}
}
async function loadCityAsset(){
 try{
  const mats=await new Promise((ok,no)=>new MTLLoader().load('./assets/city/ny_clean_up2.mtl',ok,undefined,no));mats.preload();
  const loader=new OBJLoader();loader.setMaterials(mats);
  const obj=await loadCompressedOBJ('./assets/city/ny_clean_up2.obj.gz',loader);
  const bounds=new THREE.Box3().setFromObject(obj),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const scale=145/Math.max(size.x,size.z);obj.scale.setScalar(scale);
  obj.position.set(-center.x*scale,-bounds.min.y*scale+.15,-center.z*scale);
  obj.traverse(n=>{if(n.isMesh)n.material.side=THREE.DoubleSide;});
  const holder=new THREE.Group();holder.add(obj);world.add(holder);notify('MANHATTAN ASSET LOADED');
 }catch(e){console.info('City asset not installed yet; using blockout.',e);}
}

const drones=[],droneGeo=new THREE.IcosahedronGeometry(2.8,1);
const droneMat=new THREE.MeshStandardMaterial({color:0x243845,metalness:.8,roughness:.22,emissive:0x143e50,emissiveIntensity:1.4});
for(let i=0;i<7;i++){
 const d=new THREE.Group();d.add(new THREE.Mesh(droneGeo,droneMat));
 const ring=new THREE.Mesh(new THREE.TorusGeometry(4.2,.16,8,32),new THREE.MeshBasicMaterial({color:0x5ce7ff}));ring.rotation.x=Math.PI/2;d.add(ring);
 d.position.set((Math.random()-.5)*440,35+Math.random()*95,(Math.random()-.5)*440);
 d.userData={baseY:d.position.y,phase:Math.random()*6.28,scanned:false};scene.add(d);drones.push(d);
}
const scanEffects=[],scanGeo=new THREE.SphereGeometry(1,12,10);
let rescueCount=0;
function notify(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove('show'),1500);}
let running=false,paused=false,energy=100,lastTime=performance.now();
const input={forward:0,strafe:0,vertical:0,boost:false};
let takeoffHeld=false;
const player={pos:new THREE.Vector3(0,1.2,45),vel:new THREE.Vector3(),yaw:0};
function scanArea(){
 if(!running||paused||energy<5)return;
 energy=Math.max(0,energy-5);
 const direction=new THREE.Vector3(0,0,-1).applyQuaternion(suit.quaternion).normalize();
 const origin=player.pos.clone().add(new THREE.Vector3(0,1.25,0));
 let candidate=null,best=160;
 for(const d of drones){
  if(d.userData.scanned)continue;
  const offset=d.position.clone().sub(origin),distance=offset.length();
  if(distance<best&&direction.dot(offset.normalize())>.12){candidate=d;best=distance;}
 }
 if(candidate){
  candidate.userData.scanned=true;
  candidate.children[0].material=new THREE.MeshStandardMaterial({color:0x62ffc4,metalness:.55,roughness:.25,emissive:0x174c38,emissiveIntensity:1.4});
  candidate.children[1].material=new THREE.MeshBasicMaterial({color:0x75ffc9});
  rescueCount++;$('beacon-count').textContent=String(rescueCount).padStart(2,'0');
  notify('BEACON RESTORED · '+rescueCount+'/07');
 }else notify('SCAN COMPLETE · NO BEACON IN RANGE');
 const wave=new THREE.Mesh(scanGeo,new THREE.MeshBasicMaterial({color:0x78efff,wireframe:true,transparent:true,opacity:.62}));
 wave.position.copy(origin);wave.userData={life:.6,max:.6};wave.scale.setScalar(.25);scene.add(wave);scanEffects.push(wave);
}
function start(){
 $('boot-screen').classList.add('hidden');$('loading-screen').classList.remove('hidden');
 setTimeout(()=>{$('loading-screen').classList.add('hidden');$('hud').classList.remove('hidden');running=true;paused=false;lastTime=performance.now();notify('FLIGHT SYSTEM READY');},400);
 loadArmor();loadCityAsset();
}
function pause(value){paused=value;$('pause-screen').classList.toggle('hidden',!paused);if(!paused)lastTime=performance.now();}
$('start-btn').addEventListener('click',start);$('pause-btn').addEventListener('click',()=>pause(true));$('resume-btn').addEventListener('click',()=>pause(false));
$('restart-btn').addEventListener('click',()=>{player.pos.set(0,1.2,45);player.vel.set(0,0,0);energy=100;pause(false);});
const keys={KeyW:['forward',1],ArrowUp:['forward',1],KeyS:['forward',-1],ArrowDown:['forward',-1],KeyA:['strafe',-1],ArrowLeft:['strafe',-1],KeyD:['strafe',1],ArrowRight:['strafe',1],Space:['vertical',1],KeyC:['vertical',-1],ShiftLeft:['boost',true],ShiftRight:['boost',true]};
addEventListener('keydown',e=>{const v=keys[e.code];if(v){e.preventDefault();input[v[0]]=v[1];}if(e.code==='KeyF')scanArea();if(e.code==='Escape'&&running)pause(!paused);});
addEventListener('keyup',e=>{const v=keys[e.code];if(v){if(v[0]==='boost')input.boost=false;else if(input[v[0]]===v[1])input[v[0]]=0;}});
$('game-canvas').addEventListener('pointerdown',()=>{if(running&&!paused&&matchMedia('(pointer:fine)').matches)scanArea();});
$('scan-btn').addEventListener('pointerdown',e=>{e.preventDefault();scanArea();});
$('boost-btn').addEventListener('pointerdown',e=>{e.preventDefault();input.boost=true;});
for(const ev of ['pointerup','pointercancel','pointerleave'])$('boost-btn').addEventListener(ev,()=>input.boost=false);
$('takeoff-btn').addEventListener('pointerdown',e=>{e.preventDefault();if(player.pos.y<8){input.vertical=1;takeoffHeld=true;}else notify('LOWER ALTITUDE TO LAND');});
for(const ev of ['pointerup','pointercancel','pointerleave'])$('takeoff-btn').addEventListener(ev,()=>{if(takeoffHeld){input.vertical=0;takeoffHeld=false;}});
$('vertical-pad').querySelectorAll('button').forEach(b=>{
 const value=b.dataset.action==='up'?1:-1;
 b.addEventListener('pointerdown',e=>{e.preventDefault();input.vertical=value;});
 for(const ev of ['pointerup','pointercancel','pointerleave'])b.addEventListener(ev,()=>{if(input.vertical===value)input.vertical=0;});
});
const pad=$('move-pad'),ring=pad.querySelector('.pad-ring'),stick=$('move-stick');let padId=null;
function joystick(e){
 const r=ring.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.34,len=Math.hypot(dx,dy);
 if(len>max){dx=dx/len*max;dy=dy/len*max;}stick.style.transform=`translate(${dx}px,${dy}px)`;input.strafe=dx/max;input.forward=-dy/max;
}
ring.addEventListener('pointerdown',e=>{e.preventDefault();padId=e.pointerId;ring.setPointerCapture(e.pointerId);joystick(e);});
ring.addEventListener('pointermove',e=>{if(e.pointerId===padId)joystick(e);});
function resetStick(){padId=null;stick.style.transform='';input.forward=0;input.strafe=0;}
ring.addEventListener('pointerup',resetStick);ring.addEventListener('pointercancel',resetStick);

function updatePlayer(dt){
 const fwd=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw));
 const right=new THREE.Vector3(Math.cos(player.yaw),0,Math.sin(player.yaw));
 const desired=fwd.multiplyScalar(input.forward).addScaledVector(right,input.strafe);if(desired.lengthSq()>1)desired.normalize();
 const boosting=input.boost&&energy>1,maxSpeed=boosting?118:56;
 const horizontal=new THREE.Vector3(player.vel.x,0,player.vel.z).addScaledVector(desired,(boosting?95:54)*dt);
 if(desired.lengthSq()<.01)horizontal.multiplyScalar(Math.pow(.12,dt));
 if(horizontal.length()>maxSpeed)horizontal.setLength(maxSpeed);
 player.vel.x=horizontal.x;player.vel.z=horizontal.z;
 if(input.vertical){player.vel.y+=input.vertical*(boosting?90:62)*dt;energy=Math.max(0,energy-(boosting?9:3.5)*dt);}
 else player.vel.y-=28*dt;
 player.vel.y=THREE.MathUtils.clamp(player.vel.y,-45,boosting?86:48);
 player.pos.addScaledVector(player.vel,dt);
 if(player.pos.y<1.15){player.pos.y=1.15;player.vel.y=Math.max(0,player.vel.y)*.1;}
 player.pos.x=THREE.MathUtils.clamp(player.pos.x,-410,410);player.pos.z=THREE.MathUtils.clamp(player.pos.z,-410,410);
 if(boosting)energy=Math.max(0,energy-6*dt);else energy=Math.min(100,energy+2.7*dt);
 suit.position.copy(player.pos);suit.rotation.set(THREE.MathUtils.clamp(-input.forward*.12,-.18,.18),player.yaw,THREE.MathUtils.clamp(-input.strafe*.13,-.2,.2));
 $('speed-value').textContent=String(Math.round(horizontal.length()*3.6)).padStart(3,'0');
 $('altitude-value').textContent=String(Math.round(Math.max(0,player.pos.y-1.15))).padStart(3,'0');
 $('energy-value').textContent=String(Math.round(energy)).padStart(3,'0');$('energy-fill').style.width=energy+'%';
 $('flight-state').textContent=player.pos.y<3?'GROUND MODE':horizontal.length()>65?'BOOST FLIGHT':'FLIGHT MODE';
}
function updateCamera(dt){
 const back=new THREE.Vector3(0,3.1,10.5).applyAxisAngle(new THREE.Vector3(0,1,0),player.yaw);
 camera.position.lerp(player.pos.clone().add(back),1-Math.pow(.001,dt));
 const target=player.pos.clone().add(new THREE.Vector3(0,1.1,0)).add(new THREE.Vector3(0,0,-8).applyAxisAngle(new THREE.Vector3(0,1,0),player.yaw));
 camera.lookAt(target);
}
function updateEffects(dt,now){
 for(const d of drones)if(d.visible)d.position.y=d.userData.baseY+Math.sin(now*.0014+d.userData.phase)*4;
 for(let i=scanEffects.length-1;i>=0;i--){
  const s=scanEffects[i];s.userData.life-=dt;
  const progress=1-s.userData.life/s.userData.max;s.scale.setScalar(.25+progress*72);
  s.material.opacity=Math.max(0,s.userData.life/s.userData.max)*.62;
  if(s.userData.life<=0){scene.remove(s);scanEffects.splice(i,1);}
 }
}
function animate(now){
 requestAnimationFrame(animate);const dt=Math.min((now-lastTime)/1000,.04);lastTime=now;
 if(running&&!paused){updatePlayer(dt);updateEffects(dt,now);updateCamera(dt);}
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);});
console.info('IRON MAN: NEW YORK prototype ready.');
