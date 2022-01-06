<script>
  export let opData;
  export let tagIndex;
  export let opDataToggle;
</script>

{#each opData as op, i}
  <a
    class:lp-get={op.http_method === "get"}
    class:lp-post={op.http_method === "post"}
    class:lp-put={op.http_method === "put"}
    class:lp-delete={op.http_method === "delete"}
    class:deprecated={op.deprecated === true}
    on:click={() => {
      opDataToggle[tagIndex].fill(false);
      opDataToggle[tagIndex][i] = true;
    }}
    href={`#tag${tagIndex}op${i}`}
  >
    <h2
      class:active={opDataToggle[tagIndex][i]}
      class:first={i === 0}
      class:last={i === opDataToggle[tagIndex].length - 1}
      class="op-name"
    >
      {op.operationId.replace(/([A-Z])/g, " $1")[0].toUpperCase() +
        op.operationId
          .replace(/([A-Z])/g, " $1")
          .slice(1)
          .toLowerCase()}
    </h2>
    <span class="http-method-pill">{op.http_method}</span>
  </a>
{/each}

<style>
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .op-name {
    display: inline-block;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: #959ba2;
    padding: 5px 5px 5px 0;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    white-space: nowrap;
  }
  .op-name::first-letter {
    text-transform: uppercase;
  }
  .op-name::before {
    content: "";
    border-left: 1px solid rgba(149, 155, 162, 0.5);
    border-right: 1px solid rgba(149, 155, 162, 0.5);
    padding: 5px 0;
    margin-right: 10px;
  }
  .op-name.active::before {
    border-left: 1px solid rgba(91, 160, 238, 0.8);
    border-right: 1px solid rgba(91, 160, 238, 0.8);
  }
  .op-name.active {
    color: rgb(91, 160, 238);
  }
  .deprecated .op-name {
    text-decoration: line-through;
  }
  .http-method-pill {
    border-radius: 3px;
    color: #fff;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    min-width: 40px;
    padding: 2px 0;
    text-align: center;
    text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  .lp-post .http-method-pill {
    background: #49cc90;
  }
  .lp-put .http-method-pill {
    background: #fca130;
  }
  .lp-get .http-method-pill {
    background: #61affe;
  }
  .lp-delete .http-method-pill {
    background: #f93e3e;
  }
  .deprecated .http-method-pill {
    background: #ebebeb;
  }
</style>
