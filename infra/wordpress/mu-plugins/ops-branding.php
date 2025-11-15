<?php
/**
 * Plugin Name: Ops Branding Loader
 * Description: Per-site brand palette (CSS variables) for Astra universal header/footer.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;

function ops_brand_slug() {
    if (defined('OPS_BRAND') && OPS_BRAND) return OPS_BRAND; // optional override via wp-config
    $host = isset($_SERVER['HTTP_HOST']) ? strtolower($_SERVER['HTTP_HOST']) : parse_url(home_url(), PHP_URL_HOST);
    if (strpos($host,'hezlep') !== false) return 'hezlep';
    if (strpos($host,'sparky') !== false) return 'sparky';
    return 'default';
}

add_action('wp_enqueue_scripts', function(){
    $brand = ops_brand_slug();
    $dir = WP_CONTENT_DIR . '/ops/brands';
    $url = content_url('ops/brands');
    $path = "$dir/$brand.css";

    if (file_exists($path)) {
        wp_enqueue_style("ops-brand-$brand", "$url/$brand.css", ['ops-astra-base'], filemtime($path));
    }

    // Safety inline to ensure header/footer picks variables even if enqueue order shifts
    $css = "
      .ast-primary-header-bar,.ast-above-header{background:var(--header-bg,var(--brand-primary));color:var(--header-fg,#fff);}
      .ast-desktop .main-header-menu .menu-link{color:var(--header-fg,#fff);}
      .ast-desktop .main-header-menu .menu-link:hover{color:var(--brand-accent,#66ccff);}
      .site-footer{background:var(--footer-bg,#0b1727);color:var(--footer-fg,#cbd5e1);}
      .site-footer a{color:var(--footer-fg,#cbd5e1);}
    ";
    wp_add_inline_style("ops-brand-$brand", $css);
}, 30);

add_filter('body_class', function($classes){
    $classes[] = 'ops-brand-'.ops_brand_slug();
    return $classes;
});

