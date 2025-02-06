<script lang="ts">
  import type { KeyboardEventHandler, MouseEventHandler } from "svelte/elements";
  import { fade, fly } from "svelte/transition";

  /**
   * The type for the returned colors from the API.
   */
  type ReturnedColors = {
			mode: string;
			colors: {
        hex: {
          value: string;
        }
				hsl: {
					value: string;
				};
			}[];
		};

  type MaybePromise<T> = Promise<T | undefined>;

  /**
   * The baseUrl for the API to fetch color schemes.
   */
  const baseUrl = "https://www.thecolorapi.com/scheme";
  /**
   * The color state.
   */
  // biome-ignore lint:
  let color = $state('#ff0000');

  /**
   * The color for the query. This is derived from the color state.
   */
  // biome-ignore lint:
  let colorForQuery = $derived(color.substring(1));

  /**
   * The loading state.
   */
  let isLoading = $state(false);

  /**
   * The error state.
   */
  let hasError = $state("");

  /**
   * The color style selected.
   */
  // biome-ignore lint:
  let colorStyleSelected = $state("monochrome");

  /**
   * The colors state.
   */
  let colors: ReturnedColors | undefined = $state(undefined);
  
  /**
   * @abstract updates the dom with the fetched colors.
   * @param _ The event object.
   */
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (_) => {
    isLoading = true;
    colors = await fetchColors();

    if(!colors) {
      hasError = "Failed to fetch colors";
      isLoading = false;
      return;
    }
    isLoading = false;
  } 

  /**
   * @abstract copies the color hex value to the clipboard.
   * @param event The event object.
   */
  const copyColorToClipboard: MouseEventHandler<HTMLDivElement>=(event)=> {
    getHexColor(event);
  }

  /**
   * @abstract handle keyboard events to copy color hex value to clipboard.
   * @param event The event object.
   */
  const handleKeyboard: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if(event.key === 'Enter') {
      getHexColor(event);
    }
  }

  /**
   * 
   */
  function getHexColor(event: MouseEvent | KeyboardEvent): void {
    const colorHex = (event.currentTarget as HTMLElement).querySelector(
					"p",
				)?.textContent;
				if (colorHex) {
					navigator.clipboard.writeText(colorHex);
				}
  }
  /**
   * Fetch colors from the API
   */
  async function fetchColors(): MaybePromise<ReturnedColors> {
    try {
					const query = `?hex=${colorForQuery}&mode=${colorStyleSelected}&count=5`;

					const response = await fetch(`${baseUrl}${query}`);
					if (response.ok) {
						const data = await response.json() as ReturnedColors;
						return data;
					}
				} catch (error) {
					if(error instanceof Error) {
            hasError = error.message;
          }
				}

  }
</script>

<header class="dark:bg-[#1F2937] dark:text-white px-5 py-6 flex justify-evenly items-center gap-3 flex-wrap sm:justify-center">
  <input class="shadow-md h-12 w-18 rounded-sm" type="color" bind:value={color} />
  <select class="leading-6 border border-gray-200 flex-1 text-center shadow-md py-3 px-2 rounded-sm" bind:value={colorStyleSelected}>
    <option class="hover:shadow-sm" value="monochrome">Monochrome</option>
    <option class="hover:shadow-sm" value="monochrome-dark">Monochrome-dark</option>
    <option class="hover:shadow-sm" value="monochrome-light">Monochrome-light</option>
    <option class="hover:shadow-sm" value="analogic">Analogic</option>
    <option class="hover:shadow-sm" value="complement">Complement</option>
    <option class="hover:shadow-sm" value="analogic-complement">Analogic-complement</option>
    <option class="hover:shadow-sm" value="triad">Triad</option>
  </select>
  <button class="text-[#374151] dark:text-white dark:bg-[#3D4B60] shadow-md py-3 px-2 rounded-sm border border-gray-200" onclick={handleClick}>Get Color Scheme</button>
</header>

<main class="grid-autofit dark:bg-[#1F2937] dark:text-white">
  {#if isLoading }
  <!-- <div class="col-span-full  h-80 flex justify-center items-center">
    <p class="">Loading...</p>
    <div class="rounded-full text-transparent border-2 w-10 h-10 animate-spin" ></div>
  </div> -->
  
    <div in:fly={{y: 10}} out:fade={{duration: 50}} class="animate-pulse col-span-1 h-80 bg-grey-200 border dark:bg-teal-50 rounded-sm"></div>
    <div in:fly={{y:50}} out:fade={{duration: 50}} class="animate-pulse col-span-1 h-80 bg-grey-200 border dark:bg-teal-100 rounded-sm"></div>
    <div in:fly={{y: 90}} out:fade={{duration: 50}} class="animate-pulse col-span-1 h-80 bg-grey-200 border dark:bg-teal-200 rounded-sm"></div>
    <div in:fly={{y: 140}} out:fade={{duration: 50}} class="animate-pulse col-span-1 h-80 bg-grey-200 border dark:bg-teal-300 rounded-sm"></div>
    <div in:fly={{y: 200}} out:fade={{duration: 50}} class="animate-pulse col-span-1 h-80 bg-grey-200 border dark:bg-teal-400 rounded-sm"></div>

  {:else if hasError}

    <p class="col-span-full">{hasError}</p>

  {:else if colors}
      {#each colors.colors as color, index}
        <div in:fly={{x: -200, duration: 50}} out:fade class="col-span-1 hover:cursor" tabindex="{index}" role="button" onclick={copyColorToClipboard} onkeypress={handleKeyboard}>
          <div class="h-80" style="background-color: {color.hex.value}"></div>
          <p class="my-4 text-center">{color.hex.value}</p>
        </div>
      {/each}
  {:else }
    <p class="col-span-full flex justify-center items-center h-80 ">No colors to display</p>
  {/if}
</main>

<footer class="dark:bg-[#1F2937] text-center py-5 hover:text-blue-500 active:text-blue-700">
  <a href="https://www.flaticon.com/free-icons/palette" title="palette icons">Palette icons created by nawicon - Flaticon</a>
</footer>

<style>
  .grid-autofit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  option, select {
    color: #111827;
  }
  @media (prefers-color-scheme: dark) {
    select, option {
      background-color: #1F2937;
      color: white
    }
  }

</style>

