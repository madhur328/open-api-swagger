<script>
  import ReferencedArraySummary from "./ReferencedArraySummary.svelte";
  import EndpointDetails from "./EndpointDetails.svelte";
  import ModelExample from "./ModelExample.svelte";
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  export let opData;
  export let models;
  export let tagIndex;
  export let opDataToggle;
  export let modal;
  opDataToggle[tagIndex] = new Array(opData.length).fill(false);
  const modalShow = (i) => {
    opDataToggle[tagIndex].fill(false);
    opDataToggle[tagIndex][i] = true;
    modal.modalShow(EndpointDetails, { models, op: opData[i] });
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
      class:is-open={opDataToggle[tagIndex][i]}
      class:opblock-deprecated={op.deprecated === true}
      class:opblock-post={!op.deprecated === true && op.http_method === "post"}
      class:opblock-get={!op.deprecated === true && op.http_method === "get"}
      class:opblock-put={!op.deprecated === true && op.http_method === "put"}
      class:opblock-delete={!op.deprecated === true &&
        op.http_method === "delete"}
    >
      <div id={`tag${tagIndex}op${i}`} class="opblock-summary">
        <button on:click={() => modalShow(i)} class="opblock-summary-control">
          <div>
            <div class="opblock-opName">
              {op.operationId.replace(/([A-Z])/g, " $1").toLowerCase()}
            </div>
            <span class="opblock-summary-method">{op.http_method}</span>
          </div>
          <img
            class="icon"
            class:expanded={opDataToggle[tagIndex][i]}
            src="/icons/chevron-right.svg"
            alt=""
          />
        </button>
      </div>
    </div>
    {#if opDataToggle[tagIndex][i]}
      <div class="op-description">
        {op.summary}
        {@html DOMPurify.sanitize(marked.parse(op.description))}
      </div>
    {/if}
  {/each}
</div>

<style>
  .operation-tag-content {
    margin-bottom: 40px;
  }
  .opblock .opblock-opName {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: 500;
    padding: 0 10px;
    word-break: break-word;
  }
  .opblock .opblock-opName::first-letter {
    text-transform: uppercase;
  }
  .opblock-summary-control {
    all: inherit;
    border-bottom: 0;
    cursor: pointer;
    flex: 1;
    padding: 12px;
    justify-content: space-between;
  }
  .opblock-summary-control > div {
    display: flex;
    align-items: center;
  }
  .opblock-summary-method {
    border-radius: 3px;
    color: #fff;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    min-width: 60px;
    padding: 4px 0;
    text-align: center;
    text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
    text-transform: uppercase;
  }
  .opblock.opblock-post .opblock-summary-method {
    background: #49cc90;
  }
  .opblock.opblock-put .opblock-summary-method {
    background: #fca130;
  }
  .opblock.opblock-get .opblock-summary-method {
    background: #61affe;
  }
  .opblock.opblock-delete .opblock-summary-method {
    background: #f93e3e;
  }
  .opblock.opblock-deprecated .opblock-summary-method {
    background: #ebebeb;
  }
  .opblock {
    border: 1px solid rgba(59, 65, 81, 0.1);
    margin: 0 0 15px;
  }
  .opblock.is-open {
    background: #f4f6f8;
    border: unset;
    border-left: 2px solid black;
  }
  .opblock.opblock-deprecated {
    background: hsla(0, 0%, 92%, 0.1);
    opacity: 0.6;
  }
  .opblock .opblock-summary {
    align-items: center;
    display: flex;
  }
  .icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
    transition: all 0.4s;
  }
  .op-description {
    color: #a1a7ad;
    margin: 20px 0;
  }
  .op-description::first-letter {
    text-transform: uppercase;
  }
</style>
