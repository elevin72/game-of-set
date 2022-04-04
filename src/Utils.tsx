
// [n,c,f,s]

function getProperties(value: number): Array<number> {
  const number = Math.floor(value / 27)
  const color = Math.floor((value - (number * 27)) / 9)
  const fill = Math.floor((value - (number * 27) - (color * 9)) / 3)
  const shape = value - (number * 27) - (color * 9) - (fill * 3)
  return [number, color, fill, shape]
}

/* function getCardFromProperties(properties: Array<number>): number {
  const [number, color, fill, shape] = properties
  return (number * 27) + (color * 9) + (fill * 3) + shape
} */

// export default { getProperties, getCardFromProperties }
export default  getProperties

