(function(){
  'use strict';
  /* email assembled at runtime so scrapers don't read it */
  var EM=['jevon','mybridge.loans'].join('@');
  document.querySelectorAll('[data-email]').forEach(function(el){el.textContent='Email '+EM});

  /* contact form via Web3Forms */
  var FORM_KEY='d84dac91-1fc5-4ddb-becc-5c79cb5de964';
  var form=document.getElementById('lead-form');
  if(form){
    var err=document.getElementById('form-error'),btn=form.querySelector('button[type="submit"]');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(form.botcheck&&form.botcheck.value)return;
      var name=form.name.value.trim(),email=form.email.value.trim();
      [form.name,form.email].forEach(function(f){f.removeAttribute('aria-invalid')});
      var bad=!name?[form.name,'Enter your name.']:(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?[form.email,'Enter an email so I can reply.']:null);
      if(bad){bad[0].setAttribute('aria-invalid','true');bad[0].focus();err.textContent=bad[1];return}
      err.textContent='';btn.disabled=true;var orig=btn.textContent;btn.textContent='Sending';
      var goal=form.goal.value||'Not specified';
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({access_key:FORM_KEY,subject:'perraloans.com: '+goal+' - '+name,from_name:'Perra Home Loans site',replyto:email,
          name:name,email:email,phone:form.phone.value.trim(),goal:goal,message:form.message.value.trim()})})
      .then(function(r){return r.json().then(function(d){if(!r.ok||!d.success)throw new Error(d.message||'failed')})})
      .then(function(){form.reset();location.href='/thanks.html'})
      .catch(function(){err.textContent='The message did not send. Call or text 949-463-9898, or email '+EM+'.'})
      .finally(function(){btn.disabled=false;btn.textContent=orig});
    });
  }

  /* analytics consent */
  (function(){
    var box=document.getElementById('consent');if(!box)return;
    var c=null;try{c=localStorage.getItem('ga-consent')}catch(e){}
    function grant(){if(window.gtag)gtag('consent','update',{analytics_storage:'granted'})}
    if(c==='yes'){grant();return}
    if(c==='no')return;
    box.hidden=false;
    document.getElementById('consent-yes').addEventListener('click',function(){try{localStorage.setItem('ga-consent','yes')}catch(e){}grant();box.hidden=true});
    document.getElementById('consent-no').addEventListener('click',function(){try{localStorage.setItem('ga-consent','no')}catch(e){}box.hidden=true});
  })();
})();
