import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectName = process.env.PW_PROJECT_NAME;

if (!projectName) {
  throw new Error('Deve-se informar o nome do projeto: ' + projectName);
}

const projectType = projectName === 'component' ? 'ct' : projectName;

export { projectName, projectType };
