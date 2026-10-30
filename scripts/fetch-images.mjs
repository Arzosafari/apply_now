import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('public/images');
await fs.mkdir(OUT, { recursive: true });

const images = {
  'hero-city': 'photo-1477959858617-67f85cf4f1df',
  'cta-city': 'photo-1514565131-fce0801e5785',
  'destination-canada': 'photo-1517935706615-2717063c2225',
  'destination-germany': 'photo-1560969184-10fe8719e047',
  'destination-australia': 'photo-1506973035872-a4ec16b8e8d9',
  'destination-uk': 'photo-1513635269975-59663e0ac1ad',
  'destination-usa': 'photo-1485871981521-5b1fd3805eee',
  'destination-netherlands': 'photo-1534351590666-13e3e96b5017',
  'study-abroad': 'photo-1523240795612-9a054b0db644',
  'consultation': 'photo-1556761175-b413da4baf72',
  'office': 'photo-1497366811353-6870744d04b2',
  'team': 'photo-1521737711867-e3b97375f902',
  'expert-1': 'photo-1560250097-0b93528c311a',
  'expert-2': 'photo-1573496359142-b8d87734a5a2',
  'expert-3': 'photo-1507003211169-0a1dd7228f2d',
  'expert-4': 'photo-1580489944761-15a19d654956',
  'blog-1': 'photo-1434030216411-0b793f4b4173',
  'blog-2': 'photo-1523050854058-8df90110c9f1',
  'blog-3': 'photo-1454165804606-c3d57bc86b40',
  'blog-4': 'photo-1524995997946-a1c2e315a42f',
  'article-1': 'photo-1521295121783-8a321d551ad2',
  'article-2': 'photo-1503676260728-1c00da094a0b',
  'article-3': 'photo-1543269865-cbf427effbad',
  'university': 'photo-1562774053-701939374585',
  'visa-documents': 'photo-1450101499163-c8848c66ca85',
  'testimonial-1': 'photo-1494790108377-be9c29b29330',
  'testimonial-2': 'photo-1500648767791-00dcc994a43e',
  'testimonial-3': 'photo-1534528741775-53994a69daeb',
};

const flags = { canada: 'ca', germany: 'de', australia: 'au', uk: 'gb', usa: 'us', netherlands: 'nl' };

async function fetchToFile(url, file) {
  const res = await fetch(url, { headers: { 'User-Agent': 'FaraTech site build' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Too small (${buf.length}) ${url}`);
  await fs.writeFile(file, buf);
  return buf.length;
}

for (const [name, id] of Object.entries(images)) {
  const file = path.join(OUT, `${name}.jpg`);
  try {
    const len = await fetchToFile(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=82&fm=jpg`, file);
    console.log('image', name, len);
  } catch (error) {
    console.error('FAIL', name, error.message);
  }
}

await fs.mkdir(path.join(OUT, 'flags'), { recursive: true });
for (const [name, code] of Object.entries(flags)) {
  const file = path.join(OUT, 'flags', `${name}.svg`);
  try {
    const len = await fetchToFile(`https://flagcdn.com/${code}.svg`, file);
    console.log('flag', name, len);
  } catch (error) {
    console.error('FAIL flag', name, error.message);
  }
}
