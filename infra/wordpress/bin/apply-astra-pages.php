<?php
/**
 * Apply Astra pages for a given brand by reading JSON definitions in the repo.
 *
 * Usage (from wp-bootstrap.sh):
 *   wp eval-file infra/wordpress/bin/apply-astra-pages.php hezlep-inc
 */

if (!defined('ABSPATH')) {
    exit;
}

// Get brand from environment variable (set by wp-bootstrap.sh)
$brand = getenv('BRAND_SLUG');

// Fallback: try command-line args if env var not set
if (!$brand) {
    // Try $_SERVER['argv'] - wp eval-file passes args here
    if (isset($_SERVER['argv']) && is_array($_SERVER['argv']) && count($_SERVER['argv']) > 2) {
        // $_SERVER['argv'][0] = 'wp', [1] = 'eval-file', [2] = script path, [3] = first arg
        $brand = $_SERVER['argv'][3] ?? null;
    }
    // Try $argv as fallback
    if (!$brand && isset($argv) && is_array($argv) && count($argv) > 1) {
        $brand = $argv[1];
    }
}

if (!$brand) {
    WP_CLI::error('Brand slug required. Set BRAND_SLUG environment variable or pass as argument.');
    return;
}

$brand = sanitize_title($brand);
$brandRoot = realpath(__DIR__ . "/../brands/{$brand}");
if (!$brandRoot) {
    WP_CLI::warning("Brand directory not found for {$brand}");
    return;
}

// Support both preferred and current structures (hybrid)
$preferredPagesDir = "{$brandRoot}/pages"; // Preferred: pages/ at root
$currentPagesDir = "{$brandRoot}/content/pages"; // Current: content/pages/

// Use preferred if exists, fall back to current
$pagesDir = is_dir($preferredPagesDir) ? $preferredPagesDir : $currentPagesDir;
if (!is_dir($pagesDir)) {
    WP_CLI::warning("No pages directory found for {$brand}. Checked:");
    WP_CLI::warning("  - {$preferredPagesDir}");
    WP_CLI::warning("  - {$currentPagesDir}");
    return;
}

WP_CLI::line("▶ (PHP) Applying Astra pages for brand={$brand}");

$homeId = 0;

// Collect files from both formats (hybrid support)
$files = [];
// Preferred: HTML files
$htmlFiles = glob($pagesDir . '/*.html');
foreach ($htmlFiles as $file) {
    $files[] = ['path' => $file, 'format' => 'html'];
}
// Current: JSON files (only if not already found as HTML)
$jsonFiles = glob("{$brandRoot}/content/pages/*.json");
foreach ($jsonFiles as $file) {
    $slug = basename($file, '.json');
    $htmlFile = "{$pagesDir}/{$slug}.html";
    // Only add JSON if HTML doesn't exist (prefer HTML)
    if (!file_exists($htmlFile)) {
        $files[] = ['path' => $file, 'format' => 'json'];
    }
}

sort($files);

foreach ($files as $fileInfo) {
    $file = $fileInfo['path'];
    $format = $fileInfo['format'];
    $slug = basename($file, $format === 'html' ? '.html' : '.json');
    
    $title = ucwords(str_replace('-', ' ', $slug));
    $content = '';
    
    if ($format === 'html') {
        // Preferred: Read HTML directly
        $content = file_get_contents($file);
        if (!$content) {
            WP_CLI::warning("Skipping {$slug}: empty HTML file");
            continue;
        }
    } else {
        // Current: Read JSON
        $json = json_decode(file_get_contents($file), true);
        if (!is_array($json)) {
            WP_CLI::warning("Skipping {$slug}: invalid JSON");
            continue;
        }
        $title = $json['title'] ?? $title;
        $content = $json['content'] ?? '';
    }

    // Fallback: if JSON format has blocks array, extract innerHTML
    if (!$content && $format === 'json' && isset($json) && !empty($json['blocks']) && is_array($json['blocks'])) {
        $contentPieces = [];
        foreach ($json['blocks'] as $block) {
            if (!empty($block['innerHTML'])) {
                $contentPieces[] = $block['innerHTML'];
            }
        }
        $content = implode("\n\n", $contentPieces);
    }

    if (!$content) {
        $content = "<h1>{$title}</h1><p>This is a placeholder page for {$brand} ({$slug}).</p>";
    }

    $existing = get_page_by_path($slug, OBJECT, 'page');
    $postarr = [
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => $content,
    ];

    if ($existing) {
        $postarr['ID'] = $existing->ID;
        $result = wp_update_post($postarr, true);
        if (is_wp_error($result)) {
            WP_CLI::warning("Failed to update page {$slug}: " . $result->get_error_message());
            continue;
        }
        $pageId = $existing->ID;
        WP_CLI::line("   • Updated page {$slug} (ID={$pageId})");
    } else {
        $result = wp_insert_post($postarr, true);
        if (is_wp_error($result)) {
            WP_CLI::warning("Failed to create page {$slug}: " . $result->get_error_message());
            continue;
        }
        $pageId = $result;
        WP_CLI::line("   • Created page {$slug} (ID={$pageId})");
    }

    if ($slug === 'home') {
        $homeId = $pageId;
    }
}

if ($homeId) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $homeId);
    WP_CLI::line("▶ (PHP) Set front page to ID={$homeId}");
} else {
    WP_CLI::warning("No home page generated for {$brand}");
}


