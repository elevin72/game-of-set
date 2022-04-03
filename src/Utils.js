
// [n,c,f,s]
const getVariants = (value) => {
  const number = Math.floor(value / 27)
  const color = Math.floor((value - (number * 27)) / 9)
  const fill = Math.floor((value - (number * 27) - (color * 9)) / 3)
  const shape = value - (number * 27) - (color * 9) - (fill * 3)
  return [number, color, fill, shape]
}

export default getVariants

