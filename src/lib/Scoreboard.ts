import { Match } from './Match';
import { Errors } from '@/constants';
import { findMatch, matchExists } from '@/lib/helpers';
export class Scoreboard {
  private matches: Match[] = [];
  private currentOrder = 0;

  private sortedCache: Match[] | null = null;
  private isDirty = true;

  startMatch(home: string, away: string): void {
    if (matchExists(this.matches, home, away)) {
      throw new Error(Errors.MATCH_EXISTS);
    }

    const match = new Match(home, away, this.currentOrder++);
    this.matches.push(match);

    this.isDirty = true;
  }

  updateScore(home: string, away: string, homeScore: number, awayScore: number): void {
    const match = findMatch(this.matches, home, away);

    match.updateScore(homeScore, awayScore);

    this.isDirty = true;
  }

  finishMatch(home: string, away: string): void {
    const index = this.matches.findIndex((m) => m.homeTeam === home && m.awayTeam === away);

    if (index === -1) {
      throw new Error(Errors.MATCH_NOT_FOUND);
    }

    this.matches.splice(index, 1);

    this.isDirty = true;
  }

  getSummary(): readonly Match[] {
    if (!this.isDirty && this.sortedCache) {
      return [...this.sortedCache];
    }

    this.sortedCache = [...this.matches].sort((a, b) => {
      const aScore = a.homeScore + a.awayScore;
      const bScore = b.homeScore + b.awayScore;

      const scoreDiff = bScore - aScore;
      if (scoreDiff !== 0) return scoreDiff;

      return b.startOrder - a.startOrder;
    });

    this.isDirty = false;

    return [...this.sortedCache];
  }
}
