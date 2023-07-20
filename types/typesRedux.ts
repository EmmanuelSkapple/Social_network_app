//GroupReducer
export interface ActionComand {
  type: string;
  payload: any;
}

//LenguagesReducer
export interface ActionComand {
  type: string;
  payload: string;
}

export interface ObjetoRedux {
  type: 'incrementar' | 'decrementar';
  num: number;
}

export interface ActionComand {
  type: string;
}
