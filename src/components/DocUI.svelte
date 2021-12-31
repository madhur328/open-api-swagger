<script>
  import OpSummary from "./OpSummary.svelte";
  import ModelSummary from "./ModelSummary.svelte";
  import docJson from "../data/swagger.json";
  import DOMPurify from "dompurify";
  import { marked } from "marked";
  let references = docJson.definitions;
  let infoDescription = marked.parse(docJson.info.description);
  infoDescription = DOMPurify.sanitize(infoDescription);
  let tags = [];
  let tagIndexToggled = [];
  let models = [];
  let modelToggled = false;
  let paths = docJson.paths;
  let pathUrls = Object.keys(paths);
  docJson.tags.forEach((tag) => {
    let opData = [];
    tagIndexToggled.push(false);
    let tagDesc = marked.parse(tag.description);
    tagDesc = DOMPurify.sanitize(tagDesc);
    pathUrls.forEach((url) => {
      ["get", "post", "put", "delete"].forEach((op) => {
        if (op in paths[url]) {
          paths[url][op].tags.forEach((tagName) => {
            if (tagName === tag.name) {
              opData.push({
                ...paths[url][op],
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
  const indexDataToggle = (i) => {
    tagIndexToggled[i] = !tagIndexToggled[i];
  };
</script>

<div class="appContainer">
  <div class="padded-container">
    <div class="info">
      <h2 class="title">
        {docJson.info.title}<small><pre>{docJson.info.version}</pre></small>
      </h2>
      <div class="description">{@html infoDescription}</div>
    </div>
  </div>
  <div class="scheme-container">
    <label for="schemes">
      <span class="schemes-title">Schemes</span>
      <select>
        {#each docJson.schemes as scheme}
          <option value={scheme}>{scheme}</option>
        {/each}
      </select>
    </label>
    <div class="auth-wrapper">
      <button class="btn authorize unlocked">
        <span>Authorize</span>
        <img class="icon lock" src="/icons/lock-open-green.svg" alt="" />
      </button>
    </div>
  </div>
  <div class="padded-container">
    <div class="tags">
      {#each tags as tag, i}
        <h3
          class="tag"
          on:click={() => {
            indexDataToggle(i);
          }}
        >
          <div>{tag.name}</div>
          <small>{@html tag.description}</small>
          {#if "externalDocs" in tag}
            <div>
              <small on:click|stopPropagation>
                {tag.externalDocs.description}:
                <a href={tag.externalDocs.url}>{tag.externalDocs.url}</a>
              </small>
            </div>
          {/if}
          <img
            class="icon"
            class:expanded={tagIndexToggled.length && tagIndexToggled[i]}
            src="/icons/arrow-down.svg"
            alt=""
          />
        </h3>
        {#if tagIndexToggled.length && tagIndexToggled[i]}
          <OpSummary opData={tag.opData} {models} />
        {/if}
      {/each}
    </div>
  </div>
  <div class="padded-container">
    <div class="models" class:is-open={modelToggled}>
      <h4
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
        <ModelSummary {models} />
      {/if}
    </div>
  </div>
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #f7f7f7 url("/icons/arrow-down.svg") right 10px center no-repeat;
    background-size: 10px;
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
  .btn {
    background: transparent;
    border: 2px solid gray;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    color: #3b4151;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 5px 23px;
    transition: all 0.3s;
  }
  .btn:hover {
    box-shadow: 0 0 5px rgb(0 0 0 / 30%);
  }
  .appContainer {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 1460px;
    width: 100%;
  }
  .padded-container {
    padding: 0 20px;
  }
  .appContainer .info {
    margin: 50px 0;
  }
  .info .description {
    margin-bottom: 5px;
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
  .scheme-container {
    background: #fff;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 15%);
    margin: 0 0 20px;
    padding: 30px 20px;
    align-items: center;
    display: flex;
  }
  .scheme-container > label {
    color: #3b4151;
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
    margin: -20px 15px 0 0;
  }
  .scheme-container > label span {
    font-family: sans-serif;
    font-weight: 700;
  }
  .scheme-container > label select {
    min-width: 130px;
    text-transform: uppercase;
  }
  .auth-wrapper {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
  .auth-wrapper .authorize {
    margin-right: 10px;
    padding-right: 20px;
  }
  .btn.authorize {
    background-color: transparent;
    border-color: #49cc90;
    color: #49cc90;
    display: inline;
    line-height: 1;
    cursor: pointer;
  }
  .btn.authorize span {
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 700;
    float: left;
    padding: 4px 20px 0 0;
  }
  .appContainer .title {
    color: #3b4151;
    font-family: sans-serif;
    font-size: 36px;
    margin: 0;
  }
  .tag {
    display: flex;
    font-size: 24px;
    justify-content: center;
    align-items: center;
    margin: 0 0 5px;
    align-items: center;
    border-bottom: 1px solid rgba(59, 65, 81, 0.3);
    cursor: pointer;
    display: flex;
    padding: 10px 20px 10px 10px;
    transition: all 0.2s;
  }
  .tag small {
    display: inline-block;
    flex: 1;
    color: #3b4151;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 0 10px;
  }
  .icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    transition: all 0.4s;
  }
  .icon.lock {
    transform: rotateY(180deg);
    width: 20px;
    height: 20px;
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
