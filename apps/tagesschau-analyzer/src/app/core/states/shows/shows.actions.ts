export interface ShowsStateModel {
  inProgress: boolean;
  count: number;
}

export namespace ShowsActions {
  export class LoadCount {
    static readonly type = '[Shows] Load Count';
  }
}
