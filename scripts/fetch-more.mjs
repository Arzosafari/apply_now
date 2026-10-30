const fs=require('fs');
const files=['blog-2'];
const ids=['photo-1517486808906-6ca8b3f04846'];
(async()=>{for(let i=0;i<files.length;i++){const r=await fetch(`https://images.unsplash.com/${ids[i]}?auto=format&fit=crop&w=1800&q=82&fm=jpg`);if(!r.ok){console.log('fail',r.status);continue}const b=Buffer.from(await r.arrayBuffer());fs.writeFileSync(`public/images/${files[i]}.jpg`,b);console.log(files[i],b.length)}; const flags={canada:'ca',germany:'de',australia:'au',uk:'gb',usa:'us',netherlands:'nl'}; fs.mkdirSync('public/images/flags',{recursive:true}); for(const [n,c] of Object.entries(flags)){const r=await fetch(`https://flagcdn.com/w320/${c}.png`); const b=Buffer.from(await r.arrayBuffer()); fs.writeFileSync(`public/images/flags/${n}.png`,b);console.log('flag',n,b.length)}})();
