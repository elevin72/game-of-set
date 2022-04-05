import React, { useState } from "react";
import Card from './Card.tsx';
import { getProperties, getCardFromProperties } from './Utils.tsx'
// import {getCardFromProperties } from '../Utils.tsx'

interface ICard {
    value: number;
    isSelected: boolean;
}

const Board: React.FC<any> = () => {

    // select a random card
    const randomCard = (cards: Array<number>) => cards[Math.floor(Math.random() * cards.length)]

    let startDeck = Array.from(Array(81).keys())
    const [inPlay, setInPlay] = useState(Array.from(Array(12)).map(_ => {
        const card = randomCard(startDeck)
        startDeck = startDeck.filter(c => c !== card)
        return { "value": card, "isSelected": false }
    }))
    const [deck, setDeck] = useState(startDeck)
    const [showAnswers, setShowAnswers] = useState(false)
    const [validSetsFound, setValidSetsFound] = useState(0)

    // detect if set is chosen and respond appropiately
    function toggleCard(cardIdx: number): void {
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
                setValidSetsFound(validSetsFound + 1)
                if (newInPlay.length > 12 || deck.length === 0) { // dont replace from deck
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
    function drawThree(): Array<ICard> {
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
    function addThreeCards(): void {
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
                                    <Card value={inPlay[index].value} selected={inPlay[index].isSelected} small={false} />
                                </button>
                            </th>
                        )
                    })}
                </tr>
            ))}
        </>
    )

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Sets Found </h1>
            <h3 style={{ textAlign: "center" }}>{validSetsFound} </h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <table>
                    <tbody>
                        {cards}
                    </tbody>
                </table>
            </div>
            <button onClick={addThreeCards}>add three cards</button>
            <button onClick={() => { setShowAnswers(!showAnswers) }}>
                {showAnswers ? 'hide answers' : 'find all sets'}
            </button>
            <ol>
                {showAnswers && buildSets(findAllSetsFast2(inPlay))}
            </ol>
        </>
    )
}

function buildSets(answers: number[][]): JSX.Element[] | string {
    return answers ? answers.map((a, idx) => {
        return (
            <li key={idx} style={{ position: "relative", paddingBottom: "10em" }}>
                <div>
                    <div style={{ paddingRight: "2em" }}>
                        <Card value={a[0]} selected={false} small={true} />
                    </div>
                    <div style={{ paddingRight: "2em" }}>
                        <Card value={a[1]} selected={false} small={true} />
                    </div>
                    <div style={{ paddingRight: "2em" }}>
                        <Card value={a[2]} selected={false} small={true} />
                    </div>
                </div>
            </li>
        )
    }
    ) : "No sets found"
    // return answers ? (
    //     <li style={{ position: "relative", paddingBottom: "10em" }}>
    //         <div>
    //             <div style={{ paddingRight: "2em" }}>
    //                 <Card value={answers[0]} selected={false} small={true} />
    //             </div>
    //             <div style={{ paddingRight: "2em" }}>
    //                 <Card value={answers[1]} selected={false} small={true} />
    //             </div>
    //             <div style={{ paddingRight: "2em" }}>
    //                 <Card value={answers[2]} selected={false} small={true} />
    //             </div>
    //         </div>
    //     </li>
    // ) : "no set found"
}


// check if selected cards are a set
function isSet(cards: Array<number>): boolean {
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

function getThirdCard(card1: number, card2: number): number {
    const [n1, c1, f1, s1] = getProperties(card1)
    const [n2, c2, f2, s2] = getProperties(card2)
    const properties = [getThirdValue(n1, n2), getThirdValue(c1, c2), getThirdValue(f1, f2), getThirdValue(s1, s2)]
    return getCardFromProperties(properties)
}

function getThirdValue(v1: number, v2: number): number {
    return (3 - ((v1 + v2) % 3)) % 3
}

// brute force method
function findAllSets(inPlay: ICard[]): Array<Array<number>> {
    let sets = []
    let count = 0
    const cards = inPlay.map(card => card.value)
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

// function findSet(inPlay: Array<ICard>): Array<ICard> {

// }

function findSet(inPlay: Array<ICard>): number[] {
    let count = 0
    const cards = inPlay.map(card => card.value)
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

function findSetFast(inPlay: Array<ICard>): number[] {
    let count = 0
    let cards = inPlay.map(card => card.value)
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
function findAllSetsFast1(inPlay: Array<ICard>): Array<Array<number>> {
    let sets = []
    const cards = inPlay.map(card => card.value)
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
function findAllSetsFast2(inPlay: Array<ICard>): number[][] {
    let count = 0
    let sets = []
    let cards = inPlay.map(card => card.value)
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

export default Board;
