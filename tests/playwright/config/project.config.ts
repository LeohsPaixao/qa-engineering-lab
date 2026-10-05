import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectType: string = process.env.PLAY_PROJECT_TYPE || 'e2e';
const ctPort: number = Number(process.env.PLAY_CT_PORT) || 8182;
const galleryUrl: string = process.env.PLAY_CT_URL || `http://127.0.0.1:${ctPort}/playwright/gallery/index.html`;
const frontendDir: string = path.resolve(__dirname, '../../../apps/frontend');

export { ctPort, frontendDir, galleryUrl, projectType };
