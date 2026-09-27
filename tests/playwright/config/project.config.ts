import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectName = process.env.PLAY_PROJECT_NAME;

if (!projectName) {
  throw new Error('Deve-se informar o nome do projeto: ' + projectName);
}

const projectType = projectName === 'component' ? 'ct' : projectName;
const ctPort = Number(process.env.PLAY_CT_PORT) || 8182;
const galleryUrl = process.env.PLAY_CT_URL || `http://127.0.0.1:${ctPort}/playwright/gallery/index.html`;
const frontendDir = path.resolve(__dirname, '../../../apps/frontend');

export { ctPort, frontendDir, galleryUrl, projectName, projectType };

