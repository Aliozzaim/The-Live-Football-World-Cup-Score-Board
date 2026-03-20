import { performance } from 'perf_hooks';
import { Scoreboard } from '@/lib/Scoreboard';
import { Teams, Errors } from '@/constants';

describe('Scoreboard', () => {
  let board: Scoreboard;
  const NUM_MATCHES = 100;

  beforeEach(() => {
    board = new Scoreboard();
  });

  const startAndScore = (home: string, away: string, homeScore = 0, awayScore = 0) => {
    board.startMatch(home, away);
    if (homeScore !== 0 || awayScore !== 0) {
      board.updateScore(home, away, homeScore, awayScore);
    }
  };

  describe('Start Match', () => {
    it('Given two different teams, When a match is started, Then it should add the match with 0-0 score', () => {
      startAndScore(Teams.MEXICO, Teams.CANADA);
      const summary = board.getSummary();

      expect(summary).toHaveLength(1);
      expect(summary[0].homeTeam).toBe(Teams.MEXICO);
      expect(summary[0].awayTeam).toBe(Teams.CANADA);
      expect(summary[0].homeScore).toBe(0);
      expect(summary[0].awayScore).toBe(0);
    });

    it('Given identical teams, When a match is started, Then it should throw SAME_TEAM error', () => {
      expect(() => board.startMatch(Teams.A, Teams.A)).toThrow(Errors.SAME_TEAM);
    });
  });

  describe('Update Score', () => {
    it('Given an existing match, When scores are updated, Then it should correctly update the match scores', () => {
      startAndScore(Teams.MEXICO, Teams.CANADA, 1, 2);
      const match = board.getSummary()[0];
      expect(match.homeScore).toBe(1);
      expect(match.awayScore).toBe(2);
    });

    it('Given an existing match, When negative scores are provided, Then it should throw NEGATIVE_SCORE error', () => {
      startAndScore(Teams.A, Teams.B);
      expect(() => board.updateScore(Teams.A, Teams.B, -1, 2)).toThrow(Errors.INVALID_SCORE);
      expect(() => board.updateScore(Teams.A, Teams.B, 1, -2)).toThrow(Errors.INVALID_SCORE);
    });

    it('Given a non-existing match, When updating scores, Then it should throw MATCH_NOT_FOUND error', () => {
      expect(() => board.updateScore(Teams.A, Teams.B, 1, 1)).toThrow(Errors.MATCH_NOT_FOUND);
    });
  });

  describe('Finish Match', () => {
    it('Given an existing match, When finishing the match, Then it should remove the match from the scoreboard', () => {
      startAndScore(Teams.MEXICO, Teams.CANADA);
      board.finishMatch(Teams.MEXICO, Teams.CANADA);
      expect(board.getSummary()).toHaveLength(0);
    });

    it('Given a non-existing match, When finishing the match, Then it should throw MATCH_NOT_FOUND error', () => {
      expect(() => board.finishMatch(Teams.A, Teams.B)).toThrow(Errors.MATCH_NOT_FOUND);
    });
  });

  describe('Summary & Ordering', () => {
    it('Given multiple matches, When summarizing, Then matches should be ordered by total score descending and by recency for ties', () => {
      startAndScore(Teams.A, Teams.B, 1, 1);
      startAndScore(Teams.C, Teams.D, 3, 2);
      startAndScore(Teams.E, Teams.F, 1, 1);

      const summary = board.getSummary();
      expect(summary[0].homeTeam).toBe(Teams.C);
      expect(summary[1].homeTeam).toBe(Teams.E);
      expect(summary[2].homeTeam).toBe(Teams.A);
    });

    it('Given example matches from requirements, When summarizing, Then it should return matches in correct order', () => {
      startAndScore(Teams.MEXICO, Teams.CANADA, 0, 5);
      startAndScore(Teams.SPAIN, Teams.BRAZIL, 10, 2);
      startAndScore(Teams.GERMANY, Teams.FRANCE, 2, 2);
      startAndScore(Teams.URUGUAY, Teams.ITALY, 6, 6);
      startAndScore(Teams.ARGENTINA, Teams.AUSTRALIA, 3, 1);

      const summary = board.getSummary();

      expect(
        summary.map((m) => `${m.homeTeam} ${m.homeScore} - ${m.awayTeam} ${m.awayScore}`),
      ).toEqual([
        `${Teams.URUGUAY} 6 - ${Teams.ITALY} 6`,
        `${Teams.SPAIN} 10 - ${Teams.BRAZIL} 2`,
        `${Teams.MEXICO} 0 - ${Teams.CANADA} 5`,
        `${Teams.ARGENTINA} 3 - ${Teams.AUSTRALIA} 1`,
        `${Teams.GERMANY} 2 - ${Teams.FRANCE} 2`,
      ]);
    });
  });

  describe('Performance Tests', () => {
    it('Given 100 matches, When summarizing, Then it should complete within reasonable time', () => {
      for (let i = 0; i < NUM_MATCHES; i++) {
        startAndScore(`Home${i}`, `Away${i}`, i % 5, i % 3);
      }

      const startTime = performance.now();
      const summary = board.getSummary();
      const endTime = performance.now();

      console.log(`Summary of ${NUM_MATCHES} matches took ${(endTime - startTime).toFixed(2)} ms`);
      expect(summary).toHaveLength(NUM_MATCHES);
      expect(endTime - startTime).toBeLessThan(500);
    });

    it('Given 100 matches, When updating scores frequently, Then it should stay performant', () => {
      for (let i = 0; i < NUM_MATCHES; i++) startAndScore(`Home${i}`, `Away${i}`);

      const startTime = performance.now();
      for (let j = 0; j < 100; j++) {
        for (let i = 0; i < NUM_MATCHES; i++) {
          board.updateScore(`Home${i}`, `Away${i}`, j % 10, i % 7);
        }
      }
      const endTime = performance.now();

      console.log(
        `100 update cycles for ${NUM_MATCHES} matches took ${(endTime - startTime).toFixed(2)} ms`,
      );
      expect(board.getSummary()).toHaveLength(NUM_MATCHES);
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Negative Tests', () => {
    it('Given extremely large scores, When updating score, Then it should handle correctly', () => {
      const LARGE_SCORE = Number.MAX_SAFE_INTEGER;
      startAndScore(Teams.A, Teams.B, LARGE_SCORE, LARGE_SCORE);

      const match = board.getSummary()[0];
      expect(match.homeScore).toBe(LARGE_SCORE);
      expect(match.awayScore).toBe(LARGE_SCORE);
    });

    it('Given multiple matches with same teams but different casing, When starting match, Then behavior should be consistent', () => {
      startAndScore(Teams.A, Teams.B);
      expect(() => board.startMatch(Teams.A, Teams.B)).toThrow(Errors.MATCH_EXISTS);
    });

    it('should throw error for invalid input types', () => {
      startAndScore(Teams.A, Teams.B);

      // Ai generated test data
      const invalidInputs = [
        { home: '1', away: 2 },
        { home: 1, away: '2' },
        { home: null, away: 2 },
        { home: 1, away: null },
        { home: undefined, away: 2 },
        { home: 1, away: undefined },
        { home: NaN, away: 2 },
        { home: 1, away: NaN },
      ];

      invalidInputs.forEach(({ home, away }) => {
        // @ts-expect-error intentionally passing invalid types
        expect(() => board.updateScore(Teams.A, Teams.B, home, away)).toThrow();
      });
    });
  });
});
