import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4000/', {waitUntil:'networkidle'});
await page.evaluate(()=>window.scrollTo(0,500));
await page.waitForTimeout(1200);
const info = await page.evaluate(()=>{
 const cards=[...document.querySelectorAll('.destination-card')];
 const grid=cards[0]?.parentElement;
 return {count:cards.length, gridRect:grid?.getBoundingClientRect(), cards:cards.slice(0,2).map(c=>({rect:c.getBoundingClientRect(),opacity:getComputedStyle(c).opacity,transform:getComputedStyle(c).transform,html:c.outerHTML.slice(0,500), img:c.querySelector('img')?.getAttribute('src'), complete:c.querySelector('img')?.complete, nw:c.querySelector('img')?.naturalWidth}))};
});
console.log(JSON.stringify(info,null,2));
await browser.close();
