import { chromium } from 'playwright';
const browser = await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4000/', {waitUntil:'networkidle'});
await page.evaluate(()=>window.scrollTo(0,500)); await page.waitForTimeout(1500);
const info = await page.evaluate(()=>{
 const card=document.querySelector('.destination-card');
 const chain=[]; let el=card;
 while(el && chain.length<8){const s=getComputedStyle(el); chain.push({tag:el.tagName,cls:el.className,opacity:s.opacity,transform:s.transform,visibility:s.visibility,display:s.display,position:s.position,z:s.zIndex,rect:el.getBoundingClientRect().toJSON()}); el=el.parentElement;}
 const elAt=document.elementFromPoint(300,800);
 return {chain, atPoint:{tag:elAt?.tagName,cls:elAt?.className,html:elAt?.outerHTML?.slice(0,200)}};
});
console.log(JSON.stringify(info,null,2));
await page.screenshot({path:'artifacts/dest-debug.png', fullPage:false});
await browser.close();
