import React from "react";
import './Card.css';
import {getProperties} from './Utils.tsx';

// TODO: 
// 1) unselect after replacing
// 2) Center and make purty the cards
//
//

interface CardProps {
    value: number;
    selected: boolean;
    small: boolean;
}

const Card: React.FC<CardProps> = React.memo((props) => {
    const [numSymbols, color, fill, shape]: Array<number> = getProperties(props.value)
    function getCardSymbols(c: number, f: number, s: number) {
        let name = ""
        switch (s) {
            case 0:
                name += "diamond_"
                break
            case 1:
                name += "oval_"
                break
            case 2:
                name += "squiggle_"
                break
        }
        switch (f) {
            case 0:
                name += "open_"
                break;
            case 1:
                name += "solid_"
                break;
            case 2:
                name += "striped_"
                break;
        }
        switch (c) {
            case 0:
                name += "blue"
                break;
            case 1:
                name += "green"
                break;
            case 2:
                name += "red"
                break;
        }
        return name + '.png'
    }

    const pathName = getCardSymbols(color, fill, shape)
    console.log(numSymbols)
    const symbols = Array.from(Array(numSymbols + 1).keys()).map(i => {
        return <img key={i} src={require('../images/' + pathName)} />
    })


    const style = {
        borderRadius: "25px",
        border: props.selected ? "4px solid #fcba03" : "4px solid #ababab",
        padding: "2em",
        float: "left",
        textAlign: "center",
        width: props.small ? "8em" : "12em",
        height: props.small ? "5em" : "8em"
    } as const;

    return (
        <div className="card" style={style}>
            <div style={{ margin: "auto" }}>
                {symbols}
            </div>
        </div>
    )
})

export default Card;
