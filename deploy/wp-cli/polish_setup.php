<?php
// Usage: wp eval-file deploy/wp-cli/polish_setup.php hezlep
//     or: wp eval-file deploy/wp-cli/polish_setup.php sparky
if (!defined('WPINC')) { echo "Run via wp eval-file\n"; return; }

$site = isset($args[0]) ? strtolower(sanitize_text_field($args[0])) : '';
if (!in_array($site, ['hezlep','sparky'])) { echo "Provide site arg: hezlep|sparky\n"; return; }

function oc_upsert_page($slug, $title, $content='') {
    $page = get_page_by_path($slug);
    if ($page && $page->ID) {
        wp_update_post(['ID'=>$page->ID,'post_title'=>$title,'post_content'=>$content,'post_status'=>'publish']);
        return (int)$page->ID;
    }
    return (int)wp_insert_post([
        'post_type'=>'page','post_name'=>$slug,'post_title'=>$title,
        'post_content'=>$content,'post_status'=>'publish'
    ]);
}

function oc_ensure_menu($name, $location, $items) {
    $menu = wp_get_nav_menu_object($name);
    $menu_id = $menu ? $menu->term_id : wp_create_nav_menu($name);

    // Reset all items
    $existing = wp_get_nav_menu_items($menu_id);
    if ($existing) foreach ($existing as $i) wp_delete_post($i->ID, true);

    foreach ($items as $it) {
        wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-title' => $it['title'],
            'menu-item-url'   => home_url($it['url']),
            'menu-item-status'=> 'publish'
        ]);
    }
    $locs = get_theme_mod('nav_menu_locations', []);
    $locs[$location] = $menu_id;
    set_theme_mod('nav_menu_locations', $locs);
}

if ($site === 'hezlep') {
    $home = oc_upsert_page('home','Home','[oc_home site="hezlep"]');
    oc_upsert_page('about','About','[oc_about company="Hezlep Inc" heading="About Hezlep Inc" body="This is placeholder about copy. Upload your photo, then update this section."]');
    oc_upsert_page('services','Services','Placeholder services content.');
    oc_upsert_page('resources','Resources','Coming soon.');
    oc_upsert_page('tools','Tools','Coming soon.');
    oc_upsert_page('contact','Contact','Contact form placeholder.');

    update_option('show_on_front','page');
    update_option('page_on_front',$home);

    oc_ensure_menu('Primary','primary',[
        ['title'=>'Home','url'=>'/'],
        ['title'=>'About','url'=>'/about'],
        ['title'=>'Services','url'=>'/services'],
        ['title'=>'Resources','url'=>'/resources'],
        ['title'=>'Tools','url'=>'/tools'],
        ['title'=>'Contact','url'=>'/contact'],
    ]);
}

if ($site === 'sparky') {
    $home = oc_upsert_page('home','Home','[oc_home site="sparky"]');
    oc_upsert_page('resources','Resources','Blog/resources listing placeholder.');
    oc_upsert_page('tools','Tools','Tools index – coming soon.');
    oc_upsert_page('contact','Contact','Contact form placeholder.');

    // Tool detail placeholders
    oc_upsert_page('voltage-drop','Voltage Drop','Calculator placeholder.');
    oc_upsert_page('ampacity-derating','Ampacity Derating','Calculator placeholder.');
    oc_upsert_page('conduit-fill','Conduit Fill','Calculator placeholder.');

    update_option('show_on_front','page');
    update_option('page_on_front',$home);

    oc_ensure_menu('Primary','primary',[
        ['title'=>'Home','url'=>'/'],
        ['title'=>'Resources','url'=>'/resources'],
        ['title'=>'Tools','url'=>'/tools'],
        ['title'=>'Contact','url'=>'/contact'],
    ]);
}

echo "OK\n";

