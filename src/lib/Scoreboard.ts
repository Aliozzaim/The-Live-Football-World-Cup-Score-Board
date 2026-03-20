import { Match } from './Match';
import { Errors } from '@/constants';

export class Scoreboard {
  private matches: Match[] = [];
  private currentOrder = 0;

  startMatch(home: string, away: string): void {
    if (this.matches.find((m) => m.homeTeam === home && m.awayTeam === away)) {
      throw new Error(Errors.MATCH_EXISTS);
    }

    const match = new Match(home, away, this.currentOrder++);
    this.matches.push(match);
  }

  updateScore(home: string, away: string, homeScore: number, awayScore: number): void {
    const match = this.matches.find((m) => m.homeTeam === home && m.awayTeam === away);
    if (!match) throw new Error(Errors.MATCH_NOT_FOUND);

    match.updateScore(homeScore, awayScore);
  }

  finishMatch(home: string, away: string): void {
    const index = this.matches.findIndex((m) => m.homeTeam === home && m.awayTeam === away);
    if (index === -1) throw new Error(Errors.MATCH_NOT_FOUND);

    this.matches.splice(index, 1);
  }

  getSummary(): readonly Match[] {
    return [...this.matches].sort((a, b) => {
      const scoreDiff = b.totalScore() - a.totalScore();
      if (scoreDiff !== 0) return scoreDiff;
      return b.startOrder - a.startOrder; // newest first
    });
  }
}
