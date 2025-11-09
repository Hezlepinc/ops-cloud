<?php
// Run from WP app root. Requires Elementor Pro active.
// Usage: KIT_PATH=/path/to/kit.zip php infra/wordpress/bin/kit-import.php

chdir(getenv('APP_ROOT') ?: getcwd());
require_once __DIR__ . '/../../../wp-load.php';

$kit = getenv('KIT_PATH') ?: '';
if (!$kit || !file_exists($kit)) {
    echo "Kit not found: {$kit}\n";
	exit(1);
}

echo "Importing kit via PHP: {$kit}\n";
try {
	// Elementor Pro must be active. Try known importer classes across versions.
	if (class_exists('\Elementor\Import_Export\Kit_Importer')) {
		$imp = new \Elementor\Import_Export\Kit_Importer();
		$imp->import_kit($kit);
		echo "Kit import complete\n";
		exit(0);
	}
	// Alternate namespaces observed across Elementor versions.
	if (class_exists('\Elementor\Modules\ImportExport\Kit\Importer')) {
		$imp = new \Elementor\Modules\ImportExport\Kit\Importer();
		$imp->import_kit($kit);
		echo "Kit import complete\n";
		exit(0);
	}
	throw new \RuntimeException('Elementor Kit importer class not found.');
} catch (\Throwable $e) {
    echo "Import failed: " . $e->getMessage() . "\n";
	exit(1);
}




