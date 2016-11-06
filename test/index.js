import test from 'ava';
import { readFileSync } from 'fs';
import { rollup } from 'rollup';
import instruction from '../';

function squareWhitespace (str) {
  return str.trim().replace(/[\r\n]/, '')
}

test('should if statement works', t => {
    return rollup({
        entry: 'fixtures/if/actual',
        plugins: [
            instruction({
                vars: {
                    FLAG: true
                }
            })
        ]
    }).then(bundle => {
        t.is(
            squareWhitespace(bundle.generate().code),
            squareWhitespace(readFileSync('./fixtures/if/expected.js').toString())
        );
    });
});

test('should if-else statement works', t => {
    return rollup({
        entry: 'fixtures/if-else/actual',
        plugins: [
            instruction({
                vars: {
                    FLAG: true
                }
            })
        ]
    }).then(bundle => {
        t.is(
            squareWhitespace(bundle.generate().code),
            squareWhitespace(readFileSync('./fixtures/if-else/expected.js').toString())
        );
    });
});

test('should if-elif statement works', t => {
    return rollup({
        entry: 'fixtures/if-elif/actual',
        plugins: [
            instruction({
                vars: {
                    FLAG1: true,
                    FLAG2: false
                }
            })
        ]
    }).then(bundle => {
        t.is(
            squareWhitespace(bundle.generate().code),
            squareWhitespace(readFileSync('./fixtures/if-elif/expected.js').toString())
        );
    });
});

test('should if-elif-else statement works', t => {
    return rollup({
        entry: 'fixtures/if-elif-else/actual',
        plugins: [
            instruction({
                vars: {
                    FLAG1: false,
                    FLAG2: false
                }
            })
        ]
    }).then(bundle => {
        t.is(
            squareWhitespace(bundle.generate().code),
            squareWhitespace(readFileSync('./fixtures/if-elif-else/expected.js').toString())
        );
    });
});
