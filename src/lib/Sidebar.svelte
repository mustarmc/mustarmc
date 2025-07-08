<script>
  let sidebarItems = [
    {
      isGroup: false,
      href: '/',
      text: 'Főoldal'
    },
    {
      isGroup: true,
      text: 'Más kliensek',
      expanded: true,
      items: [
        { href: '/liquidbounce', text: 'LiquidBounce' },
      ]
    }
  ];

  function toggleGroup(group) {
    group.expanded = !group.expanded;
    sidebarItems = sidebarItems; 
  }
</script>

<aside class="fixed top-0 left-0 h-screen w-64 bg-gray-800 p-4 overflow-y-auto text-gray-300 flex flex-col">
  <h2 class="text-lg font-bold text-blue-400 mb-4">Tartalom</h2>
  <nav class="flex-grow">
    <ul>
      {#each sidebarItems as item}
        {#if item.isGroup}
          <li>
            <button on:click={() => toggleGroup(item)} class="w-full text-left flex justify-between items-center py-2 px-4 rounded hover:bg-gray-700 focus:outline-none">
              <span class="font-bold">{item.text}</span>
              <span>{item.expanded ? 'V' : '>'}</span>
            </button>
            {#if item.expanded}
              <ul class="pl-4 border-l-2 border-gray-600 ml-2">
                {#each item.items as subItem}
                  <li>
                    <a href={subItem.href} class="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                      {subItem.text}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {:else}
          <li>
            <a href={item.href} class="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
              {item.text}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
  <footer class="mt-4 pt-4 border-t border-gray-700 text-center">
    <a href="https://github.com/mustarmc/mustarmc" target="_blank" class="text-blue-400 hover:underline">github repo</a>
  </footer>
</aside>
