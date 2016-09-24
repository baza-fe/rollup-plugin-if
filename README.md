rollup-plugin-if
=====

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

### if-elif-endif

```js
#if FLAG1
window.a = 1;
#elif FLAG2
window.b = 2;
#endif
```

```json
{
    "FLAG1": false,
    "FLAG2": true
}
```

will yeild:

```js
window.b = 2;
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