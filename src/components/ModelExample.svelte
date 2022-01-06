<script>
  import ReferencedModelSummary from "./ReferencedModelSummary.svelte";
  import ReferencedArraySummary from "./ReferencedArraySummary.svelte";
  import populate_model from "../utils/populate_model.js";
  import json_highlighter from "../utils/json_highlighter.js";
  export let schema;
  export let models;
  let active = "example";
  const findRef = (ref) => {
    let refArr = ref.split("/");
    return models.find((elem) => elem.name === refArr[refArr.length - 1]);
  };
</script>

<div class="model-example">
  <ul class="tab">
    <li class="tabitem" class:active={active === "example"}>
      <button
        on:click={() => {
          active = "example";
        }}
        class="tablinks">Example Value</button
      >
    </li>
    <li class="tabitem" class:active={active === "model"}>
      <button
        on:click={() => {
          active = "model";
        }}
        class="tablinks">Model</button
      >
    </li>
  </ul>
  {#if active === "example"}
    <div class="highlight-code">
      {#if "$ref" in schema}
        <pre><code class="language-json"
            >{@html json_highlighter(
              JSON.stringify(
                populate_model(findRef(schema.$ref), models),
                null,
                "  "
              )
            )}</code
          ></pre>
      {:else if "type" in schema}
        {#if schema.type === "object"}
          <pre><code class="language-json"
              >{@html json_highlighter(
                JSON.stringify(populate_model(schema, models), null, "  ")
              )}</code
            ></pre>
        {:else if schema.type === "array"}
          {#if "type" in schema.items}
            {#if schema.items.type === "object"}
              <pre><code class="language-json"
                  >{@html json_highlighter(
                    JSON.stringify(
                      [populate_model(schema.items, models)],
                      null,
                      "  "
                    )
                  )}</code
                ></pre>
            {:else}
              <pre><code class="language-json"
                  >{@html json_highlighter(
                    JSON.stringify([schema.items.type])
                  )}</code
                ></pre>
            {/if}
          {:else if "$ref" in schema.items}
            <pre><code class="language-json"
                >{@html json_highlighter(
                  JSON.stringify(
                    [populate_model(findRef(schema.items.$ref), models)],
                    null,
                    "  "
                  )
                )}</code
              ></pre>
          {/if}
        {:else}
          <pre><code class="language-json"
              >{@html json_highlighter(JSON.stringify(schema.type))}</code
            ></pre>
        {/if}
      {/if}
    </div>
  {:else if active === "model"}
    <div class="model-box">
      {#if "$ref" in schema}
        <ReferencedModelSummary
          model={findRef(schema.$ref)}
          {models}
          expanded={true}
        />
      {:else if "type" in schema}
        {#if schema.type === "object"}
          <ReferencedModelSummary model={schema} {models} expanded={true} />
        {:else if schema.type === "array"}
          {#if "type" in schema.items}
            {#if schema.items.type === "object"}
              <ReferencedArraySummary
                prop={schema.items}
                {models}
                expanded={true}
                showXml={false}
              />
            {:else}
              [<span>{schema.items.type}<br /></span>]
            {/if}
          {:else if "$ref" in schema.items}
            <ReferencedArraySummary
              prop={findRef(schema.items.$ref)}
              {models}
              expanded={true}
              showXml={false}
            />
          {/if}
        {:else}
          <span class="prop-type">{schema.type}</span>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .model-example {
    margin-top: 1em;
  }
  .tab {
    display: flex;
    list-style: none;
    padding: 0;
  }
  .tab li.active {
    font-weight: 700;
  }
  .tab li {
    cursor: pointer;
    font-family: sans-serif;
    font-size: 12px;
    min-width: 60px;
    padding: 0;
  }
  .tab li:first-of-type {
    padding-left: 0;
    padding-right: 12px;
    position: relative;
  }
  .tab li button.tablinks {
    cursor: pointer;
    background: none;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-weight: inherit;
    padding: 0;
  }
  .tab li:first-of-type:after {
    background: rgba(255, 255, 255, 0.2);
    content: "";
    height: 100%;
    position: absolute;
    right: 6px;
    top: -1px;
    width: 1px;
  }
  .model-box {
    background: rgb(211, 218, 225);
    min-height: 6em;
    width: 100%;
    display: inline-block;
    padding: 0.5em;
  }
  .highlight-code {
    display: block;
    overflow-x: auto;
    min-height: 6em;
    padding: 0.5em;
    background: #272e32;
    color: white;
  }
  .prop-type {
    color: #55a;
  }
</style>
