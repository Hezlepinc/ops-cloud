<?php
if (!defined('WPINC')) { echo "Run with: wp eval-file\n"; return; }
$mods = get_option('astra-settings', []);
$mods = is_array($mods) ? $mods : [];
$mods['sticky-header-on'] = 1;
$mods['sticky-header-on-devices'] = 'desktop';
$mods['footer-layout'] = 4; // 3 columns (Astra numeric layout)
update_option('astra-settings', $mods);
echo "Astra mods patched.\n";

