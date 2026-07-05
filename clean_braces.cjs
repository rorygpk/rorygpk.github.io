const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    let curr = lines[i].trim();
    
    // Look for lines that mistakenly start with { but don't end with } or },
    // targeting the keys that were mangled by previous sed commands
    const targetKeys = ['id:', 'name:', 'title:', 'sender:', 'text:', 'emailUsername:', 'emailDomain:', 'fullName:', 'contact:', 'role:', 'storageQuota:', 'storageUsed:', 'verified:', 'verificationType:', 'banned:', 'medals:', 'activeBackground:', 'appId:', 'url:', 'resolution:', 'thumbnail:', 'duration:', 'category:', 'tags:', 'content:', 'timestamp:', 'read:', 'subject:', 'snippet:', 'body:', 'senderFullName:', 'senderUsername:', 'senderDomain:', 'receiverFullName:', 'receiverUsername:', 'receiverDomain:'];
    
    for (let key of targetKeys) {
        if (curr.startsWith('{ ' + key)) {
            if (!curr.endsWith('}') && !curr.endsWith('},')) {
                lines[i] = lines[i].replace('{ ' + key, key);
                modified = true;
            }
        }
    }
}

if (modified) {
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log('Modified src/App.tsx');
} else {
    console.log('No changes needed');
}
