<?php
/**
 * Ops Cloud - Diagnostics REST endpoint
 *
 * Exposes live status for the current WordPress site so external tools
 * (Cursor, orchestrator, etc.) can see what is deployed in real time.
 *
 * Route:
 *   GET /wp-json/ops/v1/status
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('ops/v1', '/status', [
        'methods'             => 'GET',
        'callback'            => 'ops_cloud_status_endpoint',
        // Read-only, safe to expose; tighten later if needed.
        'permission_callback' => '__return_true',
    ]);
});

/**
 * REST callback for /ops/v1/status.
 *
 * @return WP_REST_Response
 */
function ops_cloud_status_endpoint() {
    // Active theme info
    $theme      = wp_get_theme();
    $activeSlug = $theme->get_stylesheet();

    // All themes (slug + name)
    $themes      = wp_get_themes();
    $themesBrief = [];
    foreach ($themes as $slug => $t) {
        $themesBrief[] = [
            'slug'        => $slug,
            'name'        => $t->get('Name'),
            'version'     => $t->get('Version'),
            'is_active'   => $slug === $activeSlug,
            'template'    => $t->get_template(),
            'stylesheet'  => $t->get_stylesheet(),
        ];
    }

    // Plugins (requires admin plugin helpers)
    if (!function_exists('get_plugins')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $allPlugins    = function_exists('get_plugins') ? get_plugins() : [];
    $activePlugins = get_option('active_plugins', []);

    $pluginsBrief = [];
    foreach ($allPlugins as $file => $data) {
        $pluginsBrief[] = [
            'file'      => $file,
            'name'      => isset($data['Name']) ? $data['Name'] : $file,
            'version'   => isset($data['Version']) ? $data['Version'] : '',
            'is_active' => in_array($file, $activePlugins, true),
        ];
    }

    // Pages summary
    $pagesRaw = get_posts([
        'post_type'      => 'page',
        'posts_per_page' => 100,
        'post_status'    => ['publish', 'draft'],
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ]);

    $frontId  = (int) get_option('page_on_front');
    $pages    = [];
    foreach ($pagesRaw as $p) {
        $pages[] = [
            'id'        => (int) $p->ID,
            'title'     => get_the_title($p),
            'slug'      => $p->post_name,
            'status'    => $p->post_status,
            'is_front'  => (int) $p->ID === $frontId,
            'permalink' => get_permalink($p),
        ];
    }

    $data = [
        'site' => [
            'home_url'   => home_url('/'),
            'site_url'   => site_url('/'),
            'environment'=> defined('WP_ENV') ? WP_ENV : null,
        ],
        'theme' => [
            'active' => [
                'slug'       => $activeSlug,
                'name'       => $theme->get('Name'),
                'version'    => $theme->get('Version'),
                'template'   => $theme->get_template(),
                'stylesheet' => $theme->get_stylesheet(),
            ],
            'all' => $themesBrief,
        ],
        'plugins' => $pluginsBrief,
        'pages'   => $pages,
    ];

    return rest_ensure_response($data);
}


