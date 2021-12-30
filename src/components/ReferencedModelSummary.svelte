<script>
  export let model;
  export let models;
  import ReferencedModelSummary from "./ReferencedModelSummary.svelte";
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
    <span class="model model-title">
      {model.name}
    </span>
    <span class="model-toggle">
      <img src="/icons/arrow-right.svg" alt="" class="icon" />
    </span>
    <span>{"{...}"}</span>
  </button>
{:else}
  <button
    on:click={() => {
      expanded = !expanded;
    }}
    class="model-box-control"
  >
    <span class="model model-title">
      {model.name}
    </span>
    <span class="model-toggle expanded">
      <img src="/icons/arrow-right.svg" alt="" class="icon" />
    </span>
  </button>
  <span class="brace-open object">{"{"}</span>
  <span class="inner-object">
    <table class="model">
      <tbody>
        {#each Object.keys(model.properties) as prop, j}
          <tr class="property-row">
            <td class="prop-name">{prop}</td>
            <td>
              <span class="model">
                {#if "$ref" in model.properties[prop]}
                  <ReferencedModelSummary
                    model={findRefModel(model.properties[prop]["$ref"])}
                    {models}
                  />
                {:else if "type" in model.properties[prop]}
                  <span class="prop">
                    <span class="prop-type">{model.properties[prop].type}</span>
                    {#if "format" in model.properties[prop]}
                      <span class="prop-format"
                        >(${model.properties[prop].format})</span
                      >
                    {/if}
                    {#if "example" in model.properties[prop]}
                      <span class="property primitive"
                        >example: {model.properties[prop].example}</span
                      >
                    {/if}
                  </span>
                {/if}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </span>
  <span class="brace-close">{"}"}</span>
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
  .model {
    color: #3b4151;
    font-family: monospace;
    font-size: 12px;
    font-weight: 300;
    font-weight: 600;
  }
  .model-title {
    color: #505050;
    font-family: sans-serif;
    font-size: 16px;
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
  table {
    border-collapse: collapse;
    padding: 0 10px;
    width: 100%;
  }
  .prop-type {
    color: #55a;
  }
  table.model tr.property-row td:first-child {
    padding-right: 0.2em;
  }
  table.model tbody tr td:first-of-type {
    padding: 0 0 0 2em;
    width: 174px;
  }
  table.model tbody tr td.prop-name {
    vertical-align: top;
  }
  .model .property.primitive {
    color: #6b6b6b;
  }
</style>
