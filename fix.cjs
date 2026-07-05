const fs = require('fs');

function fix(content) {
    let result = '';
    let stack = [];
    let i = 0;
    let stateStack = [];

    while (i < content.length) {
        let char = content[i];
        let next = content[i + 1];
        let state = stateStack[stateStack.length - 1] || null;

        if (state === '//') {
            if (char === '\n') stateStack.pop();
            result += char; i++; continue;
        }
        if (state === '/*') {
            if (char === '*' && next === '/') { stateStack.pop(); result += '*/'; i += 2; }
            else { result += char; i++; }
            continue;
        }
        if (state === '"' || state === "'") {
            if (char === '\\') { result += char + (next || ''); i += 2; }
            else if (char === state) { stateStack.pop(); result += char; i++; }
            else { result += char; i++; }
            continue;
        }
        if (state === '`') {
            if (char === '\\') { result += char + (next || ''); i += 2; }
            else if (char === '`') { stateStack.pop(); result += char; i++; }
            else if (char === '$' && next === '{') {
                stateStack.push('interpolation');
                stack.push({ type: '}', origin: 'interpolation' });
                result += '${'; i += 2;
            } else { result += char; i++; }
            continue;
        }

        if (char === '/' && next === '/') { stateStack.push('//'); result += '//'; i += 2; }
        else if (char === '/' && next === '*') { stateStack.push('/*'); result += '/*'; i += 2; }
        else if (char === '"' || char === "'" || char === '`') { stateStack.push(char); result += char; i++; }
        else if (char === '(') { stack.push({ type: ')' }); result += char; i++; }
        else if (char === '{') { stack.push({ type: '}' }); result += char; i++; }
        else if (char === ')' || char === '}') {
            if (stack.length > 0) {
                let expected = stack.pop();
                result += expected.type;
                if (expected.origin === 'interpolation') stateStack.pop();
            } else {
                result += char;
            }
            i++;
        } else {
            result += char; i++;
        }
    }
    
    // Add missing closers
    while (stack.length > 0) {
        result += stack.pop().type;
    }
    
    return result;
}

const file = 'src/App.tsx';
const data = fs.readFileSync(file, 'utf8');
const fixed = fix(data);
fs.writeFileSync(file, fixed);
console.log('Done');
