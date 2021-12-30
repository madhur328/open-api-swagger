<script>
  import ReferencedModelSummary from "./ReferencedModelSummary.svelte";
  export let models;
  export let prop;
  let expanded = false;
  const findRefModel = (ref) => {
    let refArr = ref.split("/");
    return models.find((elem) => elem.name === refArr[refArr.length - 1]);
  };
</script>

{#if !expanded}
  <button
    on:click={() => {
      expanded = !expanded;
    }}
    class="model-box-control"
  >
    <span class="model-toggle">
      <img class="icon" src="/icons/arrow-right.svg" alt="" />
    </span>
    {#if "enum" in prop}
      <span>Array [ {prop.enum.length} ]</span>
    {:else}
      <span>[...]</span>
    {/if}
  </button>
{:else}
  <button
    on:click={() => {
      expanded = !expanded;
    }}
    class="model-box-control"
  >
    <span class="model-toggle expanded">
      <img class="icon" src="/icons/arrow-right.svg" alt="" />
    </span>
  </button>
  {#if "enum" in prop}
    <span>
      [
      {#each prop.enum as elem, i}
        {#if i !== 0}
          ,&nbsp;
        {/if}
        {elem}
      {/each}
      ]
    </span>
  {:else}
    <span>[</span>
    {#if "xml" in prop}
      <span class="property">
        <br />
        xml: OrderedMap&nbsp;
        {JSON.stringify(prop.xml)}
      </span>
    {/if}
    {#if "$ref" in prop.items}
      <span
        ><br /><ReferencedModelSummary
          model={findRefModel(prop.items.$ref)}
          {models}
        /></span
      >
    {:else if "type" in prop.items}
      <span class="prop-type"><br />{prop.items.type}</span>
      {#if "xml" in prop.items}
        <span class="property primitive">
          <br />
          xml: OrderedMap&nbsp;
          {JSON.stringify(prop.items.xml)}
        </span>
      {/if}
    {/if}
    <span>]</span>
  {/if}
{/if}

<style>
  .model-box-control {
    display: inline-flex;
    background: none;
    border: none;
    border-bottom: 0;
    cursor: pointer;
    flex: 1;
    padding: 0;
    margin: 0;
    justify-content: center;
    align-items: center;
  }
  .model-box-control:focus {
    outline: auto;
  }
  .model-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .model-toggle img.icon {
    height: 20px;
    width: 20px;
  }
  .model-toggle.expanded img.icon {
    transform: rotate(90deg);
  }
  .property {
    color: #999;
    font-style: italic;
  }
  .property.primitive {
    color: #6b6b6b;
  }
  .prop-type {
    color: #55a;
  }
</style>
