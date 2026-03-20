import { validateTeams, validateScore } from '@/lib/helpers';
export class Match {
  public readonly homeTeam: string;
  public readonly awayTeam: string;
  private _homeScore: number = 0;
  private _awayScore: number = 0;
  public readonly startOrder: number;

  constructor(homeTeam: string, awayTeam: string, startOrder: number) {
    validateTeams(homeTeam, awayTeam);

    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.startOrder = startOrder;
  }

  get homeScore(): number {
    return this._homeScore;
  }

  get awayScore(): number {
    return this._awayScore;
  }

  updateScore(homeScore: number, awayScore: number): void {
    validateScore(homeScore);
    validateScore(awayScore);

    this._homeScore = homeScore;
    this._awayScore = awayScore;
  }

  totalScore(): number {
    return this._homeScore + this._awayScore;
  }
}
