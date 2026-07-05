const fs = require('fs');

function fixBrackets(content) {
    let result = '';
    let stack = []; // Stack for brackets
    let stateStack = []; // Stack for states (null, '"', "'", '`', 'interpolation')
    let i = 0;

    function getCurrentState() {
        return stateStack[stateStack.length - 1] || null;
    }

    let line = 1;
    while (i < content.length) {
        let char = content[i];
        if (char === '\n') line++;
        let next = content[i + 1];
        let state = getCurrentState();

        if (line === 532) {
             console.log(`Line 532 char: ${JSON.stringify(char)}, state: ${state}, stateStack: ${stateStack.join(',')}, stack: ${stack.join('')}`);
        }

        // Handle single-line comments
        if (state === '//') {
            if (char === '\n') {
                stateStack.pop();
            }
            result += char;
            i++;
            continue;
        }

        // Handle multi-line comments
        if (state === '/*') {
            if (char === '*' && next === '/') {
                stateStack.pop();
                result += '*/';
                i += 2;
            } else {
                result += char;
                i++;
            }
            continue;
        }

        // Handle strings and template literals
        if (state === '"' || state === "'") {
            if (char === '\\') {
                result += char + (next || '');
                i += 2;
            } else if (char === state) {
                stateStack.pop();
                result += char;
                i++;
            } else {
                result += char;
                i++;
            }
            continue;
        }

        if (state === '`') {
            if (char === '\\') {
                result += char + (next || '');
                i += 2;
            } else if (char === '`') {
                stateStack.pop();
                result += char;
                i++;
            } else if (char === '$' && next === '{') {
                stateStack.push('interpolation');
                stack.push('}');
                result += '${';
                i += 2;
            } else {
                result += char;
                i++;
            }
            continue;
        }

        // Inside interpolation or outside everything
        if (char === '/' && next === '/') {
            stateStack.push('//');
            result += '//';
            i += 2;
        } else if (char === '/' && next === '*') {
            stateStack.push('/*');
            result += '/*';
            i += 2;
        } else if (char === '"' || char === "'" || char === '`') {
            stateStack.push(char);
            result += char;
            i++;
        } else if (char === '(') {
            stack.push(')');
            result += char;
            i++;
        } else if (char === '{') {
            stack.push('}');
            result += char;
            i++;
        } else if (char === ')' || char === '}') {
            if (stack.length > 0) {
                let expected = stack.pop();
                result += expected;
                if (expected === '}' && state === 'interpolation') {
                    stateStack.pop();
                }
            } else {
                result += char;
            }
            i++;
        } else {
            result += char;
            i++;
        }
    }
    console.log('Final stack size:', stack.length);
    console.log('Final stateStack:', stateStack);
    return result;
}

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
const fixedContent = fixBrackets(content);
fs.writeFileSync(filePath, fixedContent);
console.log('Brackets fixed.');
