<?php
/**
 * Plugin Name: Hezlep Lockdown
 * Description: Locks design/admin for non-admin; enforces safer defaults; staging noindex; Elementor editors = content-only.
 * Version: 1.1.0
 */

if (!defined('ABSPATH')) exit;

if (!defined('DISALLOW_FILE_EDIT')) define('DISALLOW_FILE_EDIT', true);
if (!defined('FORCE_SSL_ADMIN'))   define('FORCE_SSL_ADMIN', true);

// Disable XML-RPC (most installs don’t need it)
add_filter('xmlrpc_enabled', '__return_false');

// Hide menus for non-admins
add_action('admin_init', function () {
  if (!current_user_can('manage_options')) {
    remove_menu_page('themes.php');
    remove_menu_page('plugins.php');
    remove_menu_page('tools.php');
    remove_menu_page('elementor'); // Elementor admin menu
  }
});

// Block sensitive caps for non-admins
add_filter('map_meta_cap', function ($caps, $cap) {
  $blocked = ['switch_themes','edit_theme_options','install_plugins','activate_plugins','edit_plugins','edit_themes','update_core'];
  if (in_array($cap, $blocked, true) && !current_user_can('manage_options')) $caps[] = 'do_not_allow';
  return $caps;
}, 10, 2);

// Elementor Role Manager: Editors = content-only
add_action('init', function () {
  if (defined('ELEMENTOR_VERSION')) {
    $opt = get_option('elementor_role_manager', []);
    if (!isset($opt['editor']) || $opt['editor'] !== 'content') {
      $opt['editor'] = 'content';
      update_option('elementor_role_manager', $opt);
    }
  }
});


