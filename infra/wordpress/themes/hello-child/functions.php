<?php
/**
 * Hello Child Theme Functions
 * (Minimal, clean, production-safe)
 */

add_action('wp_enqueue_scripts', function() {
    // Enqueue parent theme styles
    wp_enqueue_style('hello-elementor', get_template_directory_uri() . '/style.css');
    // Enqueue child theme styles
    wp_enqueue_style('hello-child', get_stylesheet_uri(), ['hello-elementor'], '1.0.0');
});

// Add support for custom logo
add_theme_support('custom-logo');


