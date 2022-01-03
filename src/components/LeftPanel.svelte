<script>
  import ModelNavigation from "./ModelNavigation.svelte";
  export let docJson;
  export let tagIndexToggled;
  export let modelToggled;
  export let modelIndexToggle;
  import TagNavigation from "./TagNavigation.svelte";
</script>

<div class="nav-bar">
  <img class="logo" src="/icons/appLogo.svg" alt="" />
  <h2 class="section-title">{docJson.info.title}</h2>

  <h2 class="section-reference">Reference</h2>
  <TagNavigation tags={docJson.tags} bind:tagIndexToggled />
  <h2 class="models">Models</h2>
  <ModelNavigation
    model_keys={Object.keys(docJson.definitions)}
    models={docJson.definitions}
    bind:modelToggled
    bind:modelIndexToggle
  />
</div>

<style>
  .nav-bar {
    display: flex;
    flex-direction: column;
    padding: 40px 30px;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 40px;
  }
  .section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  .section-reference {
    font-size: 16px;
    font-weight: 600;
  }
  .models {
    font-size: 16px;
  }
</style>
