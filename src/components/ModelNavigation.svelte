<script>
  export let model_keys;
  export let modelToggled;
  export let modelIndexToggle;
  export let models;
  let active_tab = new Array(model_keys.length).fill(false);
  active_tab[0] = true;
</script>

{#each model_keys as model_name, i}
  <a
    on:click={() => {
      modelToggled = true;
      modelIndexToggle.fill(false);
      modelIndexToggle[i] = true;
    }}
    href={`#model${i}`}
  >
    <h2
      on:click={() => {
        active_tab.fill(false);
        active_tab[i] = true;
      }}
      class="model-name"
      class:active={active_tab[i]}
      class:first={i === 0}
      class:last={i === active_tab.length - 1}
    >
      {model_name}
    </h2>
  </a>
{/each}

<style>
  .model-name {
    margin: 0;
    font-size: 15px;
    text-transform: capitalize;
    color: #959ba2;
    padding: 5px 5px 5px 0;
    cursor: pointer;
  }
  .model-name::before {
    content: "";
    border-left: 1px solid rgba(149, 155, 162, 0.5);
    border-right: 1px solid rgba(149, 155, 162, 0.5);
    padding: 5px 0;
    margin-right: 10px;
  }
  .model-name.active::before {
    border-left: 1px solid rgba(91, 160, 238, 0.8);
    border-right: 1px solid rgba(91, 160, 238, 0.8);
  }
  .active {
    color: rgb(91, 160, 238);
  }
</style>
