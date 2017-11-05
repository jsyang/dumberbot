let history:any = [];

export const push = (state) => history.push({...state});
export const pop  = () => history.pop();