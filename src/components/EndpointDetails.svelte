<script>
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  import ReferencedArraySummary from "./ReferencedArraySummary.svelte";
  import ModelExample from "./ModelExample.svelte";
  export let models;
  export let op;
  const findRef = (ref) => {
    let refArr = ref.split("/");
    return models.find((elem) => elem.name === refArr[refArr.length - 1]);
  };
</script>

<!-- <div class="opblock-body">
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
                            .items.type}]{/if}{#if "format" in parameter}<span
                            class="prop-format">(${parameter.format})</span
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
                                  <option value={option}>{option}</option>
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
                      <ModelExample schema={parameter.schema} {models} />
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
            <td class="col_header response-col_description">Description</td>
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
                                    op.responses[res_code].headers[header]
                                      .description
                                  )
                                )}
                              </div>
                            </td>
                            <td class="header-col"
                              >{op.responses[res_code].headers[header].type}</td
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
</div> -->
<div class="request-container">
  <h3>{op.operationId.replace(/([A-Z])/g, " $1").toLowerCase()}</h3>
  <hr />
  <div class="http_details">
    <span
      class:get={op.http_method === "get"}
      class:post={op.http_method === "post"}
      class:put={op.http_method === "put"}
      class:delete={op.http_method === "delete"}
      class:deprecated={op.deprecated}
      class="ui-pill"
      >{op.http_method}
    </span>
    <div class="http-path-url">
      <span class="base-url">{op.base_path}</span><span class="api-url"
        >{op.url}</span
      >
    </div>
  </div>
  <div class="request-block">
    <h3 class="request">Request</h3>
    <div class="request-attributes">
      <div class="attrib-table">
        {#if op.parameters.length === 0}
          <span class="no-params">No Parameters</span>
        {:else if op.parameters.find((elem) => elem.in !== "header") === undefined}
          <span class="no-params">No Parameters</span>
        {:else}
          <div class="attrib">Attribute</div>
          <div class="desc">Description</div>
          {#each op.parameters as param}
            {#if param.in !== "header"}
              <div class="attrib content">
                <div class="param__name">
                  {param.name}{#if param.required}<span>*</span>{/if}
                </div>
                <div class="param__type">
                  {#if "type" in param}
                    {param.type}
                    {#if param.type === "array"}
                      [{param.items.type}]
                    {/if}
                  {:else if "schema" in param}
                    {#if "type" in param.schema}
                      {param.schema.type}
                      {#if param.schema.type === "array"}
                        {#if "type" in param.schema.items}
                          [{param.schema.items.type}]
                        {:else if "$ref" in param.schema.items}
                          [{findRef(param.schema.items.$ref).type}]
                        {/if}
                      {/if}
                    {:else if "$ref" in param.schema}
                      {findRef(param.schema.$ref).type}
                      {#if findRef(param.schema.$ref).type === "array"}
                        [{findRef(param.schema.$ref).items.type}]
                      {/if}
                    {/if}
                  {/if}
                </div>
                <div class="param__in">({param.in})</div>
              </div>
            {/if}
            <div class="desc content">
              {#if "description" in param}
                <div class="markdown">
                  {@html DOMPurify.sanitize(marked.parse(param.description))}
                </div>
              {/if}
              {#if "type" in param}
                {#if param.type === "file"}
                  <input type="file" disabled />
                {:else if param.type === "string" || param.type === "integer"}
                  <input type="text" placeholder={param.name} disabled />
                {:else if param.type === "array"}
                  {#if "type" in param.items}
                    {#if param.items.type === "string"}
                      {#if "enum" in param.items}
                        <div class="parameter__enum markdown">
                          {param.items.enum.join("/")}
                        </div>
                        <select multiple disabled>
                          {#each param.items.enum as option}
                            <option value={option}>{option}</option>
                          {/each}
                        </select>
                      {/if}
                    {/if}
                  {:else if "$ref" in param.items}
                    <ReferencedArraySummary
                      prop={findRef(param.items.$ref)}
                      {models}
                    />
                  {/if}
                {/if}
              {:else if "schema" in param}
                <ModelExample schema={param.schema} {models} />
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
  <div class="try-block">
    <div class="info">
      <div class="prod">Production</div>
      <select class="raw">
        <option value="raw">Raw</option>
      </select>
    </div>
    <div><button class="try btn">Try</button></div>
  </div>
  <div class="header-block">
    <h3 class="header">Headers</h3>
    <div class="header-content">
      {#if op.parameters.find((elem) => elem.in === "header") === undefined}
        <span class="no-params">No Parameters</span>
      {:else}
        <div class="container-colored">
          {#each op.parameters as param, i}
            {#if param.in === "header"}
              <div class="param-content">
                <span class="param-name">{param.name}</span><span>: </span><span
                  class="param-type">{param.type}</span
                >
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div class="responses-block">
    <h3 class="response">Response</h3>
    <div class="response-codes">
      <div class="res-table">
        <div class="res-code">Code</div>
        <div class="res-desc">Description</div>
        {#each Object.keys(op.responses) as res_code}
          <div class="res-code content">{res_code}</div>
          <div class="res-desc content">
            <div class="markdown">
              {@html DOMPurify.sanitize(
                marked.parse(op.responses[res_code].description)
              )}
            </div>
            {#if "schema" in op.responses[res_code]}
              <ModelExample schema={op.responses[res_code].schema} {models} />
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
                                op.responses[res_code].headers[header]
                                  .description
                              )
                            )}
                          </div>
                        </td>
                        <td class="header-col"
                          >{op.responses[res_code].headers[header].type}</td
                        >
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .request-container .responses-block .response-codes .res-table {
    margin: 0 30px 30px 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .request-container .responses-block .response-codes .res-table .res-code {
    flex: 1;
    min-width: 30%;
    text-align: right;
    padding: 10px 20px 10px 0;
    border-bottom: 1px solid rgba(180, 185, 193, 0.2);
    font-size: 12px;
    color: #ffffff;
    font-family: "Roboto mono";
    font-weight: 200;
  }
  .request-container
    .responses-block
    .response-codes
    .res-table
    .res-code.content {
    font-size: 13px;
    color: #6d747d;
    font-weight: 400;
  }
  .request-container
    .responses-block
    .response-codes
    .res-table
    .res-desc.content {
    font-size: 13px;
  }
  .request-container
    .responses-block
    .response-codes
    .res-table
    .res-desc.content
    .markdown {
    color: #6d747d;
    font-weight: 400;
  }
  .request-container .responses-block .response-codes .res-table .res-desc {
    flex: 2;
    min-width: 60%;
    padding: 10px 0;
    border-bottom: 1px solid rgba(180, 185, 193, 0.2);
    font-size: 12px;
    color: #ffffff;
    font-family: "Roboto mono";
    font-weight: 200;
  }

  .request-container h3 {
    font-size: 20px;
    margin-left: 30px;
  }
  .request-container hr {
    opacity: 0.2;
    border-bottom: 1px solid #b4b9c1;
  }
  .request-container h3::first-letter {
    text-transform: uppercase;
  }
  .request-container .http_details {
    margin-left: 30px;
    display: flex;
  }
  .request-container .http_details .ui-pill {
    background-color: #272e32;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    min-width: 70px;
    padding: 4px 0;
    text-align: center;
    text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
    text-transform: uppercase;
    margin-right: 15px;
  }
  .request-container .http_details .ui-pill.get {
    color: #61affe;
  }
  .request-container .http_details .ui-pill.post {
    color: #49cc90;
  }
  .request-container .http_details .ui-pill.put {
    color: #fca130;
  }
  .request-container .http_details .ui-pill.delete {
    color: #f93e3e;
  }
  .request-container .http_details .ui-pill.deprecated {
    color: #ebebeb;
  }
  .request-container .http_details .http-path-url .base-url {
    font-size: 14px;
    color: #ffffff;
    font-family: "Roboto mono";
    font-weight: 200;
  }
  .request-container .http_details .http-path-url .api-url {
    font-size: 14px;
    color: white;
    font-family: "Roboto mono";
    font-weight: 400;
  }
  .request-container .request-block {
    margin-top: 50px;
  }
  .request-container .request-block .request,
  .request-container .header-block .header,
  .request-container .responses-block .response {
    font-size: 14px;
    font-weight: 400;
    font-family: "Roboto mono";
  }
  .request-container .request-block .request-attributes .attrib-table {
    margin: 0 30px 30px 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .request-container .no-params {
    font-family: "Roboto Mono";
    font-size: 14px;
    font-weight: 200;
    padding: 10px 0;
  }
  .request-container .request-block .request-attributes .attrib-table .attrib {
    flex: 1;
    min-width: 30%;
    text-align: right;
    padding: 10px 20px 10px 0;
    border-bottom: 1px solid rgba(180, 185, 193, 0.2);
    font-size: 12px;
    color: #ffffff;
    font-family: "Roboto mono";
    font-weight: 200;
  }
  .request-container
    .request-block
    .request-attributes
    .attrib-table
    .attrib.content {
    font-size: 13px;
  }
  .request-container
    .request-block
    .request-attributes
    .attrib-table
    .desc.content {
    font-size: 13px;
  }
  .request-container
    .request-block
    .request-attributes
    .attrib-table
    .attrib.content
    .param__in,
  .request-container
    .request-block
    .request-attributes
    .attrib-table
    .attrib.content
    .param__type,
  .request-container
    .request-block
    .request-attributes
    .attrib-table
    .desc.content
    .markdown {
    color: #6d747d;
    font-weight: 400;
  }
  .request-container .request-block .request-attributes .attrib-table .desc {
    flex: 2;
    min-width: 60%;
    padding: 10px 0;
    border-bottom: 1px solid rgba(180, 185, 193, 0.2);
    font-size: 12px;
    color: #ffffff;
    font-family: "Roboto mono";
    font-weight: 200;
  }
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
  .request-container .try-block {
    margin: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .request-container .try-block .info {
    display: flex;
    align-items: stretch;
  }
  .request-container .try-block .info .prod {
    background: #272e32;
    padding: 10px;
    margin-right: 20px;
  }
  .request-container .try-block .info .raw {
    border: none;
    background: #272e32 url("/icons/arrow-down-white.svg") right 10px center
      no-repeat;
    background-size: 10px;
    padding: 10px 40px 10px 20px;
    border-radius: unset;
    font-size: 16px;
    font-weight: 400;
    box-shadow: none;
    color: white;
  }
  .request-container .try-block .info .raw:focus-visible {
    outline: unset;
  }
  .request-container .try-block .try.btn {
    background: #2f343c;
    border: 1px solid #ffffff29;
    padding: 10px;
    color: white;
    margin: 0;
    cursor: pointer;
    transition: 0.3s ease;
  }
  .request-container .try-block .try.btn:hover {
    background-color: #ffffff29;
  }
  .request-container .header-block {
    margin-bottom: 30px;
  }
  .request-container .header-block .header-content {
    margin: 0 30px;
  }
  .request-container .header-block .header-content .container-colored {
    background-color: #272e32;
    padding: 15px;
  }
  .request-container .header-block .header-content .param-name {
    color: #5d86b2;
  }
  .request-container .header-block .header-content .param-type {
    color: #7eaa9a;
  }
  table {
    border-collapse: collapse;
    padding: 0 10px;
    width: 100%;
  }
  table thead tr th,
  table thead tr td {
    border-bottom: 1px solid rgba(59, 65, 81, 1);
    color: #6d747d;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 12px 0;
    text-align: left;
  }
  table tbody tr td {
    vertical-align: top;
    min-width: 6em;
    padding: 10px 0;
  }
  .param__name span {
    vertical-align: super;
    color: lightgrey;
  }

  input[type="file"],
  input[type="text"] {
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin: 5px 0;
    min-width: 200px;
    padding: 6px;
  }
  input[disabled] {
    background-color: #fafafa;
    color: #888;
    cursor: not-allowed;
  }
  .headers-wrapper .headers__title {
    color: #6d747d;
    font-family: sans-serif;
    font-size: 12px;
    margin: 10px 0 5px;
  }
  table.headers td {
    color: #6d747d;
    font-family: monospace;
    font-size: 12px;
    font-weight: 300;
    vertical-align: top;
  }
  table.headers td:last-child {
    color: white;
    font-family: "Roboto mono";
    font-weight: 200;
    font-size: 10px;
  }
</style>
