<script>
  import Sidebar from '$lib/Sidebar.svelte';
  import '../app.css';
</script>

<div class="relative flex min-h-screen">
  <Sidebar />
  <main class="flex-1 pl-64">
    <div class="p-8 mx-auto max-w-4xl">
      <slot />
    </div>
  </main>
</div>
