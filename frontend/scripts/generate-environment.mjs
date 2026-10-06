import { writeFile } from 'node:fs/promises';
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

const apiUrl = (configuredApiUrl ?? 'http://localhost:5124/api').replace(/\/+$/, '');

if (!apiUrl) {
  throw new Error('PORTFOLIO_API_URL must not be empty.');
}

const contents = `export const environmentValues: {
    dataSource: 'api' | 'frontend-mock';
    apiUrl: string;
} = ${JSON.stringify({
  dataSource: isProductionBuild ? 'api' : dataSource,
  apiUrl
}, null, 4)};
`;

const outputPath = fileURLToPath(new URL('../src/environments/environment.generated.ts', import.meta.url));
await writeFile(outputPath, contents);