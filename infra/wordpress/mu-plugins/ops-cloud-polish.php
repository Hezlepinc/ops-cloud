<?php
/**
 * Plugin Name: Ops Cloud Polish
 * Description: Shortcodes + styles to render placeholder corporate and informational layouts for Hezlep Inc and Sparky HQ.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function () {
    wp_register_style('oc-polish', plugin_dir_url(__FILE__) . 'oc-polish.css', [], '1.0.0');
    wp_enqueue_style('oc-polish');
});

function oc_esc($t){ return esc_html($t); }

function oc_card($title, $desc, $url='#', $tag=null) { ob_start(); ?>
    <a class="oc-card" href="<?php echo esc_url($url); ?>">
        <?php if($tag): ?><span class="oc-tag"><?php echo oc_esc($tag); ?></span><?php endif; ?>
        <h3><?php echo oc_esc($title); ?></h3>
        <p><?php echo oc_esc($desc); ?></p>
        <span class="oc-cta">Learn more →</span>
    </a>
<?php return ob_get_clean(); }

function oc_home_hezlep() { ob_start(); ?>
    <section class="oc-hero oc-hero--hezlep">
        <div class="oc-container">
            <h1>Hezlep Inc</h1>
            <p>Strategic consulting across cloud, automation, and AI systems.</p>
            <a class="oc-button" href="/contact">Contact Us</a>
        </div>
    </section>

    <section class="oc-section">
        <div class="oc-container">
            <h2>Services</h2>
            <div class="oc-grid-3">
                <?php echo oc_card('Cloud Strategy','Architecture, migration, and governance for modern cloud.','/services/cloud'); ?>
                <?php echo oc_card('DevOps Automation','CI/CD, infra-as-code, and platform engineering.','/services/devops'); ?>
                <?php echo oc_card('AI Integrations','Assistant orchestration and data pipelines.','/services/ai'); ?>
            </div>
        </div>
    </section>

    <section class="oc-section oc-section--alt">
        <div class="oc-container">
            <div class="oc-split">
                <div>
                    <h2>About Hezlep Inc</h2>
                    <p>We help organizations scale with clear strategy and reliable engineering. This is placeholder copy for staging.</p>
                    <a class="oc-link" href="/about">Read more →</a>
                </div>
            </div>
        </div>
    </section>
<?php return ob_get_clean(); }

function oc_home_sparky() { ob_start(); ?>
    <section class="oc-hero oc-hero--sparky">
        <div class="oc-container">
            <h1>Sparky HQ</h1>
            <p>Practical electrical knowledge for electricians and homeowners.</p>
            <a class="oc-button" href="/resources">Browse Resources</a>
        </div>
    </section>

    <section class="oc-section">
        <div class="oc-container">
            <h2>Topics</h2>
            <div class="oc-grid-3">
                <?php echo oc_card('Home Wiring Basics','Understand circuits, outlets, and grounding.','/topic/home-wiring'); ?>
                <?php echo oc_card('Electrical Safety','Best practices and common hazards.','/topic/safety'); ?>
                <?php echo oc_card('Lighting & Fixtures','Plan, select, and install lighting.','/topic/lighting'); ?>
                <?php echo oc_card('Energy Efficiency','Reduce consumption with smart upgrades.','/topic/efficiency'); ?>
                <?php echo oc_card('Panels & Breakers','Panels, breakers, and load calcs.','/topic/panels'); ?>
                <?php echo oc_card('DIY Troubleshooting','Diagnose common electrical issues.','/topic/troubleshooting'); ?>
            </div>
        </div>
    </section>

    <section class="oc-section oc-section--alt">
        <div class="oc-container">
            <h2>Tools</h2>
            <div class="oc-grid-3">
                <?php echo oc_card('Voltage Drop','Estimate voltage drop by run length & load.','/tools/voltage-drop','Calculator'); ?>
                <?php echo oc_card('Ampacity Derating','Adjust ampacity for temp and bundling.','/tools/ampacity-derating','Calculator'); ?>
                <?php echo oc_card('Conduit Fill','Check conductor count vs conduit size.','/tools/conduit-fill','Calculator'); ?>
            </div>
        </div>
    </section>
<?php return ob_get_clean(); }

add_shortcode('oc_home', function($atts){
    $site = isset($atts['site']) ? strtolower(sanitize_text_field($atts['site'])) : '';
    if ($site === 'hezlep') return oc_home_hezlep();
    if ($site === 'sparky') return oc_home_sparky();
    return '<!-- oc_home: unknown site -->';
});

add_shortcode('oc_about', function($atts){
    $atts = shortcode_atts([
        'company' => 'Hezlep Inc',
        'photo_url' => '',
        'heading' => 'About',
        'body' => 'Placeholder about copy for staging.'
    ], $atts);
    ob_start(); ?>
    <section class="oc-section">
        <div class="oc-container">
            <div class="oc-split">
                <div>
                    <h1><?php echo oc_esc($atts['heading']); ?></h1>
                    <p><?php echo oc_esc($atts['body']); ?></p>
                </div>
                <?php if (!empty($atts['photo_url'])): ?>
                    <div class="oc-photo">
                        <img src="<?php echo esc_url($atts['photo_url']); ?>" alt="<?php echo oc_esc($atts['company']); ?> portrait" />
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php return ob_get_clean();
});

