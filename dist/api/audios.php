<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Caminho base das pastas de áudio
$audioBasePath = realpath(__DIR__ . '/../audios');

$folders = [];
if ($audioBasePath && is_dir($audioBasePath)) {
    foreach (scandir($audioBasePath) as $folder) {
        if ($folder === '.' || $folder === '..') continue;
        if (is_dir($audioBasePath . '/' . $folder)) {
            $folders[] = $folder;
        }
    }
}
echo json_encode($folders);
exit;
