rollup-plugin-if
=====

## Install

```bash
$ npm install rollup-plugin-if -D
```

## Syntax

```
#[statement] [expression]

// javascript code goes here

#end[statement]
```

## Usage

```js
import { rollup } from 'rollup';
import instruction from 'rollup-plugin-if';

rollup({
    entry: 'main.js',
    plugins: [
        instruction()
    ]
}).then(...);
```

## Statements

### `if`

```js
#if FLAG
    import * from './mock';
#endif

import * from './util';
```

```json
{
    "DEV": true
}
```

will yeild:

```js
import * from './util';
```



## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)