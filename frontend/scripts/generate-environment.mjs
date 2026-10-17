import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const isProductionBuild = process.argv.includes('--production');
const isMockMode = process.argv.includes('--mock');
const dataSource = isMockMode
  ? 'frontend-mock'
  : process.env.PORTFOLIO_DATA_SOURCE ?? 'api';

if (dataSource !== 'api' && dataSource !== 'frontend-mock') {
  throw new Error('PORTFOLIO_DATA_SOURCE must be "api" or "frontend-mock".');
}

const configuredApiUrl = process.env.PORTFOLIO_API_URL?.trim();
if (isProductionBuild && !configuredApiUrl) {
  throw new Error('PORTFOLIO_API_URL must be set for production builds.');
}

const configuredSiteUrl = process.env.PORTFOLIO_SITE_URL?.trim();
if (isProductionBuild && !configuredSiteUrl) {
  throw new Error('PORTFOLIO_SITE_URL must be set for production builds.');
}

const siteUrl = (configuredSiteUrl ?? 'http://localhost:4200').replace(/\/+$/, '');

const apiUrl = (configuredApiUrl ?? 'http://localhost:5124/api').replace(/\/+$/, '');

if (!apiUrl) {
  throw new Error('PORTFOLIO_API_URL must not be empty.');
}

const contents = `export const environmentValues: {
    dataSource: 'api' | 'frontend-mock';
    apiUrl: string;
    siteUrl: string;
} = ${JSON.stringify({
  dataSource: isProductionBuild ? 'api' : dataSource,
  apiUrl,
  siteUrl
}, null, 4)};
`;

const outputPath = fileURLToPath(new URL('../src/environments/environment.generated.ts', import.meta.url));
await writeFile(outputPath, contents);
const languages = ['de', 'en'];
const pages = ['', '/projects'];

const sitemapEntries = pages.flatMap(page =>
  languages.map(language => {
    const alternates = languages
      .map(
        alternate =>
          `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${siteUrl}/${alternate}${page}"/>`
      )
      .join('\n');
    return `  <url>\n    <loc>${siteUrl}/${language}${page}</loc>\n${alternates}\n  </url>`;
  })
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const publicDir = new URL('../public/', import.meta.url);
await mkdir(publicDir, { recursive: true });
await writeFile(new URL('sitemap.xml', publicDir), sitemap);
await writeFile(new URL('robots.txt', publicDir), robots);
