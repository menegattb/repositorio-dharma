const fs = require('fs');
const path = require('path');

// Caminhos
const baseDir = path.join(__dirname, '..', 'public', 'repositorio');
const audioBase = path.join(baseDir, 'audios');
const metadataPath = path.join(baseDir, 'arquivos.json');

// Lê o JSON base ou cria um array vazio se não existir
let playlists = [];
if (!fs.existsSync(metadataPath)) {
  console.log('Arquivo arquivos.json não encontrado. Criando um novo...');
  // Cria o arquivo com array vazio
  fs.writeFileSync(metadataPath, JSON.stringify([], null, 2), 'utf8');
  console.log('Arquivo arquivos.json criado com sucesso!');
} else {
  // Lê o arquivo existente
  playlists = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
}

// Função para normalizar nomes (remove acentos, espaços, pontuação, caixa baixa)
function normalizeName(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais e espaços
    .toLowerCase();
}

const audioFolders = fs.readdirSync(audioBase).filter(f => fs.statSync(path.join(audioBase, f)).isDirectory());

// Adiciona ao JSON base todas as pastas novas encontradas em /audios
const now = new Date().toISOString();
audioFolders.forEach(folder => {
  // Já existe por id?
  let exists = playlists.some(p => p.id === folder);
  // Ou por title normalizado?
  if (!exists) {
    exists = playlists.some(p => normalizeName(p.title) === normalizeName(folder));
  }
  if (!exists) {
    playlists.push({
      id: folder,
      title: folder,
      description: '',
      publishedAt: now,
      itemCount: 0,
      files: []
    });
  }
});

// Para cada playlist, adiciona/atualiza a lista de arquivos MP3
playlists.forEach(playlist => {
  let files = [];
  let folderName = null;
  // 1. Tenta pelo id
  if (audioFolders.includes(playlist.id)) {
    folderName = playlist.id;
  } else {
    // 2. Tenta pelo title normalizado
    const normalizedTitle = normalizeName(playlist.title);
    folderName = audioFolders.find(folder => normalizeName(folder) === normalizedTitle);
  }
  if (folderName) {
    const playlistDir = path.join(audioBase, folderName);
    files = fs.readdirSync(playlistDir)
      .filter(f => f.toLowerCase().endsWith('.mp3'))
      .map(f => ({
        filename: f,
        url: `/repositorio/audios/${folderName}/${encodeURIComponent(f)}`
      }));
  }
  playlist.files = files;
  playlist.itemCount = files.length;
});

// Salva o novo JSON
fs.writeFileSync(metadataPath, JSON.stringify(playlists, null, 2), 'utf8');

let totalPlaylists = playlists.length;
let totalAudios = playlists.reduce((sum, p) => sum + (p.files ? p.files.length : 0), 0);

console.log(`arquivos.json atualizado com sucesso!`);
console.log(`Playlists processadas: ${totalPlaylists}`);
console.log(`Total de arquivos de áudio encontrados: ${totalAudios}`);
if (totalAudios === 0) {
  console.warn('Atenção: Nenhum arquivo de áudio encontrado nas playlists!');
}