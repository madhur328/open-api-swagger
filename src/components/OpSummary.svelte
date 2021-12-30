<script>
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  export let opData;
  export let references;
  let opDataToggle = [];
  for (let i = 0; i < opData.length; i++) {
    opDataToggle.push(false);
  }
  const dataToggle = (i) => {
    opDataToggle[i] = !opDataToggle[i];
  };
  const findRef = (ref) => {
    let refArr = ref.split("/");
    return references[refArr[refArr.length - 1]];
  };
</script>

<div class="operation-tag-content">
  {#each opData as op, i}
    <div
      class="opblock"
      class:opblock-deprecated={op.deprecated === true}
      class:opblock-post={!op.deprecated === true && op.http_method === "post"}
      class:opblock-get={!op.deprecated === true && op.http_method === "get"}
      class:opblock-put={!op.deprecated === true && op.http_method === "put"}
      class:opblock-delete={!op.deprecated === true &&
        op.http_method === "delete"}
    >
      <div class="opblock-summary">
        <button on:click={() => dataToggle(i)} class="opblock-summary-control">
          <span class="opblock-summary-method">{op.http_method}</span>
          <span
            class="opblock-summary-path"
            class:deprecated={op.deprecated === true}>{op.url}</span
          >
          <div class="opblock-summary-description">
            {op.summary}
          </div>
        </button>
        <button class="auth_btn">
          <img class="auth_unlocked" src="/icons/lock-open.svg" alt="" />
        </button>
      </div>
      {#if opDataToggle.length && opDataToggle[i]}
        <div class="opblock-body">
          {#if op.deprecated === true}
            <h4 class="opblock-title-deprecated">Warning: Deprecated</h4>
          {/if}
          {#if op.description}
            <div class="opblock-description-wrapper">{op.description}</div>
          {/if}
          <div class="parameter-block">
            <div class="parameter-block-header">
              <h4 class="opblock-title">Parameters</h4>
            </div>
            <div class="parameters-container">
              {#if op.parameters.length}
                <div class="table-container">
                  <table class="parameters">
                    <thead>
                      <tr>
                        <th class="parameters-col_name">Name</th>
                        <th class="parameters-col_description">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each op.parameters as parameter}
                        <tr>
                          <td class="parameters-col_name">
                            <div
                              class="parameter__name"
                              class:required={parameter.required}
                            >
                              {parameter.name}
                              {#if parameter.required}
                                <span>&nbsp;*</span>
                              {/if}
                            </div>
                            <div class="parameter__type">
                              {#if "type" in parameter}
                                {parameter.type}
                                {#if parameter.type === "array"}
                                  [{parameter.items.type}]
                                {/if}
                              {:else if "schema" in parameter}
                                {#if "type" in parameter.schema}
                                  {parameter.schema.type}
                                  {#if parameter.schema.type === "array"}
                                    {#if "type" in parameter.schema.items}
                                      [{parameter.schema.items.type}]
                                    {:else if "$ref" in parameter.schema.items}
                                      [{findRef(parameter.schema.items.$ref)
                                        .type}]
                                    {/if}
                                  {/if}
                                {:else if "$ref" in parameter.schema}
                                  {findRef(parameter.schema.$ref).type}
                                  {#if findRef(parameter.schema.$ref).type === "array"}
                                    [{findRef(parameter.schema.$ref).items
                                      .type}]
                                  {/if}
                                {/if}
                              {/if}
                              {#if parameter.type === "integer"}
                                <span class="prop-format"
                                  >(${parameter.format})</span
                                >
                              {/if}
                            </div>
                            <div class="parameter__deprecated" />
                            <div class="parameter__in">({parameter.in})</div>
                          </td>
                          <td class="parameters-col_description">
                            <div class="markdown">
                              {@html DOMPurify.sanitize(
                                marked.parse(parameter.description)
                              )}
                            </div>
                            {#if parameter.type === "file"}
                              <input type="file" disabled />
                            {:else if parameter.type === "string" || parameter.type === "integer"}
                              <input
                                type="text"
                                placeholder={parameter.name}
                                disabled
                              />
                            {/if}
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {:else}
                <div class="opblock-description-wrapper">
                  <p>No parameters</p>
                </div>
              {/if}
            </div>
          </div>
          <div class="responses-block" />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .opblock .opblock-summary-path,
  .opblock .opblock-summary-path.deprecated {
    align-items: center;
    color: #3b4151;
    display: flex;
    font-family: monospace;
    font-size: 16px;
    font-weight: 600;
    padding: 0 10px;
    word-break: break-word;
  }
  .opblock-title-deprecated {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 12px;
    margin: 0 0 5px;
    padding: 15px 20px;
  }
  .opblock .opblock-summary-path.deprecated {
    text-decoration: line-through;
  }
  .opblock .opblock-summary-description {
    color: #3b4151;
    flex: 1 1 auto;
    font-family: sans-serif;
    font-size: 13px;
    word-break: break-word;
  }
  .opblock-summary-control {
    all: inherit;
    border-bottom: 0;
    cursor: pointer;
    flex: 1;
    padding: 0;
  }
  .opblock-summary-control:focus {
    outline: auto;
  }
  .auth_btn {
    background: none;
    border: none;
    padding: 0 10px;
    cursor: pointer;
  }
  .auth_btn img.auth_unlocked {
    width: 20px;
    height: 20px;
    opacity: 0.4;
  }
  .opblock-summary-method {
    border-radius: 3px;
    color: #fff;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 700;
    min-width: 80px;
    padding: 6px 0;
    text-align: center;
    text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  .opblock.opblock-post .opblock-summary-method {
    background: #49cc90;
    text-transform: uppercase;
  }
  .opblock.opblock-put .opblock-summary-method {
    background: #fca130;
    text-transform: uppercase;
  }
  .opblock.opblock-get .opblock-summary-method {
    background: #61affe;
    text-transform: uppercase;
  }
  .opblock.opblock-deprecated .opblock-summary-method {
    background: #ebebeb;
    text-transform: uppercase;
  }
  .opblock.opblock-delete .opblock-summary-method {
    background: #f93e3e;
    text-transform: uppercase;
  }
  .opblock {
    border: 1px solid #000;
    border-radius: 4px;
    box-shadow: 0 0 3px rgb(0 0 0 / 19%);
    margin: 0 0 15px;
  }
  .opblock.opblock-deprecated {
    background: hsla(0, 0%, 92%, 0.1);
    border-color: #ebebeb;
    opacity: 0.6;
  }
  .opblock.opblock-get {
    background: rgba(97, 175, 254, 0.1);
    border-color: #61affe;
  }
  .opblock.opblock-post {
    background: rgba(73, 204, 144, 0.1);
    border-color: #49cc90;
  }
  .opblock.opblock-put {
    background: rgba(252, 161, 48, 0.1);
    border-color: #fca130;
  }
  .opblock.opblock-delete {
    background: rgba(249, 62, 62, 0.1);
    border-color: #f93e3e;
  }
  .opblock .opblock-summary {
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: 5px;
  }
  .opblock-description-wrapper {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 14px;
    margin: 0 0 5px;
    padding: 15px 20px;
  }
  .parameter-block .parameter-block-header {
    align-items: center;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    display: flex;
    min-height: 50px;
    padding: 8px 20px;
  }
  .opblock .parameter-block-header .opblock-title {
    color: #3b4151;
    flex: 1;
    font-family: sans-serif;
    font-size: 14px;
    margin: 0;
  }
  .table-container {
    padding: 20px;
  }
  table {
    border-collapse: collapse;
    padding: 0 10px;
    width: 100%;
  }
  table thead tr th {
    border-bottom: 1px solid rgba(59, 65, 81, 0.2);
    color: #3b4151;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 12px 0;
    text-align: left;
  }
  table tbody tr td:first-of-type {
    min-width: 6em;
    padding: 10px 0;
  }
  .parameters-col_description {
    margin-bottom: 2em;
    width: 99%;
  }
  .parameter__name {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: 400;
    margin-right: 0.75em;
    display: flex;
  }
  .parameter__name.required {
    font-weight: 700;
  }
  .parameter__name.required span {
    color: red;
  }
  .parameter__name.required:after {
    color: rgba(255, 0, 0, 0.6);
    content: "required";
    font-size: 10px;
    padding: 5px;
    position: relative;
    top: -6px;
  }
  .parameter__type {
    color: #3b4151;
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 0;
  }
  .parameter__in {
    color: gray;
    font-family: monospace;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
  }
  input[type="file"],
  input[type="text"],
  input[type="password"],
  input[type="email"],
  input[type="search"] {
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin: 5px 0;
    min-width: 100px;
    padding: 8px 10px;
  }
  .parameters-col_description input[type="text"] {
    max-width: 340px;
    width: 100%;
  }
  input[disabled] {
    background-color: #fafafa;
    color: #888;
    cursor: not-allowed;
  }
</style>
