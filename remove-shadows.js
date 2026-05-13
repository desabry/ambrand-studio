const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'css');

function removeShadows(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            removeShadows(fullPath);
        } else if (file.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove box-shadow lines
            content = content.replace(/.*box-shadow:.*;\n?/g, '');
            // Also remove text-shadow just in case
            content = content.replace(/.*text-shadow:.*;\n?/g, '');
            // Also remove transition involving box-shadow, maybe leave it or replace it?
            // "transition: transform 0.5s ease, box-shadow 0.5s ease;"
            content = content.replace(/,\s*box-shadow[^;]+/g, '');
            content = content.replace(/box-shadow[^,;]+,\s*/g, '');
            content = content.replace(/box-shadow[^;]+;/g, '');
            
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Processed ${fullPath}`);
        }
    }
}

removeShadows(cssDir);
