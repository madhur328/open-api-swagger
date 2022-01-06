<script>
  import ModelNavigation from "./ModelNavigation.svelte";
  export let tags;
  export let models;
  export let title;
  export let modelToggled;
  export let modelIndexToggle;
  export let opDataToggle;
  export let modal;
  let openSection = new Array(tags.length + 1).fill(false);
  import TagNavigation from "./TagNavigation.svelte";
</script>

<div class="nav-bar">
  <img class="logo" src="/icons/appLogo.svg" alt="" />
  <h2 class="section-title">{title}</h2>

  <h2 class="section-reference">Reference</h2>
  <TagNavigation {tags} bind:openSection bind:opDataToggle />
  <h2
    on:click={() => {
      if (openSection[openSection.length - 1]) {
        openSection[openSection.length - 1] = false;
        openSection.fill(false);
      } else {
        openSection.fill(false);
        openSection[openSection.length - 1] = true;
      }
    }}
    class="models"
  >
    Models
  </h2>
  {#if openSection[openSection.length - 1]}
    <ModelNavigation {models} bind:modelToggled bind:modelIndexToggle />
  {/if}
</div>

<style>
  .nav-bar {
    position: fixed;
    display: flex;
    flex-direction: column;
    padding: 40px 30px;
    font-family: "Roboto";
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 40px;
  }
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 30px;
  }
  .section-reference {
    font-size: 16px;
    font-weight: 500;
    color: #92959b;
  }
  .models {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
</style>
