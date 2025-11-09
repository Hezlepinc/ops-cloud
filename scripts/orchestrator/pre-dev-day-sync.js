#!/usr/bin/env node
const https = require('https');
const ORCH = process.env.ORCH_API_URL || 'https://ops-orchestrator.onrender.com';
function get(p){return new Promise((res,rej)=>https.get(ORCH+p,(r)=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res({code:r.statusCode,body:d}));}).on('error',rej));}
(async()=>{
  const s = await get('/ai/status');
  try{
    const j = JSON.parse(s.body);
    console.log('Orchestrator Status:', j?.ok ?? s.code);
    console.log('Cloudways:', j.cloudways?.summary || 'n/a');
    console.log('GitHub last commit:', j.github?.[0]?.sha, j.github?.[0]?.message);
    console.log('WP:', j.wp || j.wordpress || 'n/a');
  }catch(e){ console.log(s.body); }
})();


