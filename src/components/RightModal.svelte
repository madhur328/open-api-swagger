<script>
  import { fly } from "svelte/transition";
  export let modal;
  const toggle = () => {
    modal.show = !modal.show;
  };
</script>

{#if modal.show}
  <div transition:fly={{ y: 0, duration: 1000 }} class="backdrop">
    <div transition:fly={{ y: 0, duration: 1000 }} class="modal">
      <div class="header">
        <span on:click={toggle} class="close-button"
          ><svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
            ><line
              fill="none"
              stroke="#000"
              stroke-width="1.5"
              x1="1"
              y1="1"
              x2="13"
              y2="13"
            /><line
              fill="none"
              stroke="#000"
              stroke-width="1.5"
              x1="13"
              y1="1"
              x2="1"
              y2="13"
            /></svg
          ></span
        >
      </div>
      <div class="modal-content"><slot /></div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    width: calc(50% - 130px);
    display: flex;
    flex-direction: column;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .backdrop::-webkit-scrollbar {
    display: none;
  }
  .modal {
    display: flex;
    flex-basis: 100%;
    position: relative;
    background: #2f343c;
    color: rgb(255, 255, 255);
  }
  .header {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 30px;
    left: 30px;
  }
  .modal-content {
    padding-top: 60px;
    width: 100%;
  }
  .close-button {
    color: white;
    background-color: transparent;
    display: inline-block;
    fill: currentcolor;
    line-height: 0;
    cursor: pointer;
    transition: 0.1s ease-in-out;
  }
  .close-button [stroke*="#"] {
    stroke: currentcolor;
  }
  .close-button:hover {
    color: #999;
  }
</style>
