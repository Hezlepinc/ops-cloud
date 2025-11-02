<?php
// Enqueue parent + Cursor tokens + optional site CSS
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('hello-elementor-style', get_template_directory_uri() . '/style.css', [], null);
    wp_enqueue_style('cursor-tokens', get_stylesheet_directory_uri() . '/assets/css/cursor.css', [], '0.1.0');
    $child_css = get_stylesheet_directory() . '/style.css';
    if (file_exists($child_css)) {
        wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', ['hello-elementor-style'], filemtime($child_css));
    }
    $site_css = get_stylesheet_directory() . '/assets/css/site.css';
    if (file_exists($site_css)) {
        wp_enqueue_style('hezlep-site', get_stylesheet_directory_uri() . '/assets/css/site.css', ['cursor-tokens'], '0.1.0');
    }
});

// Theme supports + menu
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus([
        'primary' => __('Primary Menu', 'hezlep-marketing'),
    ]);
});


