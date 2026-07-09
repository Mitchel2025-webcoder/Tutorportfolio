/*
  MITCHEL CHRIS — script.js
  --------------------------
  NOTE: All scripts are also embedded inside index.html so the site
  works on Android. This file is for web-server deployments.
  
  Copy the <script> block from index.html here if you want
  clean separation when hosting online.
*/
'use strict';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async function typewriter(){
  const el = document.getElementById('tw');
  if(!el) return;
  const phrases = ['Online Tutor','Mathematics Teacher','Web Developer','Your Learning Partner'];
  await sleep(800);
  let i = 0;
  while(true){
    const p = phrases[i % phrases.length];
    for(let c = 1; c <= p.length; c++){ el.textContent = p.slice(0,c); await sleep(88); }
    await sleep(1900);
    for(let c = p.length-1; c >= 0; c--){ el.textContent = p.slice(0,c); await sleep(46); }
    await sleep(360);
    i++;
  }
})();
