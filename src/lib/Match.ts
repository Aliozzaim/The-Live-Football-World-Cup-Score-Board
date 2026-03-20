import { Errors } from '@/constants';
import { isString, isInteger, isFiniteNumber } from '@/lib/helpers';

export class Match {
  public readonly homeTeam: string;
  public readonly awayTeam: string;
  private _homeScore: number = 0;
  private _awayScore: number = 0;
  public readonly startOrder: number;

  constructor(homeTeam: string, awayTeam: string, startOrder: number) {
    this.validateTeams(homeTeam, awayTeam);

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
    this.validateScore(homeScore);
    this.validateScore(awayScore);

    this._homeScore = homeScore;
    this._awayScore = awayScore;
  }

  totalScore(): number {
    return this._homeScore + this._awayScore;
  }

  private validateTeams(home: string, away: string): void {
    if (!isString(home) || !isString(away) || !home || !away) {
      throw new Error(Errors.TEAMS_NOT_DEFINED);
    }
    if (home === away) {
      throw new Error(Errors.SAME_TEAM);
    }
  }

  private validateScore(score: number): void {
    if (!isFiniteNumber(score)) {
      throw new Error(Errors.INVALID_SCORE_TYPE);
    }
    if (!isInteger(score) || score < 0) {
      throw new Error(Errors.INVALID_SCORE);
    }
  }
}
