<?php
/**
 * Plugin Name: Hezlep Lockdown
 * Description: Locks design/admin areas for non-admins and configures Elementor role defaults.
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

/* Hard disable file editor in WP admin */
if (! defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}

/* Remove sensitive admin menus for non-admins */
add_action('admin_init', function () {
    if (! current_user_can('manage_options')) {
        remove_menu_page('themes.php');      // Appearance
        remove_menu_page('plugins.php');     // Plugins
        remove_menu_page('tools.php');       // Tools
        // hide Elementor main menu (keeps editor available if needed via Role Manager)
        remove_menu_page('elementor');
    }
});

/* Prevent access to sensitive capabilities for non-admins */
add_filter('map_meta_cap', function ($caps, $cap) {
    $blocked_caps = [
        'switch_themes', 'edit_theme_options', 'install_plugins',
        'activate_plugins', 'edit_plugins', 'edit_themes', 'update_core'
    ];
    if (in_array($cap, $blocked_caps, true) && ! current_user_can('manage_options')) {
        // add a capability that won't exist - prevents action
        $caps[] = 'do_not_allow';
    }
    return $caps;
}, 10, 2);

/* Ensure Elementor Role Manager default is "content" for editors (edit content only) */
add_action('init', function () {
    if (function_exists('get_option') && function_exists('update_option') && defined('ELEMENTOR_VERSION')) {
        $opt = get_option('elementor_role_manager', []);
        if (! isset($opt['editor']) || $opt['editor'] !== 'content') {
            $opt['editor'] = 'content';
            update_option('elementor_role_manager', $opt);
        }
    }
});


