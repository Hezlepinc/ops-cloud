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

// Get brand from command-line args (wp eval-file passes them after the script path)
// $argv[0] is script name, $argv[1] is first arg
$brand = null;
if (isset($argv) && count($argv) > 1) {
    $brand = $argv[1];
} elseif (function_exists('WP_CLI') && class_exists('WP_CLI')) {
    // Try to get from WP-CLI runner config
    $runner = WP_CLI::get_runner();
    if ($runner && isset($runner->config['argv']) && count($runner->config['argv']) > 1) {
        $brand = $runner->config['argv'][1];
    }
}

if (!$brand) {
    WP_CLI::warning('Brand slug required for apply-astra-pages.php. Usage: wp eval-file apply-astra-pages.php <brand-slug>');
    return;
}

$brand = sanitize_title($brand);
$brandRoot = realpath(__DIR__ . "/../brands/{$brand}");
if (!$brandRoot) {
    WP_CLI::warning("Brand directory not found for {$brand}");
    return;
}

$pagesDir = "{$brandRoot}/content/pages";
if (!is_dir($pagesDir)) {
    WP_CLI::warning("No content/pages directory for {$brand} ({$pagesDir})");
    return;
}

WP_CLI::line("▶ (PHP) Applying Astra pages for brand={$brand}");

$homeId = 0;
$files = glob($pagesDir . '/*.json');
sort($files);

foreach ($files as $file) {
    $slug = basename($file, '.json');
    $json = json_decode(file_get_contents($file), true);
    if (!is_array($json)) {
        WP_CLI::warning("Skipping {$slug}: invalid JSON");
        continue;
    }

    $title = $json['title'] ?? ucwords(str_replace('-', ' ', $slug));
    $content = $json['content'] ?? '';

    if (!$content && !empty($json['blocks']) && is_array($json['blocks'])) {
        // As a fallback, concatenate innerHTML values.
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


