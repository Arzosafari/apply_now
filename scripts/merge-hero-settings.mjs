import Database from 'better-sqlite3';
const db = new Database('data/faratech.db');
const row = db.prepare("SELECT value FROM site_settings WHERE key = 'hero'").get();
const hero = JSON.parse(row.value);
Object.assign(hero, {
  eyebrow_fa: hero.eyebrow_fa || 'تحصیل · کار · زندگی · خارج از کشور',
  title_fa: hero.title_fa || 'سفر جهانی شما',
  highlight_fa: hero.highlight_fa || 'از اینجا آغاز می‌شود',
  supporting_fa: hero.supporting_fa || 'رؤیاهای خود را به واقعیت تبدیل کنید.',
  primaryCta_fa: hero.primaryCta_fa || 'دریافت مشاوره رایگان',
  secondaryCta_fa: hero.secondaryCta_fa || 'مشاهده خدمات',
});
db.prepare("UPDATE site_settings SET value = ?, updated_at = ? WHERE key = 'hero'").run(JSON.stringify(hero), new Date().toISOString());
console.log(hero.title_fa);
