export function navigationOrderKey(name) {
  const match = name.match(/^(\d+)[.-]/)
  return [match ? Number(match[1]) : Number.MAX_SAFE_INTEGER, name]
}

export function sortNavigationEntries(entries, sourceNames = {}) {
  return [...entries].sort((left, right) => {
    const leftName = sourceNames[left.name] ?? left.name
    const rightName = sourceNames[right.name] ?? right.name
    const [leftNumber, leftStableName] = navigationOrderKey(leftName)
    const [rightNumber, rightStableName] = navigationOrderKey(rightName)
    return leftNumber - rightNumber || (leftStableName < rightStableName ? -1 : leftStableName > rightStableName ? 1 : 0)
  })
}
