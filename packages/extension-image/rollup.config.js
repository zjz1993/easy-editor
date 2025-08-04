import {createRollupConfig} from '../../scripts/rollup.common';
import packageJson from './package.json';

export default createRollupConfig({ pkg: packageJson, projectPath: __dirname });
