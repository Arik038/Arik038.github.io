import fs from 'fs';
const pages = ["index.html", "services.html", "dentures.html", "braces.html", "general.html", "gallery.html", "pricing.html", "about.html", "contact.html", "accessibility.html", "privacy.html", "terms.html"];
const base = process.env.SITE_URL || 'http://localhost:5000';
const now = new Date().toISOString();
const urls = pages.map(p => `  <url>
    <loc>${base}/${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
fs.writeFileSync('./sitemap.xml', xml);
console.log('sitemap.xml generated');
