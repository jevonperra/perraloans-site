/* Perra Home Loans hero animation: four stick-figure scenes on a loop. */
(function(){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var $=function(id){return document.getElementById(id)};
  if(!$('scene'))return;
  var house=$('house'),props=$('props'),cast=$('cast'),steps=document.querySelectorAll('#steps .step');
  // House A: simple gable. House B: two-story remodel with flat roof, big window, chimney. Drawn at x 150-350, shifted +50.
  var A=['M150 262V170','M350 262V170','M140 176L250 104L360 176','M150 170H350','M232 262V214H268V262','M172 228V196H212V228H172','M288 228V196H328V228H288'];
  var B=['M160 262V120','M340 262V120','M150 120H350','M160 190H340','M300 262V218H328V262','M180 250V208H270V250H180','M184 172V136H226V172H184','M274 172V136H316V172H274','M310 120V96H326V120'];
  var SHIFT=30;

  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  function tween(ms,fn){return new Promise(function(res){var t0=performance.now();function f(t){var k=Math.min(1,(t-t0)/ms);fn(k,t);if(k<1)requestAnimationFrame(f);else res()}requestAnimationFrame(f)})}
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
  function ease(k){return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2}

  function drawHouse(list,shown){house.textContent='';return list.map(function(d){var p=el('path',{d:d,'class':'ln'},house);var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=shown?0:L;p._L=L;return p})}

  /* stick figure: feet at y=262, centered on x=0 */
  function person(o){
    var g=el('g',{'class':'actor'},cast);g.style.opacity=0;
    var body=el('g',{},g);
    var p={g:g,body:body,x:o.x||0,y:0};
    var top=o.kid?20:0;
    p.legL=el('path',{'class':'fig',d:'M0 '+(230+top/2)+'L-8 262'},body);
    p.legR=el('path',{'class':'fig',d:'M0 '+(230+top/2)+'L8 262'},body);
    p.hip=230+top/2;
    var hx=o.old?5:0;
    if(o.dress){el('path',{'class':'fig',d:'M0 204L-10 234H10Z'},body)}
    el('path',{'class':'fig',d:o.old?'M'+(hx-1)+' 196Q-3 212 0 '+(o.dress?204:230):'M0 196V'+(o.dress?204:230)},body);
    el('circle',{'class':'fig',cx:hx,cy:o.old?188:186,r:9},body);
    if(o.old){el('path',{'class':'fig',d:'M14 222L16 262','stroke-width':2},body)}
    if(o.hair&&!o.old){el('path',{'class':'fig',d:'M-9 184C-11 196 -8 200 -6 202M9 184C11 196 8 200 6 202'},body)}
    if(o.hair&&o.old){el('circle',{'class':'fig',cx:hx-8,cy:181,r:4},body)}
    if(o.hat){el('path',{'class':'hat',d:'M-10 184a10 10 0 0 1 20 0z'},body);el('rect',{'class':'hat',x:-13,y:182,width:26,height:3,rx:1.5},body)}
    if(o.belt){el('rect',{'class':'hat',x:-8,y:224,width:16,height:5,rx:1},body);el('rect',{'class':'hat',x:5,y:226,width:4,height:9,rx:1},body)}
    if(o.tie){el('path',{'class':'fill',d:'M0 197L-3 200L0 214L3 200Z'},body)}
    p.armL=el('path',{'class':'fig',d:'M0 204L-12 220'},body);
    p.arm=el('g',{},body);
    p.armPath=el('path',{'class':'fig',d:o.old?'M0 204L14 222':'M0 204L12 220'},p.arm);
    p.place=function(){g.setAttribute('transform','translate('+p.x+' '+p.y+')')};
    p.place();
    return p;
  }
  function show(p,on){p.g.style.opacity=on?1:0}
  function walk(p,x,speed){var from=p.x,ms=Math.max(180,Math.abs(x-from)*(speed||3.2));return tween(ms,function(k,t){p.x=from+(x-from)*k;p.place();var s=k<1?Math.sin(t/55)*7:0;p.legL.setAttribute('d','M0 '+p.hip+'L'+(-8+s)+' 262');p.legR.setAttribute('d','M0 '+p.hip+'L'+(8-s)+' 262')})}
  function hop(ps,n){return tween(260*n,function(k){var y=-Math.abs(Math.sin(k*Math.PI*n))*9;ps.forEach(function(p){p.y=y;p.place()})})}

  /* builder tools */
  function giveTools(b){
    b.armPath.setAttribute('d','M0 204L14 194');
    b.hammer=el('g',{},b.arm);el('path',{'class':'fig',d:'M14 194L19 178'},b.hammer);el('rect',{'class':'fill',x:13,y:173,width:13,height:6,rx:1,transform:'rotate(20 19 176)'},b.hammer);
    b.saw=el('g',{},b.arm);b.saw.style.display='none';el('path',{'class':'fig',d:'M14 194L42 184L44 190L16 200Z'},b.saw);el('path',{'class':'fig',d:'M18 199l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3','stroke-width':1.4},b.saw);
  }
  function tool(b,n){b.hammer.style.display=n==='hammer'?'':'none';b.saw.style.display=n==='saw'?'':'none'}
  function target(p){var bb=p.getBBox();return Math.max(30,Math.min(520,bb.x+SHIFT+bb.width/2-24))}
  function work(b,p,build,ms){return tween(ms,function(k,t){p.style.strokeDashoffset=build?p._L*(1-ease(k)):p._L*ease(k);var a=build?Math.sin(t/45)*28-10:Math.sin(t/35)*6;b.arm.setAttribute('transform',build?'rotate('+a+' 0 204)':'translate('+a+' 0)')})}
  async function buildWith(b,list){var ps=drawHouse(list,false);tool(b,'hammer');for(var i=0;i<ps.length;i++){await walk(b,target(ps[i]),2.4);await work(b,ps[i],true,300)}b.arm.removeAttribute('transform');return ps}
  async function tearWith(b,ps){tool(b,'saw');for(var i=ps.length-1;i>=0;i--){await walk(b,target(ps[i]),2.4);await work(b,ps[i],false,170)}b.arm.removeAttribute('transform')}
  function setLabel(i){steps.forEach(function(g,j){g.classList.toggle('on',i===j)})}

  /* props */
  function makeSign(){
    var g=el('g',{'class':'actor'},props);g.style.opacity=0;
    el('path',{'class':'ln',d:'M110 262V214'},g);
    el('rect',{x:78,y:194,width:64,height:22,rx:2,fill:'#eef5ff'},g);
    el('text',{'class':'tag',x:110,y:208,'text-anchor':'middle'},g).textContent='FOR SALE';
    var sold=el('g',{transform:'translate(110 205) rotate(-12) scale(0)'},g);
    el('rect',{x:-30,y:-10,width:60,height:20,rx:2,fill:'#e8564a'},sold);
    el('text',{x:0,y:4,'text-anchor':'middle',fill:'#fff',style:'font:700 12px Space Mono, monospace'},sold).textContent='SOLD';
    return {g:g,sold:sold};
  }
  function makeStroller(){
    var g=el('g',{'class':'actor'},cast);g.style.opacity=0;
    el('path',{'class':'fig',d:'M-14 240A14 12 0 0 0 14 240H-14Z'},g);
    el('path',{'class':'fig',d:'M14 240L20 224'},g);
    el('circle',{'class':'fig',cx:-9,cy:256,r:5},g);el('circle',{'class':'fig',cx:9,cy:256,r:5},g);
    el('circle',{'class':'fig',cx:-3,cy:234,r:4.5},g);
    var s={g:g,x:0,place:function(){g.setAttribute('transform','translate('+s.x+' 0)')}};return s;
  }
  function makeDoc(name){
    var g=el('g',{'class':'actor'},cast);g.style.opacity=0;
    el('rect',{x:-14,y:-18,width:28,height:34,rx:2,fill:'#eef5ff'},g);
    var tt=el('text',{'class':'tag',x:0,y:-5,'text-anchor':'middle'},g);tt.textContent=name||'HELOC';if(name&&name.length>5)tt.style.fontSize='7px';
    el('path',{d:'M-8 3H8M-8 8H8',stroke:'#1f4f8a','stroke-width':1.2},g);
    var d={g:g,x:0,y:0,place:function(){g.setAttribute('transform','translate('+d.x+' '+d.y+')')}};return d;
  }
  function cashBurst(x,y){
    var bills=[];for(var i=0;i<4;i++){var t=el('text',{x:x,y:y,'text-anchor':'middle',fill:'#7ee0a4',style:'font:700 18px Space Mono, monospace'},props);t.textContent='$';bills.push({t:t,dx:(i-1.5)*14,delay:i*120})}
    return tween(1300,function(k){bills.forEach(function(b){var kk=Math.max(0,Math.min(1,(k*1300-b.delay)/900));b.t.setAttribute('x',x+b.dx*kk);b.t.setAttribute('y',y-46*kk);b.t.style.opacity=kk<.75?1:1-(kk-.75)*4})}).then(function(){bills.forEach(function(b){b.t.remove()})});
  }

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){drawHouse(B,true);return}

  async function run(){
    for(;;){
      cast.textContent='';props.textContent='';
      /* Scene 1: build and remodel */
      var ps=drawHouse(A,true);house.style.opacity=0;await tween(400,function(k){house.style.opacity=k});
      setLabel(0);
      var b=person({hat:true,belt:true,x:20});giveTools(b);show(b,true);
      await wait(300);
      await tearWith(b,ps);
      ps=await buildWith(b,B);
      await walk(b,600,2.4);show(b,false);
      /* Scene 2: buy */
      setLabel(1);
      var sign=makeSign();sign.g.style.opacity=1;
      var him=person({x:-30}),her=person({x:-60,dress:true,hair:true});show(him,true);show(her,true);
      await Promise.all([walk(him,50,4),walk(her,22,4)]);
      await tween(350,function(k){var s=ease(k);sign.sold.setAttribute('transform','translate(110 205) rotate(-12) scale('+s+')')});
      him.armPath.setAttribute('d','M0 204L10 186');her.armPath.setAttribute('d','M0 204L10 186');
      await hop([him,her],2);
      await wait(500);
      him.armPath.setAttribute('d','M0 204L12 220');her.armPath.setAttribute('d','M0 204L12 220');
      show(him,false);show(her,false);sign.g.style.opacity=0;await wait(400);
      /* Scene 3: cash out with a HELOC */
      setLabel(2);
      var dad=person({x:-40}),mom=person({x:-90,dress:true,hair:true}),pram=makeStroller();pram.x=-62;pram.place();
      [dad,mom].forEach(function(p){show(p,true)});pram.g.style.opacity=1;
      mom.armPath.setAttribute('d','M0 204L18 222');
      await Promise.all([walk(dad,120,4),walk(mom,34,4),tween((62+62)*4,function(k){pram.x=-62+124*k;pram.place()})]);
      var lender=person({x:600,tie:true}),doc=makeDoc('HELOC');show(lender,true);
      lender.armPath.setAttribute('d','M0 204L-14 206');doc.x=586;doc.y=206;doc.place();doc.g.style.opacity=1;
      await Promise.all([walk(lender,165,3.2),tween((600-165)*3.2,function(k){doc.x=586+(151-586)*k;doc.place()})]);
      dad.armPath.setAttribute('d','M0 204L14 206');
      await tween(380,function(k){doc.x=151-(151-134)*k;doc.place()});
      await cashBurst(128,190);
      dad.armPath.setAttribute('d','M0 204L10 186');
      await hop([dad],2);
      await wait(600);
      [dad,mom,lender].forEach(function(p){show(p,false)});pram.g.style.opacity=0;doc.g.style.opacity=0;
      await wait(350);
      /* Scene 4: reverse mortgage */
      setLabel(3);
      var plaque=el('g',{'class':'actor'},props);plaque.style.opacity=0;
      el('rect',{x:306,y:196,width:72,height:14,rx:2,fill:'#eef5ff'},plaque);
      el('text',{x:342,y:206,'text-anchor':'middle',fill:'#1f4f8a',style:'font:700 7px Space Mono, monospace'},plaque).textContent='HOME SWEET HOME';
      var door=el('rect',{x:330,y:218,width:28,height:44,fill:'#1f4f8a',stroke:'#eef5ff','stroke-width':2.2,transform:'translate(330 0) scale(0 1) translate(-330 0)'},props);
      el('circle',{cx:353,cy:242,r:1.8,fill:'#eef5ff'},props).setAttribute('class','knob');
      plaque.style.opacity=1;
      var gramps=person({x:344,old:true}),gran=person({x:344,old:true,dress:true,hair:true});
      show(gramps,true);await wait(150);show(gran,true);
      await Promise.all([walk(gramps,452,6),walk(gran,420,6)]);
      var lender2=person({x:600,tie:true}),doc2=makeDoc('REVERSE');show(lender2,true);
      lender2.armPath.setAttribute('d','M0 204L-14 206');doc2.x=586;doc2.y=206;doc2.place();doc2.g.style.opacity=1;
      await Promise.all([walk(lender2,496,3.2),tween((600-496)*3.2,function(k){doc2.x=586+(482-586)*k;doc2.place()})]);
      gramps.armPath.setAttribute('d','M0 204L14 206');
      await tween(380,function(k){doc2.x=482-(482-468)*k;doc2.place()});
      await wait(500);
      doc2.g.style.opacity=0;show(lender2,false);
      gramps.armPath.setAttribute('d','M0 204L14 222');
      await Promise.all([walk(gramps,344,6),walk(gran,344,6)]);
      show(gramps,false);show(gran,false);
      await tween(450,function(k){door.setAttribute('transform','translate(330 0) scale('+ease(k)+' 1) translate(-330 0)')});
      /* through the big front window: the two of them in their chairs, holding hands; smoke from the chimney */
      var inside=el('g',{'class':'actor'},props);inside.style.opacity=0;
      var thin={'class':'fig','stroke-width':1.6};
      function seg(d){var a={};for(var k in thin)a[k]=thin[k];a.d=d;el('path',a,inside)}
      seg('M228 222V249M228 238H242M242 238V249');                       /* left chair */
      seg('M282 222V249M268 238H282M268 238V249');                       /* right chair */
      el('circle',{'class':'fig','stroke-width':1.6,cx:236,cy:218,r:4},inside);
      seg('M236 222V237H244V248');                                       /* him seated */
      el('circle',{'class':'fig','stroke-width':1.6,cx:274,cy:218,r:4},inside);
      el('circle',{'class':'fig','stroke-width':1.4,cx:277.5,cy:213.5,r:2},inside);
      seg('M274 222V237H266V248');                                       /* her seated */
      seg('M236 227L255 231L274 227');                                   /* holding hands */
      await tween(500,function(k){inside.style.opacity=k});
      var wisps=[0,1,2].map(function(i){var w=el('path',{'class':'fig','stroke-width':1.6,d:'M0 0q-4 -4 0 -8q4 -4 0 -8'},props);w.style.opacity=0;return {w:w,delay:i*420}});
      await tween(2600,function(k){var t=k*2600;wisps.forEach(function(o){var kk=Math.max(0,Math.min(1,(t-o.delay)/1500));
        o.w.setAttribute('transform','translate('+(348+Math.sin(kk*3)*3)+' '+(94-kk*10)+')');o.w.style.opacity=kk<=0?0:(kk<.6?.9:.9*(1-(kk-.6)/.4))})});
      wisps.forEach(function(o){o.w.remove()});
      await wait(300);
      await tween(400,function(k){inside.style.opacity=1-k});
      plaque.style.opacity=0;
      /* reset house */
      await tween(600,function(k){house.style.opacity=1-k});
      house.textContent='';setLabel(-1);await wait(250);
    }
  }
  run();
})();
