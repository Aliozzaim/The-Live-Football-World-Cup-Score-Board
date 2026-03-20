/* eslint-disable @typescript-eslint/no-explicit-any */
import { Match } from '@/lib/Match';
import { Teams, Errors } from '@/constants';

describe('Match', () => {
  let match: Match;

  const createMatch = (home: string, away: string, homeScore = 0, awayScore = 0, order = 0) => {
    const match = new Match(home, away, order);
    if (homeScore !== 0 || awayScore !== 0) match.updateScore(homeScore, awayScore);
    return match;
  };

  describe('Initialization', () => {
    it('Given two valid teams, When a match is created, Then it should have 0-0 score', () => {
      match = createMatch(Teams.MEXICO, Teams.CANADA);

      expect(match.homeTeam).toBe(Teams.MEXICO);
      expect(match.awayTeam).toBe(Teams.CANADA);
      expect(match.homeScore).toBe(0);
      expect(match.awayScore).toBe(0);
    });

    it('Given identical teams, When a match is created, Then it should throw SAME_TEAM error', () => {
      expect(() => createMatch(Teams.A, Teams.A)).toThrow(Errors.SAME_TEAM);
    });

    it('Given empty team names, When creating match, Then it should throw TEAMS_NOT_DEFINED', () => {
      expect(() => createMatch('', Teams.B)).toThrow(Errors.TEAMS_NOT_DEFINED);
      expect(() => createMatch(Teams.A, '')).toThrow(Errors.TEAMS_NOT_DEFINED);
    });

    it('Given non-string teams, When creating match, Then it should throw TEAMS_NOT_DEFINED', () => {
      expect(() => createMatch(123 as any, Teams.B)).toThrow(Errors.TEAMS_NOT_DEFINED);
      expect(() => createMatch(Teams.A, null as any)).toThrow(Errors.TEAMS_NOT_DEFINED);
    });
  });

  describe('Score Updates', () => {
    beforeEach(() => {
      match = createMatch(Teams.A, Teams.B);
    });

    it('Given a match, When scores are updated, Then the scores should reflect the new values', () => {
      match.updateScore(3, 2);

      expect(match.homeScore).toBe(3);
      expect(match.awayScore).toBe(2);
      expect(match.totalScore()).toBe(5);
    });

    it('Given negative scores, When updating score, Then it should throw INVALID_SCORE error', () => {
      expect(() => match.updateScore(-1, 2)).toThrow(Errors.INVALID_SCORE);
      expect(() => match.updateScore(1, -2)).toThrow(Errors.INVALID_SCORE);
    });

    it('Given zero scores, When updating score, Then totalScore should be zero', () => {
      match.updateScore(0, 0);
      expect(match.totalScore()).toBe(0);
    });

    it('Given multiple updates, When scores change frequently, Then the latest score is correct', () => {
      match.updateScore(1, 1);
      match.updateScore(2, 3);
      match.updateScore(0, 5);

      expect(match.homeScore).toBe(0);
      expect(match.awayScore).toBe(5);
      expect(match.totalScore()).toBe(5);
    });

    it('Given decimal scores, When updating score, Then it should reject non-integer values', () => {
      expect(() => match.updateScore(1.5, 2)).toThrow();
    });

    it('Given NaN or Infinity, When updating score, Then it should throw error', () => {
      expect(() => match.updateScore(NaN, 1)).toThrow();
      expect(() => match.updateScore(Infinity, 1)).toThrow();
    });

    it('Given extremely large numbers, When updating score, Then it should handle safely', () => {
      const large = Number.MAX_SAFE_INTEGER;

      match.updateScore(large, large);
      expect(match.totalScore()).toBe(large * 2);
    });
  });

  describe('Recency & Sorting', () => {
    it('Given two matches, When created sequentially, Then startOrder reflects creation order', () => {
      const first = createMatch(Teams.A, Teams.B, 0, 0, 0);
      const second = createMatch(Teams.C, Teams.D, 0, 0, 1);

      expect(first.startOrder).toBeLessThan(second.startOrder);
    });

    it('Given equal total scores, When sorting, Then newer match should come first', () => {
      const m1 = createMatch(Teams.A, Teams.B, 2, 2, 0);
      const m2 = createMatch(Teams.C, Teams.D, 1, 3, 1);

      const sorted = [m1, m2].sort((a, b) => {
        const scoreDiff = b.totalScore() - a.totalScore();
        if (scoreDiff !== 0) return scoreDiff;
        return b.startOrder - a.startOrder;
      });

      expect(sorted[0]).toBe(m2);
      expect(sorted[1]).toBe(m1);
    });
  });

  describe('Immutability & Data Integrity', () => {
    beforeEach(() => {
      match = createMatch(Teams.A, Teams.B);
    });

    it('Given score updates, When totalScore is called multiple times, Then it should always reflect latest values', () => {
      match.updateScore(1, 2);
      expect(match.totalScore()).toBe(3);

      match.updateScore(5, 5);
      expect(match.totalScore()).toBe(10);
    });
  });

  describe('Edge Cases & Stress', () => {
    it('Given many updates, When updating score repeatedly, Then final score should be correct', () => {
      match = createMatch(Teams.E, Teams.F);

      for (let i = 0; i < 1_000; i++) {
        match.updateScore(i % 10, i % 7);
      }

      expect(match.homeScore).toBe(999 % 10);
      expect(match.awayScore).toBe(999 % 7);
      expect(match.totalScore()).toBe((999 % 10) + (999 % 7));
    });
  });
});
