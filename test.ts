import Board from './Board';

const b = new Board();
console.log(b.toString(undefined, 'D5'));

b.state.A1 = 'wwwdb';

console.log(b.getCompositionByCell('A1'));