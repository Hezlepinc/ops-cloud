<?php
/**
 * Ops Base Theme
 */
if (!defined('ABSPATH')) exit;

add_action('after_setup_theme', function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('menus');
  // Elementor friendly
  add_theme_support('align-wide');
  add_theme_support('editor-styles');
});

add_action('wp_enqueue_scripts', function () {
  // Base CSS
  $style_path = get_stylesheet_directory() . '/style.css';
  wp_enqueue_style(
    'ops-base-style',
    get_stylesheet_directory_uri() . '/style.css',
    [],
    file_exists($style_path) ? filemtime($style_path) : null
  );
  // Optional: additional assets
  $extra = get_stylesheet_directory() . '/assets/css/base.css';
  if (file_exists($extra)) {
    wp_enqueue_style(
      'ops-base-extra',
      get_stylesheet_directory_uri() . '/assets/css/base.css',
      ['ops-base-style'],
      filemtime($extra)
    );
  }
}, 20);


