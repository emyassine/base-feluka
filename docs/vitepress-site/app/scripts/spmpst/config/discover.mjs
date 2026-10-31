export function discoverConfig(layout) {
  const concerns = Object.entries(layout.paths.configFiles)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, path]) => ({ name, path }))
  return { concerns }
}
