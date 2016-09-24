import { createFilter } from 'rollup-pluginutils';

var CHAR_SHARP = '#';
var CHAR_SPACE = ' ';
var RE_LETTER = /[a-z]/i;
var RE_LINE_FEED = /[\n\r]/i;

// [
//     { type: 'keyword', value: 'if' },
//     { type: 'expression', value: 'condition' },
//     { type: 'expression', value: 'statement'},
//     { type: 'keyword', value: 'endif' }
// ]
function tokenize() {
    var input = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    function peekBack() {
        var span = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var index = i - span;

        return index >= 0 ? input[index] : '';
    }

    function isLineFeed(c) {
        return RE_LINE_FEED.test(c);
    }

    input = input.split('');

    var i = void 0,
        c = void 0,
        backC = void 0;
    var len = input.length;
    var tokens = [];

    for (i = 0; i < len; i += 1) {
        c = input[i];
        backC = peekBack();

        if (c === CHAR_SHARP && (!backC || isLineFeed(backC))) {
            var word = '';
            var exp = '';

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
            var _exp = '';

            while (c && !isLineFeed(c)) {
                _exp += c;
                c = input[++i];
            }

            if (_exp && !isLineFeed(_exp)) {
                tokens.push({
                    type: 'expression',
                    value: _exp
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

    function peekBack() {
        var span = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var index = i - span;

        return index >= 0 ? tokens[index] : null;
    }

    function conditionBack() {
        var j = ast.length - 1,
            result = [],
            condition = null;

        while (j >= 0 && (condition = ast[j].condition)) {
            j--;
            result.push(condition);
        }

        return result.reverse();
    }

    var i = void 0,
        token = void 0,
        len = tokens.length;
    var node = null; // current node
    var inIf = void 0;

    var ast = [];

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
                        condition: conditionBack().map(function (condition) {
                            return '!(' + condition + ')';
                        }).join(' && '),
                        statements: []
                    };

                    break;

                case 'endif':
                    add();
                    break;

                default:
                    throw new Error('unknow token value ' + token.value + '.');
            }
        } else if (token.type === 'expression') {
            if (!token.value && peekBack().type === 'keyword') {
                continue;
            }

            if (node) {
                if (inIf) {
                    reset();
                    node.condition = '!!(' + token.value + ')';
                } else {
                    node.statements.push(token.value);
                }
            } else {
                node = {
                    statements: [token.value]
                };
            }
        } else {
            throw new Error('unknow token type ' + token.type + '.');
        }
    }

    if (node) {
        add();
    }

    return ast;
}

function regexp(vars) {
    var key = void 0,
        val = void 0;
    var result = {};

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

function transform$1(ast, replacers) {
    var i = void 0,
        len = ast.length;
    var node = null;

    for (i = 0; i < len; i += 1) {
        node = ast[i];

        if (!node.condition) {
            continue;
        }

        for (var key in replacers) {
            var _replacers$key = replacers[key];
            var _regexp = _replacers$key.regexp;
            var expect = _replacers$key.expect;


            _regexp.lastIndex = 0;
            node.condition = node.condition.replace(_regexp, expect);
        }
    }

    return ast;
}

function generate(ast) {
    function exec() {
        var statement = arguments.length <= 0 || arguments[0] === undefined ? 'true' : arguments[0];

        return new Function('return ' + statement + ';')();
    }

    var i = void 0,
        len = ast.length;
    var node = null;
    var code = [];

    for (i = 0; i < len; i += 1) {
        node = ast[i];

        if (exec(node.condition)) {
            code = code.concat(node.statements);
        }
    }

    return code.join('\n');
}

function compile(input, vars) {
    var tokens = tokenize(input);
    var ast = transform$1(parse(tokens), regexp(vars));

    return generate(ast);
}

function plugin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var filter = createFilter(options.include || ['**/*.js'], options.exclude || 'node_modules/**');

    return {
        transform: function transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            return {
                map: { mappings: '' },
                code: compile(code, options.vars)
            };
        }
    };
}

export default plugin;