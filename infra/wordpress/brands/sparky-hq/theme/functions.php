<?php
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus([
        'primary' => __('Primary Menu', 'sparky-hq'),
    ]);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('hello-elementor-style', get_template_directory_uri() . '/style.css');
    $child_css = get_stylesheet_directory() . '/style.css';
    if (file_exists($child_css)) {
        wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', ['hello-elementor-style'], filemtime($child_css));
    }
}, 20);


