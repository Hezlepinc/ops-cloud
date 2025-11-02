<?php
/**
 * Plugin Name: Hezlep Lockdown
 * Description: Locks design and admin areas for non-admins across all sites.
 */
if (!defined('ABSPATH')) exit;

if (!defined('DISALLOW_FILE_EDIT')) define('DISALLOW_FILE_EDIT', true);

add_action('admin_init', function () {
  if (!current_user_can('manage_options')) {
    remove_menu_page('themes.php');
    remove_menu_page('plugins.php');
    remove_menu_page('tools.php');
    remove_menu_page('elementor');
  }
});

/** block sensitive caps for non-admins */
add_filter('map_meta_cap', function ($caps, $cap) {
  $block = ['switch_themes','edit_theme_options','install_plugins','activate_plugins','edit_plugins','edit_themes'];
  if (in_array($cap, $block, true) && !current_user_can('manage_options')) $caps[] = 'do_not_allow';
  return $caps;
}, 10, 1);

/** Elementor Role Manager default: editors = content-only */
add_action('init', function () {
  $opt = get_option('elementor_role_manager', []);
  if (!isset($opt['editor'])) {
    $opt['editor'] = 'content'; // 'content' = edit content only; 'no_access' = block
    update_option('elementor_role_manager', $opt);
  }
});


