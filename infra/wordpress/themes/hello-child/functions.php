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
    // Enqueue brand token CSS
    $cursor_css = get_stylesheet_directory_uri() . '/assets/css/cursor.css';
    wp_enqueue_style('hello-child-cursor', $cursor_css, ['hello-child'], '1.0.0');
});

// One-time bootstrap on first activation
function hello_child_bootstrap_once() {
    if (get_option('hello_child_starter_done')) {
        return;
    }

    // Create Home page
    $home_id = wp_insert_post([
        'post_title' => 'Home',
        'post_content' => '<h1>Welcome</h1><p>Starter content created by Hello Child.</p>',
        'post_status' => 'publish',
        'post_type' => 'page',
    ]);

    // Sample Post
    wp_insert_post([
        'post_title' => 'Sample Post',
        'post_content' => 'This is an example post created automatically.',
        'post_status' => 'publish',
        'post_type' => 'post',
    ]);

    // Menu
    $menu_id = wp_create_nav_menu('Main Menu');
    if (!is_wp_error($menu_id)) {
        wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-title' => 'Home',
            'menu-item-object' => 'page',
            'menu-item-object-id' => $home_id,
            'menu-item-type' => 'post_type',
            'menu-item-status' => 'publish',
        ]);
        set_theme_mod('nav_menu_locations', ['menu-1' => $menu_id]);
    }

    update_option('show_on_front', 'page');
    update_option('page_on_front', $home_id);

    update_option('hello_child_starter_done', true);
}
add_action('after_switch_theme', 'hello_child_bootstrap_once');

// Add support for custom logo
add_theme_support('custom-logo');


