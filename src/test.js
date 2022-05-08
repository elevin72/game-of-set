

let arr = [0,1,2,3,4,5,6,,7,8,9]

for (let i = 0; i < arr.length; i++){
  for (let j = i+1; i < arr.length; j++){
    console.log(i,j);
  }
}
