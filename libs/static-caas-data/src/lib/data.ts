export interface Game {
  id: number;
  activeTeam: Team;
}

export enum Team {
  White = 'WHITE',
  Black = 'BLACK',
}
