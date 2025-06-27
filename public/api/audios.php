
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$id = $_GET["id"] ?? "";

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["error" => "Playlist ID is required"]);
    exit;
}

// Sanitize the playlist ID to prevent directory traversal
$sanitizedId = basename($id);
$basePath = __DIR__ . "/../audio/" . $sanitizedId;
$baseUrl = "/audio/" . $sanitizedId;

$files = [];

if (is_dir($basePath)) {
    $mp3Files = glob("$basePath/*.mp3");
    
    // Sort files naturally (handles numbers properly)
    natsort($mp3Files);
    
    foreach ($mp3Files as $file) {
        $filename = basename($file);
        $files[] = [
            "filename" => $filename,
            "url" => $baseUrl . "/" . rawurlencode($filename)
        ];
    }
} else {
    // Return empty array if directory doesn't exist
    // This is normal behavior - not all playlists may have audio files yet
}

echo json_encode($files);
?>
