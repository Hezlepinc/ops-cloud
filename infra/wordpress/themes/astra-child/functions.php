<?php
/**
 * Ops Astra Child Theme functions
 *
 * This theme is intentionally thin: it delegates layout to Astra and styling to
 * theme.json + assets/css/cursor.css (generated from brand tokens).
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue parent/child styles and token CSS.
 */
add_action('wp_enqueue_scripts', function () {
    // Parent Astra styles.
    $parent = 'astra-theme-css';
    wp_enqueue_style($parent, get_template_directory_uri() . '/style.css', [], null);

    // Child theme base styles.
    wp_enqueue_style(
        'ops-astra-child',
        get_stylesheet_uri(),
        [$parent],
        wp_get_theme()->get('Version')
    );

    // Brand token utilities (generated). Optional: only enqueue if present.
    $tokens_css = get_stylesheet_directory() . '/assets/css/cursor.css';
    if (file_exists($tokens_css)) {
        wp_enqueue_style(
            'ops-astra-tokens',
            get_stylesheet_directory_uri() . '/assets/css/cursor.css',
            ['ops-astra-child'],
            filemtime($tokens_css)
        );
    }
});

/**
 * Register block template parts and patterns directory.
 */
add_action('after_setup_theme', function () {
    // Ensure support for block template parts (Gutenberg).
    add_theme_support('block-template-parts');

    // Register a generic patterns directory; brand-specific patterns are
    // assembled into this theme at deploy time.
    register_block_pattern_category('ops-brand', [
        'label' => __('Ops Brand Patterns', 'ops-astra-child'),
    ]);
});


