
// [n,c,f,s]
const getProperties = (value) => {
  const number = Math.floor(value / 27)
  const color = Math.floor((value - (number * 27)) / 9)
  const fill = Math.floor((value - (number * 27) - (color * 9)) / 3)
  const shape = value - (number * 27) - (color * 9) - (fill * 3)
  return [number, color, fill, shape]
}

const getCardFromProperties = (properties) => {
  const [number, color, fill, shape] = properties
  return (number * 27) + (color * 9) + (fill * 3) + shape
}

export default getProperties
export default getCardFromProperties

