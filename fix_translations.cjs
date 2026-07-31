const fs = require('fs');
const path = 'src/services/firstAidTranslations.ts';
let content = fs.readFileSync(path, 'utf8');

const languages = ['Kannada', 'Hindi', 'Tamil', 'Telugu'];

for (const lang of languages) {
  // We extract the mistakenly placed blocks from FIRST_AID_TRANSLATIONS
  // The block starts with "fa-cyclone" and ends before "labels: {"
  const blockRegex = new RegExp(`("${lang}":\\s*{|${lang}:\\s*{)([\\s\\S]*?)(labels: {)`);
  const match = blockRegex.exec(content);
  if (match) {
    const extractedContent = match[2];
    
    // Remove it from FIRST_AID_TRANSLATIONS
    content = content.replace(match[0], match[1] + match[3]);
    
    // Now inject it into FIRST_AID_GUIDES_TRANSLATIONS for the same language
    // Look for "FIRST_AID_GUIDES_TRANSLATIONS" then down to `${lang}: {`
    const insertRegex = new RegExp(`(export const FIRST_AID_GUIDES_TRANSLATIONS[\\s\\S]*?${lang}:\\s*{)`);
    const insertMatch = insertRegex.exec(content);
    
    if (insertMatch) {
      const startIndex = insertMatch.index + insertMatch[1].length;
      content = content.slice(0, startIndex) + extractedContent + content.slice(startIndex);
    }
  }
}

fs.writeFileSync(path, content);
console.log("Fixed translations.");
