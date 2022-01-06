<script>
  import TagUrlNavigation from "./TagUrlNavigation.svelte";
  export let tags;
  export let openSection;
  export let opDataToggle;
  let active_tab = new Array(tags.length).fill(false);
  active_tab[0] = true;
</script>

{#each tags as tag, i}
  <a href={`#tag${i}`}>
    <h2
      on:click={() => {
        if (openSection[i]) {
          openSection[i] = false;
          openSection.fill(false);
        } else {
          openSection.fill(false);
          openSection[i] = true;
        }
      }}
      class="tags"
    >
      {tag.name} Endpoints
    </h2>
  </a>
  {#if openSection[i]}
    <TagUrlNavigation opData={tag.opData} bind:opDataToggle tagIndex={i} />
  {/if}
{/each}

<style>
  .tags {
    text-transform: capitalize;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: #333;
  }
</style>
