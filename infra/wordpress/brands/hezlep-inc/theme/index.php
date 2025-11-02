<?php get_header(); ?>
<main class="c-container" style="padding: var(--space-7) 0;">
  <?php if (have_posts()) : while (have_posts()) : the_post(); the_content(); endwhile; else : ?>
    <h1>Welcome 👋</h1>
    <p>Your homepage isn’t created yet. Create a “Home” page in WP → Pages and set it as Front Page.</p>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
