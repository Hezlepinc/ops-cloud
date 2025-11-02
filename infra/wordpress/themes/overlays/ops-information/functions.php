<?php
if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function () {
  $style_path = get_stylesheet_directory() . '/style.css';
  wp_enqueue_style(
    'ops-information-style',
    get_stylesheet_directory_uri() . '/style.css',
    ['ops-base-style'],
    file_exists($style_path) ? filemtime($style_path) : null
  );
  $extra = get_stylesheet_directory() . '/assets/css/overlay.css';
  if (file_exists($extra)) {
    wp_enqueue_style(
      'ops-information-extra',
      get_stylesheet_directory_uri() . '/assets/css/overlay.css',
      ['ops-information-style'],
      filemtime($extra)
    );
  }
}, 30);


