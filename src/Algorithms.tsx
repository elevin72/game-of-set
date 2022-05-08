
import { getProperties, getCardFromProperties } from './Utils.tsx'

// check if selected cards are a set
export function isSet(cards: Array<number>): boolean {
  // debugger;
  const [n0, c0, f0, s0] = getProperties(cards[0])
  const [n1, c1, f1, s1] = getProperties(cards[1])
  const [n2, c2, f2, s2] = getProperties(cards[2])
  // this is makes more sense
  /* const set =
    ((n0 === n1 && n1 === n2) || (n0 !== n1 && n1 !== n2 && n0 !== n2)) &&
    ((c0 === c1 && c1 === c2) || (c0 !== c1 && c1 !== c2 && c0 !== c2)) &&
    ((f0 === f1 && f1 === f2) || (f0 !== f1 && f1 !== f2 && f0 !== f2)) &&
    ((s0 === s1 && s1 === s2) || (s0 !== s1 && s1 !== s2 && s0 !== s2)); */

  // this is simpler
  const set = ((n0 + n1 + n2) % 3 === 0) &&
    ((c0 + c1 + c2) % 3 === 0) &&
    ((f0 + f1 + f2) % 3 === 0) &&
    ((s0 + s1 + s2) % 3 === 0);
  return set
}

export function getThirdCard(card1: number, card2: number): number {
  const [n1, c1, f1, s1] = getProperties(card1)
  const [n2, c2, f2, s2] = getProperties(card2)
  const properties = [getThirdValue(n1, n2), getThirdValue(c1, c2), getThirdValue(f1, f2), getThirdValue(s1, s2)]
  return getCardFromProperties(properties)
}

export function getThirdValue(v1: number, v2: number): number {
  return (3 - ((v1 + v2) % 3)) % 3
}

// brute force method
export function findAllSets(cards: number[]): Array<Array<number>> {
  let sets = []
  let count = 0
  // const cards = inPlay.map(card => card.value)
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        count++;
        let a = cards[i]
        let b = cards[j]
        let c = cards[k]
        if (isSet([a, b, c])) {
          sets.push([a, b, c])
        }
      }
    }
  }
  console.log("Iterations: ", count)
  return sets
}

// export function findSet(inPlay: Array<ICard>): Array<ICard> {

// }

export function findSet(cards: Array<number>): number[] {
  let count = 0
  // const cards = inPlay.map(card => card.value)
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      count++;
      let cardK = getThirdCard(cards[i], cards[j])
      if (cards.includes(cardK)) {
        console.log("Iterations: ", count)
        return ([cards[i], cards[j], cardK])
      }
    }
  }
  console.log("Iterations: ", count)
  return null
}

export function findSetFast(cards: Array<number>): number[] {
  let count = 0
  // let cards = inPlay.map(card => card.value)
  let middle = Math.floor(cards.length / 2)
  let firstHalf = cards.slice(0, middle)
  let secondHalf = cards.slice(middle, cards.length)
  console.log(firstHalf, secondHalf)
  for (let i = 0; i < firstHalf.length; i++) {
    for (let j = i + 1; j < firstHalf.length; j++) {
      count++;
      let cardK = getThirdCard(cards[i], cards[j])
      if (secondHalf.includes(cardK)) {
        console.log("Iterations: ", count)
        return ([cards[i], cards[j], cardK])
      }
    }
  }
  for (let i = 0; i < secondHalf.length; i++) {
    for (let j = i + 1; j < secondHalf.length; j++) {
      count++;
      let cardK = getThirdCard(cards[i], cards[j])
      if (firstHalf.includes(cardK)) {
        console.log("Iterations: ", count)
        return ([cards[i], cards[j], cardK])
      }
    }
  }
  console.log("Iterations: ", count)
  return null
}

// this has the same runtime as the bruteforce, but if `cards` were a hashmap with O(1) lookup then it would be reduced (n choose 2)
export function findAllSetsFast1(cards: Array<number>): Array<Array<number>> {
  let sets = []
  // const cards = inPlay.map(card => card.value)
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      let cardK = getThirdCard(cards[i], cards[j])
      if (cards.includes(cardK)) {
        sets.push([cards[i], cards[j], cardK])
      }
    }
  }
  return sets
}

// if set totally exists in 1 half then it will get added 3 times. Not good
export function findAllSetsFast2(cards: Array<number>): number[][] {
  let count = 0
  let sets = []
  // let cards = inPlay.map(card => card.value)
  let middle = Math.floor(cards.length / 2)
  let firstHalf = cards.slice(0, middle)
  let secondHalf = cards.slice(middle, cards.length)
  console.log(firstHalf, secondHalf)
  // const checkHalf = ()
  for (let i = 0; i < firstHalf.length; i++) {
    for (let j = i + 1; j < firstHalf.length; j++) {
      count++;
      let cardK = getThirdCard(firstHalf[i], firstHalf[j])
      if (cards.includes(cardK)) {
        console.log("set found")
        sets.push([firstHalf[i], firstHalf[j], cardK])
      }
    }
  }
  for (let i = 0; i < secondHalf.length; i++) {
    for (let j = i + 1; j < secondHalf.length; j++) {
      count++;
      let cardK = getThirdCard(secondHalf[i], secondHalf[j])
      if (cards.includes(cardK)) {
        console.log("set found")
        sets.push([secondHalf[i], secondHalf[j], cardK])
      }
    }
  }
  console.log("Iterations: ", count)
  return sets
}
