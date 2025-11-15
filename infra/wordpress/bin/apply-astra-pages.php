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

// Get brand from multiple sources (hybrid approach for reliability)
$brand = null;

// Method 1: Constant defined by wp eval (most reliable)
if (defined('BRAND_SLUG')) {
    $brand = BRAND_SLUG;
}

// Method 2: Environment variable (set by wp-bootstrap.sh)
if (!$brand) {
    $brand = getenv('BRAND_SLUG');
}

// Method 3: Command-line arguments via $_SERVER['argv']
// wp eval-file passes args: [0]='wp', [1]='eval-file', [2]=script_path, [3]=first_arg, [4]=--allow-root
if (!$brand && isset($_SERVER['argv']) && is_array($_SERVER['argv'])) {
    // Look for first non-flag argument after script path
    for ($i = 3; $i < count($_SERVER['argv']); $i++) {
        $arg = $_SERVER['argv'][$i];
        if ($arg && $arg[0] !== '-') {
            $brand = $arg;
            break;
        }
    }
}

// Method 4: $argv (if available in this context)
if (!$brand && isset($argv) && is_array($argv) && count($argv) > 1) {
    // Skip script name, get first arg
    $brand = $argv[1] ?? null;
}

if (!$brand) {
    WP_CLI::error('Brand slug required. Define BRAND_SLUG constant or set BRAND_SLUG environment variable.');
    WP_CLI::debug('BRAND_SLUG constant: ' . (defined('BRAND_SLUG') ? BRAND_SLUG : 'not defined'));
    WP_CLI::debug('BRAND_SLUG env: ' . (getenv('BRAND_SLUG') ?: 'not set'));
    WP_CLI::debug('$_SERVER[argv]: ' . print_r($_SERVER['argv'] ?? 'not set', true));
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
        // Clear post cache to ensure content is fresh
        clean_post_cache($pageId);
        WP_CLI::line("   • Updated page {$slug} (ID={$pageId})");
    } else {
        $result = wp_insert_post($postarr, true);
        if (is_wp_error($result)) {
            WP_CLI::warning("Failed to create page {$slug}: " . $result->get_error_message());
            continue;
        }
        $pageId = $result;
        // Clear post cache for new posts too
        clean_post_cache($pageId);
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


