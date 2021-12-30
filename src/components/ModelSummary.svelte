<script>
  import ReferencedModelSummary from "./ReferencedModelSummary.svelte";
  import ReferencedArraySummary from "./ReferencedArraySummary.svelte";
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  export let models;
  let modelIndexToggle = [];
  for (let i = 0; i < models.length; i++) {
    modelIndexToggle.push(false);
  }
  const dataToggle = (i) => {
    modelIndexToggle[i] = !modelIndexToggle[i];
  };
  const findRefModel = (ref) => {
    let refArr = ref.split("/");
    return models.find((elem) => elem.name === refArr[refArr.length - 1]);
  };
</script>

{#each models as model, i}
  <div class="model-container">
    <span class="model-box">
      {#if modelIndexToggle.length && modelIndexToggle[i]}
        <div class="model-box">
          <button on:click={() => dataToggle(i)} class="model-box-control">
            <span class="model model-title">{model.name}</span>
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
                    <td class="prop-name">
                      {prop}{#if "required" in model && model.required.includes(prop)}<span
                          class="star">*</span
                        >{/if}
                    </td>
                    <td>
                      <span class="model">
                        {#if "$ref" in model.properties[prop]}
                          <ReferencedModelSummary
                            model={findRefModel(model.properties[prop]["$ref"])}
                            {models}
                          />
                        {:else if "type" in model.properties[prop]}
                          {#if model.properties[prop].type === "array"}
                            <ReferencedArraySummary
                              prop={model.properties[prop]}
                              {models}
                            />
                          {:else}
                            <span class="prop">
                              <span class="prop-type"
                                >{model.properties[prop].type}</span
                              >{#if "format" in model.properties[prop]}<span
                                  class="prop-format"
                                  >(${model.properties[prop].format})</span
                                >{/if}
                              {#if "example" in model.properties[prop]}
                                <span class="property primitive">
                                  <br />
                                  example: {model.properties[prop].example}
                                </span>
                              {/if}
                            </span>
                            {#if "description" in model.properties[prop]}
                              <div class="markdown">
                                {@html DOMPurify.sanitize(
                                  marked.parse(
                                    model.properties[prop].description
                                  )
                                )}
                              </div>
                            {/if}
                            {#if "enum" in model.properties[prop]}
                              <span class="prop-enum">
                                Enum:
                                <br />
                                <ReferencedArraySummary
                                  prop={model.properties[prop]}
                                  {models}
                                />
                              </span>
                            {/if}
                          {/if}
                        {/if}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </span>
          <span class="brace-close">{"}"}</span>
        </div>
      {:else}
        <button on:click={() => dataToggle(i)} class="model-box-control">
          <span class="model-box">
            <span class="model model-title">{model.name}</span>
          </span>
          <span class="model-toggle">
            <img src="/icons/arrow-right.svg" alt="" class="icon" />
          </span>
        </button>
      {/if}
    </span>
  </div>
{/each}

<style>
  .model-container:first-of-type {
    margin: 20px;
  }
  .model-container {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin: 0 20px 15px;
    position: relative;
    transition: all 0.5s;
  }
  .model-box {
    border-radius: 4px;
    display: inline-block;
    padding: 10px;
  }
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
  table.model tr.property-row .star {
    color: red;
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
