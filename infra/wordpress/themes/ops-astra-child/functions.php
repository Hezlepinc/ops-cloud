<?php
if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function () {
    // Parent theme CSS
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css', [], null);

    // Base tokens + shared components
    wp_enqueue_style(
        'ops-astra-base',
        get_stylesheet_directory_uri() . '/assets/css/base.css',
        ['parent-style'],
        filemtime(get_stylesheet_directory() . '/assets/css/base.css')
    );

    // Fonts (staging-safe)
    wp_enqueue_style(
        'ops-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600;700&display=swap',
        [],
        null
    );
}, 20);

add_filter('body_class', function($classes){
    $classes[] = 'ops-astra-child';
    return $classes;
});

