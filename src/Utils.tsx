
// [n,c,f,s]

export function getProperties(value: number): Array<number> {
  const numSymbols = Math.floor(value / 27)
  const color = Math.floor((value - (numSymbols * 27)) / 9)
  const fill = Math.floor((value - (numSymbols * 27) - (color * 9)) / 3)
  const shape = value - (numSymbols * 27) - (color * 9) - (fill * 3)
  return [numSymbols, color, fill, shape]
}

export function getCardFromProperties(properties: Array<number>): number {
  const [number, color, fill, shape] = properties
  return (number * 27) + (color * 9) + (fill * 3) + shape
}

// export { getProperties, getCardFromProperties }
// export default  getProperties

