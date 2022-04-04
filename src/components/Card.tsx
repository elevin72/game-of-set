import React from "react";
import './Card.css';
import getProperties from '../Utils.tsx';

// TODO: 
// 1) unselect after replacing
// 2) Center and make purty the cards
//
//

const Card = React.memo((props) => {
  debugger;
  const [numSymbols, color, fill, shape]: Array<number> = getProperties(props.value)
  const getCardSymbols = (c, f, s) => {
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


  /* const symbols = []
  for (let i = 0; i < number + 1; i++) {
    symbols.push(<img key={i} src={require('../images/' + pathName)} />)
  } */
  const style = {
    borderRadius: "25px",
    border: props.selected ? "4px solid #fcba03" : "4px solid #ababab",
    padding: "20px",
    float: "left",
    textAlign: "center",
    width: props.small ? "110px" : "200px",
    height: props.small ? "80px" : "125px"
  }

  return (
    <div className="card" style={style}>
      <div style={{margin: "auto"}}>
        {symbols}
      </div>
    </div>
  )
})

export default Card;
