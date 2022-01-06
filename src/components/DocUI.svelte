<script>
  import OpSummary from "./OpSummary.svelte";
  import LeftPanel from "./LeftPanel.svelte";
  import ModelSummary from "./ModelSummary.svelte";
  import RightModal from "./RightModal.svelte";
  import docJson from "../data/swagger.json";
  import DOMPurify from "dompurify";
  import numberToText from "number-to-text";
  import "number-to-text/converters/en-us";
  import { marked } from "marked";
  let references = docJson.definitions;
  let infoDescription = marked.parse(docJson.info.description);
  infoDescription = DOMPurify.sanitize(infoDescription);
  let tags = [];
  let models = [];
  let modelToggled = true;
  let base_path = docJson.host + docJson.basePath;
  let paths = docJson.paths;
  let pathUrls = Object.keys(paths);
  docJson.tags.forEach((tag) => {
    let opData = [];
    let tagDesc = marked.parse(tag.description);
    tagDesc = DOMPurify.sanitize(tagDesc);
    pathUrls.forEach((url) => {
      ["get", "post", "put", "delete"].forEach((op) => {
        if (op in paths[url]) {
          paths[url][op].tags.forEach((tagName) => {
            if (tagName === tag.name) {
              opData.push({
                ...paths[url][op],
                base_path,
                url,
                http_method: op,
              });
            }
          });
        }
      });
    });
    if ("externalDocs" in tag) {
      tags.push({
        name: tag.name,
        description: tagDesc,
        externalDocs: tag.externalDocs,
        opData,
      });
    } else {
      tags.push({ name: tag.name, description: tagDesc, opData });
    }
  });
  let modelNames = Object.keys(references);
  modelNames.forEach((modelName) => {
    models.push({ ...references[modelName], name: modelName });
  });
  let modelIndexToggle = new Array(models.length).fill(false);
  let opDataToggle = new Array(tags.length).fill(false);
  let modal = {
    show: false,
    arg: null,
    props: null,
    modalShow(arg, props) {
      modal = { ...modal, show: true, arg, props };
    },
  };
</script>

<div class="appContainer">
  <RightModal bind:modal>
    <svelte:component this={modal.arg} {...modal.props} />
  </RightModal>
  <div class="left-panel">
    <LeftPanel
      {tags}
      {models}
      title={docJson.info.title}
      bind:modelToggled
      bind:modelIndexToggle
      bind:opDataToggle
      bind:modal
    />
  </div>
  <div class="main-app" class:modal-open={modal.show}>
    <div class="padded-container">
      <div class="info">
        <h2 class="title">
          {docJson.info.title}<small><pre>{docJson.info.version}</pre></small>
        </h2>
        <div class="description">
          <div class="markdown">{@html infoDescription}</div>
          <h3>
            The docs are organized into {numberToText
              .convertToText(tags.length + 1)
              .toLowerCase()} main groups:
          </h3>
          {#each tags as tag, i}
            <li><a href={`#tag${i}`}>{tag.name}</a></li>
          {/each}
          <li><a href="#model">Models</a></li>
        </div>
      </div>
    </div>
    <div class="padded-container">
      <div class="tags">
        <h3>Reference</h3>
        {#each tags as tag, i}
          <h3 id={`tag${i}`} class="tag">
            <div class="tag-name">{tag.name} Endpoints</div>
          </h3>
          <small>{@html tag.description}</small>
          <OpSummary
            opData={tag.opData}
            {models}
            tagIndex={i}
            bind:opDataToggle
            bind:modal
          />
        {/each}
      </div>
    </div>
    <div class="padded-container">
      <div class="models" class:is-open={modelToggled}>
        <h4
          id="model"
          on:click={() => {
            modelToggled = !modelToggled;
          }}
        >
          <button class="models-control">
            <span class="model-heading">Models</span>
            <img
              class="icon"
              class:expanded={modelToggled}
              src="/icons/arrow-down.svg"
              alt=""
            />
          </button>
        </h4>
        {#if modelToggled}
          <ModelSummary {models} bind:modelIndexToggle />
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .appContainer {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 1460px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
  }
  .left-panel {
    width: 265px;
    background-color: #f4f6fa;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .left-panel::-webkit-scrollbar {
    display: none;
  }
  .main-app {
    flex-basis: calc(100% - 260px);
  }
  .main-app.modal-open {
    flex-basis: calc(50% - 130px);
  }
  .padded-container {
    padding: 0 20px;
  }
  .appContainer .info {
    margin: 50px 0;
    color: #3b4151;
  }
  .info .description {
    margin-bottom: 5px;
  }
  .info .description .markdown {
    color: #a1a7ad;
    font-size: 16px;
    line-height: 1.5;
  }
  .info .description h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 0;
    color: #4e5358;
  }
  .info .description li {
    color: #4a93e8;
    font-size: 16px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .info .description li a {
    text-transform: capitalize;
    color: #4a93e8;
  }
  .info .title small {
    background: #7d8492;
    border-radius: 57px;
    display: inline-block;
    font-size: 10px;
    margin: 0 0 0 5px;
    padding: 2px 4px;
    position: relative;
    top: -5px;
    vertical-align: super;
  }
  .info .title small pre {
    color: #fff;
    font-family: sans-serif;
    margin: 0;
    padding: 0;
  }
  .info pre {
    font-size: 14px;
  }
  .appContainer .title {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 36px;
    margin: 0;
  }
  .tags .tag-name {
    text-transform: capitalize;
  }
  .tags > h3:first-child {
    color: #92959b;
    margin-bottom: 0;
    font-size: 14px;
    padding-left: 10px;
  }
  .tag {
    font-size: 24px;
    justify-content: flex-start;
    align-items: center;
    margin: 0 0 5px;
    border-bottom: 1px solid rgba(59, 65, 81, 0.1);
    cursor: pointer;
    display: flex;
    padding: 10px 20px 10px 10px;
    transition: all 0.2s;
  }
  .tag + small {
    display: inline-block;
    flex: 1;
    color: #a1a7ad;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: 500;
    padding: 0 10px;
  }
  .icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    transition: all 0.4s;
  }
  .models-control .icon {
    transition: none;
  }
  .icon.expanded {
    transform: rotate(180deg);
  }
  .models {
    border: 1px solid rgba(59, 65, 81, 0.3);
    border-radius: 4px;
    margin: 30px 0;
  }
  .models .model-heading {
    font-size: 16px;
    font-weight: 700;
    font-family: sans-serif;
  }
  .models h4 {
    align-items: center;
    color: #606060;
    cursor: pointer;
    display: flex;
    font-family: sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 10px 20px 10px 10px;
    transition: all 0.2s;
  }
  .is-open h4 {
    border-bottom: 1px solid rgba(59, 65, 81, 0.3);
    margin: 0 0 5px;
  }
  .models .models-control {
    all: inherit;
    border-bottom: 0;
    cursor: pointer;
    flex: 1;
    padding: 0;
  }
  .models-control:focus {
    outline: auto;
  }
  .models h4 span {
    flex: 1;
  }
</style>
