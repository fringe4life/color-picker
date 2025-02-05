<script lang="ts" >
  import type { MouseEventHandler } from "svelte/elements";

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
    $inspect(colors);

  /**
   * @abstract updates the dom with the fetched colors.
   * @param _ The event object.
   */
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (_) => {
    isLoading = true;
    colors = await fetchColors();

    if(!colors) {
      return;

      // error message or something
    }

    isLoading = false;

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

<header>
  <input type="color" bind:value={color} />
  <select bind:value={colorStyleSelected}>
    <option value="monochrome">Monochrome</option>
    <option value="monochrome-dark">Monochrome-dark</option>
    <option value="monochrome-light">Monochrome-light</option>
    <option value="analogic">Analogic</option>
    <option value="complement">Complement</option>
    <option value="analogic-complement">Analogic-complement</option>
    <option value="triad">Triad</option>
  </select>
  <button onclick={handleClick}>Get Color Scheme</button>
</header>

<main class="flex  h-120 w-full flex-col flex-wrap md:flex-row md:flex-nowrap">
  {#if isLoading }

    <p>Loading...</p>

  {:else if hasError}

    <p>{hasError}</p>

  {:else if colors}

      {#each colors.colors as color}
        <div class="flex flex-1 flex-col">
          <div class="w-full h-40" style="background-color: {color.hex.value}">
              
          </div>
          <p>{color.hex.value}</p>
        </div>
      {/each}


  {/if}
</main>

<footer>
  <a href="https://www.flaticon.com/free-icons/palette" title="palette icons">Palette icons created by nawicon - Flaticon</a>
</footer>

<style>
</style>
