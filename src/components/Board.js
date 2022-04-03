import React, { useState } from "react";
import Card from './Card.js';
import getVariants from '../Utils.js';

const Board = () => {

  // select a random card
  const randomCard = (cards) => cards[Math.floor(Math.random() * cards.length)]

  let startDeck = Array.from(Array(81).keys())
  const [inPlay, setInPlay] = useState(Array.from(Array(12)).map(_ => {
    const card = randomCard(startDeck)
    startDeck = startDeck.filter(c => c !== card)
    return { "value": card, "isSelected": false }
  }))
  const [deck, setDeck] = useState(startDeck)
  const [showAnswers, setShowAnswers] = useState(false)

  // detect if set is chosen and respond appropiately
  const toggleCard = (cardIdx) => {
    // debugger;
    let newInPlay = inPlay.map((card, idx) => {
      if (idx !== cardIdx) {
        return card
      } else {
        return { "value": card.value, "isSelected": !card.isSelected }
      }
    })
    const selectedCards = newInPlay.filter(card => card.isSelected)

    if (selectedCards.length === 3) { // 3 are selected
      if (isSet(selectedCards.map(card => card.value))) { // and they are a set
        if (newInPlay.length > 12 || deck.length == 0) { // dont replace from deck
          newInPlay = newInPlay
            .filter(card => !card.isSelected)
            .map(card => {
              card.isSelected = false
              return card
            })
          setInPlay(newInPlay)
        } else { // replace from deck
          const newCards = drawThree()
          let i = 0;
          newInPlay = newInPlay.map(card => {
            return card.isSelected ? newCards[i++] : card
          })
          setInPlay(newInPlay)
        }
      } else {
        setInPlay(newInPlay.map(card => {
          return { "value": card.value, "isSelected": false }
        }))
      }
    } else { // < 3 are selected
      setInPlay(newInPlay)
    }
  }

  // draw 3 from deck, removing those cards
  const drawThree = () => {
    let newDeck = [...deck]
    let newCards = []
    for (let i = 0; i < 3; i++) {
      let newCard = randomCard(newDeck)
      newCards.push(newCard)
      newDeck = newDeck.filter(card => card !== newCard)
    }
    setDeck(newDeck)
    newCards = newCards.map(cardValue => {
      return { "value": cardValue, "isSelected": false }
    })
    return newCards
  }

  // add 3 cards to boards
  const addThreeCards = () => {
    let newCards = drawThree()
    setInPlay(inPlay.concat(newCards))
  }

  const test = () => {
    debugger;
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        console.log(i, j);
      }
    }
  }

  // how many row go in the board
  const numRows = Array.from(Array(inPlay.length / 3).keys())

  const cards = (
    <>
      {numRows.map((row) => (
        <tr key={row}>
          {[0, 1, 2].map(offset => {
            const index = row * 3 + offset;
            return (
              <th key={index}>
                <button onClick={() => toggleCard(index)}>
                  <Card number={inPlay[index].value} selected={inPlay[index].isSelected} />
                </button>
              </th>
            )
          })}
        </tr>
      ))}
    </>
  )

  let answers = findAllSets(inPlay)

  return (
    <>
      <h1>Board</h1>
      <table>
        <tbody>
          {cards}
        </tbody>
      </table>
      <button onClick={addThreeCards}>add three cards</button>
      <button onClick={() => {
        answers = findAllSets(inPlay)
        setShowAnswers(!showAnswers)
      }}>{showAnswers ? 'hide answers' : 'find all sets'}</button>
      <div>
        {showAnswers && answers.map(a => {
          return (
            <div style={{position: "relative" }}>
              <Card number={a[0]} selected={false} small={true} />
              <Card number={a[1]} selected={false} small={true} />
              <Card number={a[2]} selected={false} small={true} />
            </div>
          )
        }
        )}
      </div>
    </>
  )
}


// check if selected cards are a set
const isSet = (cards) => {
  // debugger;
  const [n0, c0, f0, s0] = getVariants(cards[0])
  const [n1, c1, f1, s1] = getVariants(cards[1])
  const [n2, c2, f2, s2] = getVariants(cards[2])
  const set =
    ((n0 === n1 && n1 === n2) || (n0 !== n1 && n1 !== n2 && n0 !== n2)) &&
    ((c0 === c1 && c1 === c2) || (c0 !== c1 && c1 !== c2 && c0 !== c2)) &&
    ((f0 === f1 && f1 === f2) || (f0 !== f1 && f1 !== f2 && f0 !== f2)) &&
    ((s0 === s1 && s1 === s2) || (s0 !== s1 && s1 !== s2 && s0 !== s2));
  return set
}


// brute force method
const findAllSets = (inPlay) => {
  let sets = []
  const cards = inPlay.map(card => card.value)
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        let a = cards[i]
        let b = cards[j]
        let c = cards[k]
        if (isSet([a, b, c])) {
          sets.push([a, b, c])
        }
      }
    }
  }
  return sets
}


export default Board;
