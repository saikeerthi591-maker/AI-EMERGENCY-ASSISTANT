const fs = require('fs');
const path = 'src/services/firstAidTranslations.ts';
let content = fs.readFileSync(path, 'utf8');

const additions = {
  English: {
    Cyclone: "🌪️ Cyclone",
    Fire: "🔥 Fire",
    Landslide: "⛰️ Landslide"
  },
  Kannada: {
    Cyclone: "🌪️ ಚಂಡಮಾರುತ",
    Fire: "🔥 ಬೆಂಕಿ",
    Landslide: "⛰️ ಭೂಕುಸಿತ"
  },
  Hindi: {
    Cyclone: "🌪️ चक्रवात",
    Fire: "🔥 आग",
    Landslide: "⛰️ भूस्खलन"
  },
  Tamil: {
    Cyclone: "🌪️ சூறாவளி",
    Fire: "🔥 தீ",
    Landslide: "⛰️ நிலச்சரிவு"
  },
  Telugu: {
    Cyclone: "🌪️ తుఫాను",
    Fire: "🔥 అగ్ని",
    Landslide: "⛰️ కొండచరియలు"
  }
};

for (const [lang, appendObj] of Object.entries(additions)) {
  const blockRegex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?categoryNames:\\s*{)([\\s\\S]*?)(},)`);
  const match = blockRegex.exec(content);
  if (match) {
    let toAppend = '';
    for (const [key, val] of Object.entries(appendObj)) {
      toAppend += `\n      ${key}: "${val}",`;
    }
    content = content.replace(match[0], match[1] + match[2].trimEnd() + toAppend + '\n    ' + match[3]);
  }
}

fs.writeFileSync(path, content);
console.log("Category names patched.");
