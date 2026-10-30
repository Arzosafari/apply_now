import fs from 'node:fs/promises';
const flags = { canada:'ca', germany:'de', australia:'au', uk:'gb', usa:'us', netherlands:'nl' };
await fs.mkdir('public/images/flags',{recursive:true});
for (const [name,code] of Object.entries(flags)) {
  const res = await fetch(`https://flagcdn.com/w320/${code}.png`);
  if (!res.ok) { console.log('FAIL',name,res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(`public/images/flags/${name}.png`, buf);
  console.log('flag',name,buf.length);
}
