// Compiled by Svelte, so $state works here: gives tests reactive component props.
export function reactive(initial) {
  const props = $state(initial);
  return props;
}
