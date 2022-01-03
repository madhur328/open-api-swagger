<script>
  export let tags;
  export let tagIndexToggled;
  let active_tab = new Array(tags.length).fill(false);
  active_tab[0] = true;
</script>

{#each tags as tag, i}
  <a
    on:click={() => {
      tagIndexToggled.fill(false);
      tagIndexToggled[i] = true;
    }}
    href={`#tag${i}`}
  >
    <h2
      on:click={() => {
        active_tab.fill(false);
        active_tab[i] = true;
      }}
      class:active={active_tab[i]}
      class:first={i === 0}
      class:last={i === active_tab.length - 1}
      class="tag-name"
    >
      {tag.name} Endpoints
    </h2>
  </a>
{/each}

<style>
  .tag-name {
    margin: 0;
    font-size: 15px;
    text-transform: capitalize;
    color: #959ba2;
    padding: 5px 5px 5px 0;
    cursor: pointer;
  }
  .tag-name::before {
    content: "";
    border-left: 1px solid rgba(149, 155, 162, 0.5);
    border-right: 1px solid rgba(149, 155, 162, 0.5);
    padding: 5px 0;
    margin-right: 10px;
  }
  .tag-name.active::before {
    border-left: 1px solid rgba(91, 160, 238, 0.8);
    border-right: 1px solid rgba(91, 160, 238, 0.8);
  }
  .tag-name.active {
    color: rgb(91, 160, 238);
  }
</style>
