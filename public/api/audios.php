
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$playlistId = $_GET["id"] ?? "";

if (empty($playlistId)) {
    http_response_code(400);
    echo json_encode(["error" => "Playlist ID is required"]);
    exit;
}

// Load playlist metadata to get the title
$metadataPath = __DIR__ . "/../playlists_metadata.json";
$playlistTitle = null;

if (file_exists($metadataPath)) {
    $metadataContent = file_get_contents($metadataPath);
    if ($metadataContent !== false) {
        $metadata = json_decode($metadataContent, true);
        if ($metadata !== null) {
            foreach ($metadata as $playlist) {
                if (isset($playlist['id']) && $playlist['id'] === $playlistId) {
                    $playlistTitle = $playlist['title'] ?? '';
                    break;
                }
            }
        }
    }
}

if (!$playlistTitle) {
    // Return empty array instead of error to not break the frontend
    echo json_encode([]);
    exit;
}

// Function to normalize folder name (remove special characters)
function normalizeFolderName($name) {
    // Remove special characters, keep only alphanumeric, spaces, hyphens, and underscores
    $normalized = preg_replace('/[^\w\s\-_]/u', '', $name);
    // Replace multiple spaces with single space and trim
    $normalized = preg_replace('/\s+/', ' ', trim($normalized));
    return $normalized;
}

// Look for folder that matches the playlist title (normalized)
$audioBasePath = __DIR__ . "/../audio";
$foundFolder = null;

if (is_dir($audioBasePath)) {
    $folders = scandir($audioBasePath);
    if ($folders !== false) {
        $normalizedTitle = normalizeFolderName($playlistTitle);
        
        foreach ($folders as $folder) {
            if ($folder === '.' || $folder === '..') continue;
            
            $folderPath = $audioBasePath . '/' . $folder;
            if (is_dir($folderPath)) {
                $normalizedFolder = normalizeFolderName($folder);
                if (strcasecmp($normalizedFolder, $normalizedTitle) === 0) {
                    $foundFolder = $folder;
                    break;
                }
            }
        }
    }
}

$files = [];

if ($foundFolder) {
    $basePath = $audioBasePath . '/' . $foundFolder;
    $baseUrl = "/audio/" . rawurlencode($foundFolder);
    
    $mp3Files = glob("$basePath/*.mp3");
    
    if ($mp3Files !== false) {
        // Sort files naturally (handles numbers properly)
        natsort($mp3Files);
        
        foreach ($mp3Files as $file) {
            $filename = basename($file);
            $files[] = [
                "filename" => $filename,
                "url" => $baseUrl . "/" . rawurlencode($filename)
            ];
        }
    }
}

echo json_encode($files);
?>
