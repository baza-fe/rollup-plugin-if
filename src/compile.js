const CHAR_SHARP = '#';
const CHAR_SPACE = ' ';
const CHAR_LINE_FEED = '\n';

const RE_LETTER = /[a-z]/i;
const RE_LINE_FEED = /[\n\r]/i;

// [
//     { type: 'keyword', value: 'if' },
//     { type: 'expression', value: 'condition' },
//     { type: 'expression', value: 'statement'},
//     { type: 'keyword', value: 'endif' }
// ]
function tokenlize(input = '') {
    function peekBack(span = 1) {
        const index = i - span;

        return index >= 0 ? input[index] : '';
    }

    function isLineFeed(c) {
        return RE_LINE_FEED.test(c);
    }

    input = input.split('');

    let i, c, backC;
    const len = input.length;
    const tokens = [];

    for (i = 0; i < len; i += 1) {
        c = input[i];
        backC = peekBack();

        if (c === CHAR_SHARP && (!backC || isLineFeed(backC))) {
            let word = '';
            let exp = '';

            // skip sharp
            c = input[++i];

            while (c && RE_LETTER.test(c)) {
                word += c;
                c = input[++i];
            }

            tokens.push({
                type: 'keyword',
                value: word
            });

            // skip space
            while (c === CHAR_SPACE) {
                c = input[++i];
            }

            while (c && !isLineFeed(c)) {
                exp += c;
                c = input[++i];
            }

            tokens.push({
                type: 'expression',
                value: exp
            });
        } else {
            let exp = '';

            while (c && !isLineFeed(c)) {
                exp += c;
                c = input[++i];
            }

            if (exp && !isLineFeed(exp)) {
                tokens.push({
                    type: 'expression',
                    value: exp
                });
            }
        }
    }

    return tokens;
}

// [
//     {
//         condition: 'statement A',
//         statements: [ 'statement B', 'statement C' ]
//     }
// ]
function parse(tokens) {
    function reset() {
        inIf = false;
    }

    function add() {
        ast.push(node);
        node = null;

        return last();
    }

    function last() {
        return ast[ast.length - 1] || null;
    }

    function peekBack(span = 1) {
        const index = i - span;

        return index >= 0 ? tokens[index] : null;
    }

    function conditionBack() {
        let j = ast.length - 1, result = [], condition = null;

        while (j >= 0 && (condition = ast[j].condition)) {
            j--;
            result.push(condition);
        }

        return result.reverse();
    }

    let i, token, len = tokens.length;
    let node = null; // current node
    let inIf;

    const ast = [];

    for (i = 0; i < len; i += 1) {
        token = tokens[i];

        if (token.type === 'keyword') {
            switch (token.value) {
                case 'if':
                case 'elif':
                    inIf = true;

                    if (node) {
                        add();
                    }

                    node = {
                        condition: '',
                        statements: []
                    };
                    break;

                case 'else':
                    add();

                    node = {
                        condition: conditionBack().map((condition) => {
                            return `!(${condition})`;
                        }).join(' && '),
                        statements: []
                    };

                    break;

                case 'endif':
                    add();
                    break;

                default:
                    throw new Error(`unknow token value ${token.value}.`);
            }
        } else if (token.type === 'expression') {
            if (!token.value && (peekBack().type === 'keyword')) {
                continue;
            }

            if (node) {
                if (inIf) {
                    reset();
                    node.condition = `!!(${token.value})`;
                } else {
                    node.statements.push(token.value);
                }
            } else {
                node = {
                    statements: [
                        token.value
                    ]
                };
            }
        } else {
            throw new Error(`unknow token type ${token.type}.`);
        }
    }

    if (node) {
        add();
    }

    return ast;
}

function regexp(vars) {
    let key, val;
    const result = {};

    for (key in vars) {
        if (vars.hasOwnProperty(key)) {
            result[key] = {
                regexp: new RegExp(key, 'g'),
                expect: vars[key]
            };
        }
    }

    return result;
}

function transform(ast, replacers) {
    let i, len = ast.length;
    let node = null;

    for (i = 0; i < len; i += 1) {
        node = ast[i];

        if (!node.condition) {
            continue;
        }

        for (let key in replacers) {
            let { regexp, expect } = replacers[key];

            regexp.lastIndex = 0;
            node.condition = node.condition.replace(regexp, expect);
        }
    }

    return ast;
}

function generate(ast) {
    function exec(statement = 'true') {
        return new Function(`return ${statement};`)();
    }

    let i, len = ast.length;
    let node = null;
    let code = [];

    for (i = 0; i < len; i += 1) {
        node = ast[i];

        if (exec(node.condition)) {
            code = code.concat(node.statements);
        }
    }

    return code.join('\n');
}

export function compile(input, vars) {
    const tokens = tokenlize(input);
    const ast = transform(parse(tokens), regexp(vars));

    return generate(ast);
};