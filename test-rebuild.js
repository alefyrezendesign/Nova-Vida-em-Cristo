const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('0:', html.length);
html = html.replace(/<header class="top-nav" id="topNav">[\s\S]*?<\/header>/g, '');
html = html.replace(/<nav class="top-nav.*?<\/nav>/igs, '');
console.log('1:', html.length);

const new_hero = '';
html = html.replace(/<section class="hero" id="hero">[\s\S]*?<\/section>/g, new_hero);
html = html.replace(/<div class="trigger-warning" id="trigger-warning">[\s\S]*?<\/div>\s*<\/div>/g, '');
console.log('2:', html.length);

html = html.replace(/<div class="details-section">\s*<h2 class="details-title">(.*?)<\/h2>/g, '');
html = html.replace(/<!-- Scene 1:/g, '');
console.log('3:', html.length);

html = html.replace(/<section class="scene accordion[^"]*" id="(scene-\d+)" data-title="(.*?)">/g, '');
html = html.replace(/<div class="accordion-header"[^>]*>\s*<h2>(.*?)<\/h2>\s*<i class="fa-solid fa-chevron-down toggle-icon"><\/i>\s*<\/div>/g, '');
html = html.replace(/<div class="accordion-content">/g, '');
console.log('4:', html.length);

html = html.replace(/<span class="action-text[^"]*">(.*?)<\/span>/g, '');
html = html.replace(/<p class="action-text[^"]*">(.*?)<\/p>/g, '');
html = html.replace(/<p><span class="stage-direction block-direction">/g, '');
html = html.replace(/<\/div><\/p>/g, '');
console.log('5:', html.length);

html = html.replace(/<div class="char-name">(.*?)<\/div>/g, (match, name) => {
    return '';
});
console.log('6:', html.length);

html = html.replace(/AUDIO_PLACEHOLDER/g, '');
html = html.replace(/<span class="tag">Coment.*?rio<\/span>/gi, '');
console.log('7:', html.length);
