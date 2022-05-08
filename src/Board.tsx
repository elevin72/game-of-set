import React, { useState } from "react";
import Card from './Card.tsx';
// import { getProperties, getCardFromProperties } from './Utils.tsx'
import { isSet, findAllSetsFast2 } from './Algorithms.tsx'

interface ICard {
    value: number;
    isSelected: boolean;
}

interface ISelected {
    isSelected: boolean;
}

type cardState = "notInPlay" | "inPlay" | "selected"

interface IState {
    deck: number[];
    inPlay: cardState[];
    showAnswers: boolean;
    setsFound: number;
}

const randomCard = (cards: number[]) => cards[Math.floor(Math.random() * cards.length)]
const removeCard = (cards: number[], removeMe: number) => cards.filter(c => c !== removeMe)

function initState(): IState {

    let deck = Array.from(Array(81).keys())

    let inPlay: cardState[] = deck.map(_ => "notInPlay")

    for (let i = 0; i < 12; i++) {
        const card = randomCard(deck)
        deck = removeCard(deck, card)
        inPlay[card] = "inPlay"
    }

    return {
        deck: deck,
        inPlay: inPlay,
        showAnswers: false,
        setsFound: 0
    }

}

const Board: React.FC<any> = () => {



    const [gameState, setGameState] = useState(initState())
    // const [deck, setDeck] = useState(startDeck)
    // const [showAnswers, setShowAnswers] = useState(false)
    // const [validSetsFound, setValidSetsFound] = useState(0)

    // detect if set is chosen and respond appropiately
    function toggleCard(cardNumber: number): void {
        let newInPlay = gameState.inPlay.map((card, idx) => {
            if (idx !== cardNumber) {
                return card
            } else {
                switch (card) {
                    case "inPlay": return "selected"
                    case "selected": return "inPlay"
                    case "notInPlay": {
                        console.error("Can't toggle card that is not in play!");
                        return "notInPlay"
                    }
                }
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
                {showAnswers && buildSets(findAllSetsFast2(inPlay.map(c => c.value)))}
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



export default Board;
