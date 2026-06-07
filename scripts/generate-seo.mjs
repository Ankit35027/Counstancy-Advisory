import fs from "fs";
import path from "path";

const services = [
  "itr-filing",
  "gst-services",
  "tax-planning",
  "tax-notices",
  "nri-tax",
  "tds-tcs",
  "business-registration",
  "capital-gains",
];

const configuredSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || "";
const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
const publicDir = path.resolve("public");

if (!siteUrl) {
  console.warn("Skipping sitemap generation because VITE_SITE_URL is not set.");
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });

const urls = [
  { loc: siteUrl, priority: "1.0" },
  ...services.map((service) => ({
    loc: `${siteUrl}/services/${service}`,
    priority: "0.8",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
console.log(`Generated SEO files for ${siteUrl}`);
