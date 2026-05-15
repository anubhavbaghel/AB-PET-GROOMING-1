const fs = require('fs');
const path = require('path');
const exts = ['.png', '.jpg', '.jpeg', '.webp'];

function walk(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

const root = 'public/assets';
const deleted = [];
for(const f of walk(root)){
  const ext = path.extname(f).toLowerCase();
  if(exts.includes(ext)){
    const av = path.join(path.dirname(f), path.basename(f, ext) + '.avif');
    if(fs.existsSync(av)){
      try{
        fs.unlinkSync(f);
        deleted.push(f);
        console.log('Deleted:', f);
      }catch(e){
        console.error('Error deleting', f, e.message);
      }
    }
  }
}
if(deleted.length) fs.writeFileSync(path.join('tools','deleted-images-public.txt'), deleted.join('\n'));
console.log('Done. Deleted', deleted.length, 'files.');
