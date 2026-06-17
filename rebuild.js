const fs = require('fs');

try {
    let html = fs.readFileSync('index.html', 'utf8');

    // 1. Remove old header and replace with properly hidden one
    const new_header = `
<nav class="top-nav hidden" id="top-nav">
    <div class="nav-content">
        <div class="header-left">
            <button id="menu-btn" aria-label="Menu" onclick="toggleMenu()"><i class="fa-solid fa-bars"></i></button>
            <span class="current-scene-title" id="current-scene">Detalhes da Peça</span>
        </div>
        <div class="header-right">
            <span class="progress-text" id="progress-text">0%</span>
            <button id="fullscreen-btn" aria-label="Tela Cheia" title="Tela Cheia" onclick="toggleFullscreen()"><i class="fa-solid fa-expand"></i></button>
        </div>
    </div>
    <div class="progress-bar-container">
        <div class="progress-bar" id="progress-bar"></div>
    </div>
</nav>

<!-- Custom Audio Player UI -->\n<div class="custom-audio-player hidden" id="custom-audio-player">\n    <div class="player-header">\n        <span id="player-title">Trilha</span>\n        <button id="player-close" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>\n    </div>\n    <div class="player-controls">\n        <button id="player-play"><i class="fa-solid fa-play"></i></button>\n        <div class="player-timeline-container">\n            <input type="range" id="player-timeline" value="0" min="0" max="100" step="1">\n            <div class="player-time">\n                <span id="player-current-time">0:00</span>\n                <span id="player-total-time">0:00</span>\n            </div>\n        </div>\n    </div>\n    <div class="player-options">\n        <label><input type="checkbox" id="use-fade" checked> FADE IN/OUT (Transi��o Suave)</label>\n    </div>\n</div>\n\n<!-- Drawer Menu -->
<div class="drawer-overlay" id="drawer-overlay" onclick="toggleMenu()"></div>
<div class="drawer-menu" id="drawer-menu">
    <div class="drawer-header">
        <h3>Índice</h3>
        <button id="close-menu-btn" onclick="toggleMenu()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <ul class="drawer-list" id="drawer-list">
        <!-- JS vai preencher -->
    </ul>
</div>
`;

    html = html.replace(/<header class="top-nav" id="topNav">[\s\S]*?<\/header>/g, '');
    html = html.replace(/<nav class="top-nav.*?<\/nav>/igs, '');
    html = html.replace(/<body>/, '<body>\n' + new_header);

    // 2. Fix Hero Section
    const new_hero = `
<section class="hero" id="hero">
    <div class="hero-content">
        <img src="simbol-encontro-horizontal-claro.png" alt="Encontro com Deus" class="hero-logo">
        <h1 class="hero-title">O Inimigo<br>no Meu Lar</h1>
        <p class="hero-subtitle">Roteiro Completo</p>
        <button class="btn-primary" onclick="startReading()">Iniciar Leitura <i class="fa-solid fa-arrow-down"></i></button>
    </div>
</section>

<div class="trigger-warning" id="trigger-warning">
    <div class="warning-content">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p><strong>Aviso de Conteúdo:</strong> Esta peça contém temas sensíveis relacionados a violência, conflitos familiares, automutilação e ideação suicida.</p>
    </div>
</div>
`;
    html = html.replace(/<section class="hero" id="hero">[\s\S]*?<\/section>/g, new_hero);
    html = html.replace(/<div class="trigger-warning" id="trigger-warning">[\s\S]*?<\/div>\s*<\/div>/g, '');

    // 3. Fix Accordions to Scene-Section
    html = html.replace(/<div class="details-section">\s*<h2 class="details-title">(.*?)<\/h2>/g, '<section class="scene-section expanded" id="scene-0" data-title="$1">\n<div class="scene-header accordion-header" onclick="toggleScene(this)">\n  <div class="scene-title-wrapper">\n    <h2 class="scene-title">$1</h2>\n    <i class="fa-solid fa-chevron-down toggle-icon"></i>\n  </div>\n  <div class="scene-divider"></div>\n</div>\n<div class="scene-content">');
    html = html.replace(/<!-- Scene 1:/g, '</section>\n\n        <!-- Scene 1:');
    html = html.replace(/<section class="scene accordion[^"]*" id="(scene-\d+)" data-title="(.*?)">/g, '<section class="scene-section expanded" id="$1" data-title="$2">');
    html = html.replace(/<div class="accordion-header"[^>]*>\s*<h2>(.*?)<\/h2>\s*<i class="fa-solid fa-chevron-down toggle-icon"><\/i>\s*<\/div>/g, '<div class="scene-header accordion-header" onclick="toggleScene(this)">\n  <div class="scene-title-wrapper">\n    <h2 class="scene-title">$1</h2>\n    <i class="fa-solid fa-chevron-down toggle-icon"></i>\n  </div>\n  <div class="scene-divider"></div>\n</div>');
    html = html.replace(/<div class="accordion-content">/g, '<div class="scene-content">');

    // 4. Rubricas (Stage Directions)
    html = html.replace(/<span class="action-text[^"]*">(.*?)<\/span>/g, (match, p1) => {
        let text = p1.trim().replace(/^[\[\(](.*?)[\]\)]$/, '$1');
        return `<span class="stage-direction"><i class="fa-solid fa-masks-theater"></i> ${text}</span>`;
    });
    html = html.replace(/<p class="action-text[^"]*">(.*?)<\/p>/g, (match, p1) => {
        let text = p1.trim().replace(/^[\[\(](.*?)[\]\)]$/, '$1');
        return `<div class="stage-direction block-direction"><i class="fa-solid fa-masks-theater"></i> ${text}</div>`;
    });
    html = html.replace(/<p><span class="stage-direction block-direction">/g, '<div class="stage-direction block-direction">');
    html = html.replace(/<\/div><\/p>/g, '</div>');

    // 5. Names, Targets, and Audio
    html = html.replace(/<div class="char-name">(.*?)<\/div>/g, (match, name) => {
        name = name.trim();
        if (name.includes(' &gt; ') || name.includes(' > ') || name.includes(' - ')) {
            const separator = name.includes(' &gt; ') ? ' &gt; ' : (name.includes(' > ') ? ' > ' : ' - ');
            let parts = name.split(separator);
            if (parts.length >= 2) {
                let main = parts[0].trim();
                let target = parts[1].trim();
                let tagClass = 'tag';
                let tLower = target.toLowerCase();
                if (tLower.includes('pai')) tagClass = 'char-target-tag t-pai';
                if (tLower.includes('mãe') || tLower.includes('me')) tagClass = 'char-target-tag t-mae';
                if (tLower.includes('filha')) tagClass = 'char-target-tag t-filha';
                else if (tLower.includes('filho')) tagClass = 'char-target-tag t-filho';
                else if (tLower.includes('espírito') || tLower.includes('espirito') || tLower.includes('esprito')) tagClass = 'char-target-tag t-espirito';
                return `<div class="char-header"><div class="char-main">${main} <span class="${tagClass}"><i class="fa-solid fa-chevron-right"></i> ${target}</span></div></div>`;
            }
        }
        if (name.includes('fa-microphone') || name.includes('NARRADOR')) {
            return `<div class="char-header narrador-header"><div class="char-main"><i class="fa-solid fa-microphone"></i> NARRADOR</div><button class="audio-tag" AUDIO_PLACEHOLDER><i class="fa-solid fa-play"></i> OUVIR ÁUDIO</button></div>`;
        }
        return `<div class="char-header"><div class="char-main">${name}</div></div>`;
    });

    let audioCount = 0;
    html = html.replace(/AUDIO_PLACEHOLDER/g, (match) => {
        audioCount++;
        if (audioCount === 1) return `onclick="toggleAudio('audios e trilhas/01-familia-intro-narração.mp3', this)"`;
        return `onclick="toggleAudio('audios e trilhas/02-familia-final-narração.mp3', this)"`;
    });

    // 6. Fix "Comentário" tags
    let comentCount = 0;
    html = html.replace(/<span class="tag">Coment.*?rio<\/span>/gi, (match) => {
        comentCount++;
        if (comentCount === 1) return '<span class="char-target-tag t-mae">COMENTÁRIO: MÃE</span>';
        if (comentCount === 2) return '<span class="char-target-tag t-pai">COMENTÁRIO: PAI</span>';
        if (comentCount === 3) return '<span class="char-target-tag t-filho">COMENTÁRIO: FILHO</span>';
        if (comentCount === 4) return '<span class="char-target-tag t-filha">COMENTÁRIO: FILHA</span>';
        return match;
    });

    // 7. Extract Final Narration safely
    html = html.replace(/<!-- PARTE FINAL -->[\s\S]*?<section class="scene-section expanded" id="scene-final"[\s\S]*?<\/section>/, '');
    let lastNarracaoIndex = html.lastIndexOf('<div class="dialogue-card c-narracao">');
    if (lastNarracaoIndex !== -1 && !html.includes('id="scene-final"')) {
        let before = html.substring(0, lastNarracaoIndex);
        let after = html.substring(lastNarracaoIndex);
        let fimIndex = after.indexOf('<h2 class="fim-title">');
        if (fimIndex !== -1) {
            let narrationContent = after.substring(0, fimIndex).trim();
            let newAfter = `
            </div>
        </section>

        <!-- PARTE FINAL -->
        <section class="scene-section expanded" id="scene-final" data-title="Narração Final">
            <div class="scene-header accordion-header" onclick="toggleScene(this)">
                <div class="scene-title-wrapper">
                    <h2 class="scene-title">Narração Final</h2>
                    <i class="fa-solid fa-chevron-down toggle-icon"></i>
                </div>
            </div>
            <div class="scene-content">
                ${narrationContent}
                <h2 class="fim-title">FIM</h2>
            </div>
        </section>
        
    </main>

    <script src="script.js"></script>
</body>
</html>`;
            html = before + newAfter;
        }
    }

    // 8. Fonts and Favicon
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;700;800&display=swap"/g, '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"');
    if (!html.includes('favicon.svg')) {
        html = html.replace('<link rel="stylesheet" href="style.css">', '<link rel="icon" type="image/svg+xml" href="favicon.svg">\n    <link rel="stylesheet" href="style.css">');
    }

    // 9. Add WhatsApp Meta Tags (Open Graph)
    const ogTags = `
    <meta property="og:title" content="O Inimigo no Meu Lar - Roteiro Teatral">
    <meta property="og:description" content="Roteiro completo da peça teatral 'O Inimigo no Meu Lar'. Uma experiência digital interativa com divisão por atos.">
    <meta property="og:image" content="https://alefyrezendesign.github.io/inimigo-do-meu-lar-teatro-ecd/simbol-encontro-horizontal-claro.png">
    <meta property="og:url" content="https://alefyrezendesign.github.io/inimigo-do-meu-lar-teatro-ecd/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
`;
    // Remove existing if present to prevent duplicates
    html = html.replace(/<meta property="og:[\s\S]*?<meta name="twitter:card" content="summary_large_image">/g, '');
    // Insert right before </head>
    html = html.replace(/<\/head>/, ogTags + '\n</head>');

    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Ultimate rebuild complete. Added OG Meta tags.");
} catch (e) {
    console.error(e);
}
