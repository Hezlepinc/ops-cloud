<?php
if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function () {
  // Load after base
  $style_path = get_stylesheet_directory() . '/style.css';
  wp_enqueue_style(
    'ops-professional-style',
    get_stylesheet_directory_uri() . '/style.css',
    ['ops-base-style'],
    file_exists($style_path) ? filemtime($style_path) : null
  );
  $extra = get_stylesheet_directory() . '/assets/css/overlay.css';
  if (file_exists($extra)) {
    wp_enqueue_style(
      'ops-professional-extra',
      get_stylesheet_directory_uri() . '/assets/css/overlay.css',
      ['ops-professional-style'],
      filemtime($extra)
    );
  }
}, 30);


