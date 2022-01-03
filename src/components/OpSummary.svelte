<script>
  import ReferencedArraySummary from "./ReferencedArraySummary.svelte";
  import ModelExample from "./ModelExample.svelte";
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  export let opData;
  export let models;
  let opDataToggle = new Array(opData.length).fill(false);
  const dataToggle = (i) => {
    opDataToggle[i] = !opDataToggle[i];
  };
  const findRef = (ref) => {
    let refArr = ref.split("/");
    return models.find((elem) => elem.name === refArr[refArr.length - 1]);
  };
</script>

<div class="operation-tag-content">
  {#each opData as op, i}
    <div
      class="opblock"
      class:is-open={opDataToggle[i]}
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
          <img
            class="icon svelte-1aw6qgd"
            class:expanded={opDataToggle[i]}
            src="/icons/arrow-down.svg"
            alt=""
          />
        </button>
        {#if "security" in op}
          <button class="auth_btn">
            <img class="auth_unlocked" src="/icons/lock-open.svg" alt="" />
          </button>
        {/if}
      </div>
      {#if opDataToggle[i]}
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
                              {#if "type" in parameter}{parameter.type}{#if parameter.type === "array"}[{parameter
                                    .items
                                    .type}]{/if}{#if "format" in parameter}<span
                                    class="prop-format"
                                    >(${parameter.format})</span
                                  >{/if}{:else if "schema" in parameter}{#if "type" in parameter.schema}{parameter
                                    .schema
                                    .type}{#if parameter.schema.type === "array"}{#if "type" in parameter.schema.items}[{parameter
                                        .schema.items.type}]
                                    {:else if "$ref" in parameter.schema.items}[{findRef(
                                        parameter.schema.items.$ref
                                      ).type}]{/if}{/if}
                                {:else if "$ref" in parameter.schema}{findRef(
                                    parameter.schema.$ref
                                  )
                                    .type}{#if findRef(parameter.schema.$ref).type === "array"}[{findRef(
                                      parameter.schema.$ref
                                    ).items.type}]{/if}{/if}
                              {/if}
                            </div>
                            <div class="parameter__deprecated" />
                            <div class="parameter__in">({parameter.in})</div>
                          </td>
                          <td class="parameters-col_description">
                            {#if "description" in parameter}
                              <div class="markdown">
                                {@html DOMPurify.sanitize(
                                  marked.parse(parameter.description)
                                )}
                              </div>
                            {/if}
                            {#if "type" in parameter}
                              {#if parameter.type === "file"}
                                <input type="file" disabled />
                              {:else if parameter.type === "string" || parameter.type === "integer"}
                                <input
                                  type="text"
                                  placeholder={parameter.name}
                                  disabled
                                />
                              {:else if parameter.type === "array"}
                                {#if "type" in parameter.items}
                                  {#if parameter.items.type === "string"}
                                    {#if "enum" in parameter.items}
                                      <div class="parameter__enum markdown">
                                        <p>
                                          <i>Available values</i> : {parameter.items.enum.join(
                                            ", "
                                          )}
                                        </p>
                                      </div>
                                      <select multiple disabled>
                                        {#each parameter.items.enum as option}
                                          <option value={option}
                                            >{option}</option
                                          >
                                        {/each}
                                      </select>
                                    {/if}
                                  {/if}
                                {:else if "$ref" in parameter.items}
                                  <ReferencedArraySummary
                                    prop={findRef(parameter.items.$ref)}
                                    {models}
                                  />
                                {/if}
                              {/if}
                            {:else if "schema" in parameter}
                              <ModelExample
                                schema={parameter.schema}
                                {models}
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
          <div class="responses-block">
            <div class="responses-block-header">
              <h4>Responses</h4>
              <label
                for={`${op.http_method}${op.url.replace(
                  /([/{}])/g,
                  "_"
                )}_responsed_select`}
              >
                <span>Response content type</span>
                <select
                  id={`${op.http_method}${op.url.replace(
                    /([/{}])/g,
                    "_"
                  )}_responsed_select`}
                >
                  {#each op.produces as res_type}
                    <option value={res_type}>{res_type}</option>
                  {/each}
                </select>
              </label>
            </div>
            <div class="responses-container">
              <table class="responses-table">
                <thead>
                  <tr class="responses-header">
                    <td class="col_header response-col_status">Code</td>
                    <td class="col_header response-col_description"
                      >Description</td
                    >
                  </tr>
                </thead>
                <tbody>
                  {#each Object.keys(op.responses) as res_code}
                    <tr class="response">
                      <td class="response-col_status">{res_code}</td>
                      <td class="response-col_description">
                        {#if "description" in op.responses[res_code]}
                          <div class="markdown">
                            {@html DOMPurify.sanitize(
                              marked.parse(op.responses[res_code].description)
                            )}
                          </div>
                        {/if}
                        {#if "schema" in op.responses[res_code]}
                          <ModelExample
                            schema={op.responses[res_code].schema}
                            {models}
                          />
                        {/if}
                        {#if "headers" in op.responses[res_code]}
                          <div class="headers-wrapper">
                            <h4 class="headers__title">Headers:</h4>
                            <table class="headers">
                              <thead>
                                <tr class="header-row">
                                  <th class="header-col">Name</th>
                                  <th class="header-col">Description</th>
                                  <th class="header-col">Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each Object.keys(op.responses[res_code].headers) as header}
                                  <tr>
                                    <td class="header-col">{header}</td>
                                    <td class="header-col">
                                      <div class="markdown">
                                        {@html DOMPurify.sanitize(
                                          marked.parse(
                                            op.responses[res_code].headers[
                                              header
                                            ].description
                                          )
                                        )}
                                      </div>
                                    </td>
                                    <td class="header-col"
                                      >{op.responses[res_code].headers[header]
                                        .type}</td
                                    >
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #f7f7f7 url("/icons/arrow-down.svg") right 10px center no-repeat;
    background-size: 20px;
    border: 2px solid #41444e;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 25%);
    color: #3b4151;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 5px 40px 5px 10px;
    margin: 0;
  }
  select[multiple] {
    background: #f7f7f7;
    margin: 5px 0;
    padding: 5px;
  }
  select[disabled] {
    border-color: #888;
    background-color: #fafafa;
    color: #888;
    cursor: not-allowed;
  }
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
    display: flex;
    background: none;
    border: none;
    padding: 0 10px;
    cursor: pointer;
    margin: 0;
  }
  .auth_btn img.auth_unlocked {
    width: 20px;
    height: 20px;
    opacity: 0.4;
    transform: rotateY(180deg);
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
    display: flex;
    padding: 5px;
  }
  .opblock.is-open .opblock-summary {
    border-bottom: 1px solid #000;
  }
  .opblock.opblock-deprecated .opblock-summary {
    border-color: #ebebeb;
  }
  .opblock.opblock-get .opblock-summary {
    border-color: #61affe;
  }
  .opblock.opblock-post .opblock-summary {
    border-color: #49cc90;
  }
  .opblock.opblock-put .opblock-summary {
    border-color: #fca130;
  }
  .opblock.opblock-delete .opblock-summary {
    border-color: #f93e3e;
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
  table thead tr th,
  table thead tr td {
    border-bottom: 1px solid rgba(59, 65, 81, 0.2);
    color: #3b4151;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 12px 0;
    text-align: left;
  }
  table tbody tr td:first-of-type {
    vertical-align: top;
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
  input[type="text"] {
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
  .parameters-col_description select {
    border-width: 1px;
  }
  input[disabled] {
    background-color: #fafafa;
    color: #888;
    cursor: not-allowed;
  }
  .responses-block-header {
    align-items: center;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    display: flex;
    min-height: 50px;
    padding: 8px 20px;
  }
  .responses-block-header h4 {
    color: #3b4151;
    flex: 1;
    font-family: sans-serif;
    font-size: 14px;
    margin: 0;
  }
  .responses-block-header > label {
    align-items: center;
    color: #3b4151;
    display: flex;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
    margin: 0 0 0 auto;
  }
  .responses-block-header > label > span {
    padding: 0 10px 0 0;
  }
  .opblock-body select {
    min-width: 230px;
  }
  .responses-container {
    padding: 20px;
  }
  .response-col_status {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 14px;
  }
  .response-col_description {
    width: 99%;
  }
  .headers-wrapper .headers__title {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 12px;
    margin: 10px 0 5px;
  }
  table.headers td {
    color: #3b4151;
    font-family: monospace;
    font-size: 12px;
    font-weight: 300;
    font-weight: 600;
    vertical-align: middle;
  }
  .icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    transition: all 0.4s;
  }
  .icon.expanded {
    transform: rotate(180deg);
  }
</style>
