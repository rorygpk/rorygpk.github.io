const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
let stack = [];
let i = 0;
let line = 1;
let stateStack = [];

while (i < content.length) {
    let char = content[i];
    if (char === '\n') line++;
    let next = content[i + 1];
    let state = stateStack[stateStack.length - 1] || null;

    if (state === '//') {
        if (char === '\n') stateStack.pop();
    } else if (state === '/*') {
        if (char === '*' && next === '/') { stateStack.pop(); i++; }
    } else if (state === '"' || state === "'") {
        if (char === '\\') { i++; }
        else if (char === state) { stateStack.pop(); }
    } else if (state === '`') {
        if (char === '\\') { i++; }
        else if (char === '`') { stateStack.pop(); }
        else if (char === '$' && next === '{') {
            stateStack.push('interpolation');
            stack.push({ type: '}', line });
            i++;
        }
    } else {
        if (char === '/' && next === '/') { stateStack.push('//'); i++; }
        else if (char === '/' && next === '*') { stateStack.push('/*'); i++; }
        else if (char === '"' || char === "'" || char === '`') { stateStack.push(char); }
        else if (char === '(') { stack.push({ type: ')', line }); }
        else if (char === '{') { stack.push({ type: '}', line }); }
        else if (char === ')' || char === '}') {
            if (stack.length === 0) {
                console.log(`Unmatched ${char} at line ${line}`);
            } else {
                let expected = stack.pop();
                if (expected.type !== char) {
                    console.log(`Mismatched ${char} at line ${line} (expected ${expected.type} from line ${expected.line})`);
                }
                if (expected.type === '}' && state === 'interpolation') stateStack.pop();
            }
        }
    }
    i++;
}
console.log('Final stack size:', stack.length);
if (stack.length > 0) {
    console.log('Final stack items (origin lines):');
    stack.forEach(item => console.log(`${item.type} from line ${item.line}`));
}
