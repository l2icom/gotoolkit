const fs = require('fs');
const path = require('path');
const stylelint = require('stylelint');

async function fixFile(filePath) {
    const abs = path.resolve(filePath);
    const css = fs.readFileSync(abs, 'utf8');
    const config = require(path.resolve(__dirname, '..', '.stylelint-temp.json'));
    const res = await stylelint.lint({ code: css, config, fix: true, codeFilename: abs });
    if (res.output && res.output.length) {
        fs.writeFileSync(abs, res.output, 'utf8');
        console.log('Fixed:', filePath);
    } else {
        console.log('No changes for:', filePath);
    }
}

const args = process.argv.slice(2);
if (!args.length) {
    console.error('Usage: node tools/stylefix.js <file.css>');
    process.exit(1);
}

fixFile(args[0]).catch(err => {
    console.error(err);
    process.exit(2);
});
