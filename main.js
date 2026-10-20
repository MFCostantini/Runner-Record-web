/* Runner Records – medidor de audio, testimonios, formulario, lightbox y miniaturas */
/* Medidor estéreo */
(function(){
  var N=20, box=document.getElementById('meters'), db=document.getElementById('db');
  var chans=[], boost=0, reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  ['L','R'].forEach(function(l){
    var ch=document.createElement('div'); ch.className='ch';
    var col=document.createElement('div'); col.className='col';
    var segs=[]; for(var i=0;i<N;i++){var s=document.createElement('div');s.className='seg'+(i>=N-5?' pk':i>=N-9?' hi':'');col.appendChild(s);segs.push(s);}
    var t=document.createElement('span'); t.textContent=l;
    ch.appendChild(col); ch.appendChild(t); box.appendChild(ch);
    chans.push({segs:segs,v:.4,t:.4});
  });
  function set(c,level){var n=Math.round(level*N);c.segs.forEach(function(s,i){s.classList.toggle('on',i<n);});}
  var last=0;
  function tick(ts){
    if(ts-last>90){
      last=ts; boost*=.9;
      chans.forEach(function(c){
        c.t=Math.min(1,.28+Math.random()*.5+boost*.35);
        c.v+= (c.t-c.v)*.7; set(c,c.v);
      });
      var avg=(chans[0].v+chans[1].v)/2;
      db.textContent=Math.round(-36+avg*34)+' dB';
    }
    if(!reduce) requestAnimationFrame(tick);
  }
  if(reduce){chans.forEach(function(c){set(c,.55)});} else requestAnimationFrame(tick);
  var bump=function(){boost=1.4};
  box.parentElement.addEventListener('pointermove',bump);
  box.parentElement.addEventListener('pointerdown',bump);
})();

/* Testimonios */
(function(){
  var T=[
    {n:'Martina Ledesma',r:'Cantautora, Ramos Mejía',t:'Llegué con las canciones a medio hacer y me fui con un disco. Los ingenieros escuchan como músicos: entendieron lo que buscaba antes de que yo pudiera explicarlo.',s:'Martina, cantautora'},
    {n:'Gonzalo Ferreyra',r:'Baterista, banda Cuarto Oscuro',t:'Ensayamos acá todas las semanas. La batería siempre está afinada y el backline está impecable. Dejamos de cargar equipos y se nota en lo que tocamos.',s:'Gonzalo, banda de rock'},
    {n:'Lucía Almada',r:'Directora de contenidos, agencia Pulso',t:'Les encargamos la música original de tres campañas. Entregaron a tiempo, con arreglos cuidados y una calidad que nos sorprendió a todos.',s:'Lucía, agencia de publicidad'}
  ];
  var tabs=document.getElementById('tabs'),q=document.getElementById('quote'),qt=document.getElementById('qt'),qn=document.getElementById('qn'),qr=document.getElementById('qr');
  function show(i,anim){
    qt.textContent=T[i].t; qn.textContent=T[i].n; qr.textContent=T[i].r;
    [].forEach.call(tabs.children,function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1;});
    if(anim){q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');}
  }
  T.forEach(function(x,i){
    var b=document.createElement('button');b.className='tab';b.setAttribute('role','tab');
    b.innerHTML='<b></b><small></small>';b.firstChild.textContent=x.n;b.lastChild.textContent=x.s;
    b.addEventListener('click',function(){show(i,true)});
    b.addEventListener('keydown',function(e){
      var k=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;
      if(k){e.preventDefault();var n=(i+k+T.length)%T.length;show(n,true);tabs.children[n].focus();}
    });
    tabs.appendChild(b);
  });
  show(0,false);
})();

/* Formulario – envío con Formspree */
(function(){
  var form=document.getElementById('form'),okBox=document.getElementById('ok'),
      err=document.getElementById('form-error'),btn=form.querySelector('button[type=submit]'),
      label=btn.textContent;
  function fail(msg){err.textContent=msg;err.hidden=false;}
  [].forEach.call(form.querySelectorAll('input,select,textarea'),function(i){
    i.addEventListener('input',function(){i.style.borderColor='';err.hidden=true;});
  });
  form.addEventListener('submit',function(ev){
    ev.preventDefault(); err.hidden=true;
    var valid=true,first=null;
    [].forEach.call(form.querySelectorAll('[required]'),function(i){
      var bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));
      i.style.borderColor=bad?'var(--crimson)':'';
      if(bad){valid=false;if(!first)first=i;}
    });
    if(!valid){first.focus();fail('Revisá los campos marcados en rojo.');return;}
    var url=form.getAttribute('action');
    if(url.indexOf('TU_ID_DE_FORMSPREE')>-1){fail('El formulario todavía no está configurado (falta el ID de Formspree).');return;}
    btn.disabled=true;btn.textContent='Enviando…';
    fetch(url,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){form.reset();form.style.display='none';okBox.classList.add('show');return;}
        throw new Error('http '+r.status);
      })
      .catch(function(){fail('No pudimos enviar tu consulta. Probá de nuevo en unos minutos o escribinos por email.');})
      .then(function(){btn.disabled=false;btn.textContent=label;});
  });
})();

(function(){
  var lb=document.getElementById('lb'),im=lb.querySelector('img'),last;
  function open(f){last=f;var s=f.querySelector('img');im.src=s.src;im.alt=s.alt;lb.hidden=false;document.body.style.overflow='hidden';document.getElementById('lbx').focus();}
  function close(){lb.hidden=true;document.body.style.overflow='';if(last)last.focus();}
  [].forEach.call(document.querySelectorAll('.gal figure'),function(f){
    f.addEventListener('click',function(){open(f)});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(f)}});
  });
  lb.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)close()});
})();

[].forEach.call(document.querySelectorAll('.it[data-ph]'),function(e){
  var s=document.querySelector('img[alt^="'+e.dataset.ph+'"]');
  if(!s)return;var i=document.createElement('img');i.className='th';i.src=s.src;i.alt='';e.appendChild(i);
});
