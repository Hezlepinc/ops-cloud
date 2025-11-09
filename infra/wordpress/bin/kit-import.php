<?php
// Run from WP app root. Requires Elementor Pro active.
// Usage: KIT_PATH=/path/to/kit.zip php infra/wordpress/bin/kit-import.php
// Also supports CLI arg: php infra/wordpress/bin/kit-import.php /path/to/kit.zip

chdir(getenv('APP_ROOT') ?: getcwd());
require_once __DIR__ . '/../../../wp-load.php';

$argvKit = isset($argv[1]) ? (string) $argv[1] : '';
$kit = getenv('KIT_PATH') ?: $argvKit;
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
	// If Kit_Importer is unavailable (common without Pro), try custom import from src structure
	$srcDir = null;
	$manifestPath = null;
	if (is_dir($kit)) {
		$srcDir = realpath($kit);
	} else {
		if (!class_exists('ZipArchive')) {
			throw new \RuntimeException('ZipArchive not available and no importer class found.');
		}
		$tmp = wp_upload_dir();
		$tmpBase = trailingslashit($tmp['basedir']) . 'oc_kit_tmp_' . wp_generate_password(8, false, false);
		if (!wp_mkdir_p($tmpBase)) {
			throw new \RuntimeException('Failed to create temp directory.');
		}
		$zip = new \ZipArchive();
		if ($zip->open($kit) !== true) {
			throw new \RuntimeException('Unable to open zip: ' . $kit);
		}
		$zip->extractTo($tmpBase);
		$zip->close();
		$srcDir = $tmpBase;
	}
	if (!$srcDir) {
		throw new \RuntimeException('No source directory available after extraction.');
	}
	// Locate manifest.json at root or within a single nested directory
	if (file_exists($srcDir . '/manifest.json')) {
		$manifestPath = $srcDir . '/manifest.json';
	} else {
		// Search one level deeper first; if multiple manifests, pick the first
		$candidates = glob($srcDir . '/*/manifest.json');
		if (!$candidates) {
			// Fallback: recursive search (first match)
			$rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($srcDir, \FilesystemIterator::SKIP_DOTS));
			foreach ($rii as $file) {
				if (strtolower($file->getFilename()) === 'manifest.json') {
					$manifestPath = $file->getPathname();
					break;
				}
			}
		} else {
			$manifestPath = $candidates[0];
		}
	}
	if (!$manifestPath || !file_exists($manifestPath)) {
		throw new \RuntimeException('manifest.json not found in kit.');
	}

	$manifest = json_decode(file_get_contents($manifestPath), true);
	if (!is_array($manifest)) {
		throw new \RuntimeException('Invalid manifest.json format.');
	}
	$baseDir = dirname($manifestPath);

	$elementorVersion = null;
	if (class_exists('\Elementor\Plugin')) {
		try {
			$elementorVersion = \Elementor\Plugin::$instance->get_version();
		} catch (\Throwable $e) {
			$elementorVersion = null;
		}
	}
	if (!$elementorVersion && !empty($manifest['elementor_version'])) {
		$elementorVersion = (string) $manifest['elementor_version'];
	}

	$templates = isset($manifest['templates']) && is_array($manifest['templates']) ? $manifest['templates'] : [];
	$importedCount = 0;
	foreach ($templates as $id => $meta) {
		$title = isset($meta['title']) ? (string) $meta['title'] : ('Template ' . $id);
		$docType = isset($meta['doc_type']) ? (string) $meta['doc_type'] : 'page';
		$conditions = isset($meta['conditions']) && is_array($meta['conditions']) ? $meta['conditions'] : [];
		$jsonPath = $baseDir . '/templates/' . $id . '.json';
		if (!file_exists($jsonPath)) {
			continue;
		}
		$data = json_decode(file_get_contents($jsonPath), true);
		if (!is_array($data)) {
			continue;
		}
		$content = isset($data['content']) ? $data['content'] : null;
		if ($content === null) {
			continue;
		}

		// Find existing template by exact title
		$existing = get_page_by_title($title, OBJECT, 'elementor_library');
		$postId = 0;
		if ($existing && $existing->post_type === 'elementor_library') {
			$postId = (int) $existing->ID;
			wp_update_post([
				'ID' => $postId,
				'post_title' => $title,
				'post_status' => 'publish',
			]);
		} else {
			$postId = wp_insert_post([
				'post_type' => 'elementor_library',
				'post_title' => $title,
				'post_status' => 'publish',
			]);
		}
		if (!$postId || is_wp_error($postId)) {
			continue;
		}

		// Assign template type via taxonomy if available
		if (taxonomy_exists('elementor_library_type')) {
			$term = $docType;
			if ($docType === 'single-post' || $docType === 'single-page' || $docType === 'single') {
				$term = 'single';
			}
			wp_set_object_terms($postId, $term, 'elementor_library_type', false);
		} else {
			update_post_meta($postId, '_elementor_template_type', $docType);
		}

		// Store Elementor data and meta
		update_post_meta($postId, '_elementor_data', wp_slash(wp_json_encode($content)));
		update_post_meta($postId, '_elementor_edit_mode', 'builder');
		if ($elementorVersion) {
			update_post_meta($postId, '_elementor_version', $elementorVersion);
		}

		// Apply display conditions if provided
		if (!empty($conditions)) {
			update_post_meta($postId, '_elementor_conditions', $conditions);
		}

		$importedCount++;
	}

	if ($importedCount > 0) {
		echo "Custom import complete (templates imported: {$importedCount})\n";
		exit(0);
	}

	throw new \RuntimeException('Elementor Kit importer class not found and no templates imported via custom path.');
} catch (\Throwable $e) {
    echo "Import failed: " . $e->getMessage() . "\n";
	exit(1);
}




