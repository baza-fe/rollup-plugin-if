rollup-plugin-if
=====

<p>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
    </a>
    <a href="https://github.com/baza-fe/rollup-plugin-if/issues">
        <img src="https://img.shields.io/github/issues/baza-fe/rollup-plugin-if.svg" alt="Issues" />
    </a>
    <a href="http://standardjs.com/">
        <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
    </a>
    <a href="https://npmjs.org/package/rollup-plugin-if">
        <img src="https://img.shields.io/npm/v/rollup-plugin-if.svg?style=flat-squar" alt="NPM" />
    </a>
    <a href="https://github.com/baza-fe/rollup-plugin-if/releases">
        <img src="https://img.shields.io/github/release/baza-fe/rollup-plugin-if.svg" alt="Latest Version" />
    </a>
    <a href="https://travis-ci.org/baza-fe/rollup-plugin-if">
        <img src="https://travis-ci.org/baza-fe/rollup-plugin-if.svg?branch=master" />
    </a>
</p>

## Install

```bash
$ npm install rollup-plugin-if -D
```

## Syntax

```
#[keyword] [expression]

// javascript code goes here

#end[keyword]
```

## Usage

```js
import { rollup } from 'rollup';
import instruction from 'rollup-plugin-if';

rollup({
    entry: 'main.js',
    plugins: [
        instruction({
            FLAG1: true,
            FLAG2: true
        })
    ]
}).then(...);
```

## Statements

### `if`

```js
#if FLAG
window.a = 1;
#endif

window.b = 2;
```

```json
{
    "FLAG": true
}
```

will yeild:

```js
window.a = 1;
window.b = 2;
```

### if-else-endif

```js
#if FLAG
window.a = 1;
#else
window.a = 2;
#endif
```

```json
{
    "FLAG": true
}
```

will yeild:

```js
window.a = 1;
```

### if-elif-else-endif

```js
#if FLAG1
window.a = 1;
#elif FLAG2
window.b = 2;
#else
window.c = 3;
#endif
```

```json
{
    "FLAG1": false,
    "FLAG2": false
}
```

will yeild:

```js
window.c = 3;
```



## License

MIT &copy; [BinRui.Guan](mailto:differui@gmail.com)
