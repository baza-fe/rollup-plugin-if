import { createFilter } from 'rollup-pluginutils';
import { compile } from './compile';

export default function plugin(options = {}) {
    const filter = createFilter(options.include || [ '**/*.js' ], options.exclude || 'node_modules/**');

    return {
        transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            return {
                map: { mappings: '' },
                code: compile(code, options.vars)
            };
        }
    }
};