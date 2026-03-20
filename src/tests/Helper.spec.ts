/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isString,
  isNumber,
  isInteger,
  isFiniteNumber,
  validateTeams,
  validateScore,
  findMatch,
  matchExists,
} from '@/lib/helpers';

import { Match } from '@/lib/Match';
import { Teams, Errors } from '@/constants';

describe('Helper function tests', () => {
  describe('Type Guards', () => {
    it('isString should return true for strings', () => {
      expect(isString('hello')).toBe(true);
    });

    it('isString should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });

    it('isNumber should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
    });

    it('isNumber should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(NaN)).toBe(true); // JS quirk
    });

    it('isInteger should correctly detect integers', () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger(5.5)).toBe(false);
    });

    it('isFiniteNumber should detect finite numbers', () => {
      expect(isFiniteNumber(10)).toBe(true);
      expect(isFiniteNumber(Infinity)).toBe(false);
      expect(isFiniteNumber(NaN)).toBe(false);
    });
  });

  describe('Validate Teams', () => {
    it('should pass for valid teams', () => {
      expect(() => validateTeams(Teams.A, Teams.B)).not.toThrow();
    });

    it('should throw if teams are the same', () => {
      expect(() => validateTeams(Teams.A, Teams.A)).toThrow(Errors.SAME_TEAM);
    });

    it('should throw if teams are empty', () => {
      expect(() => validateTeams('', Teams.B)).toThrow(Errors.TEAMS_NOT_DEFINED);

      expect(() => validateTeams(Teams.A, '')).toThrow(Errors.TEAMS_NOT_DEFINED);
    });

    it('should throw if teams are not strings', () => {
      expect(() => validateTeams(123 as any, Teams.B)).toThrow(Errors.TEAMS_NOT_DEFINED);

      expect(() => validateTeams(Teams.A, null as any)).toThrow(Errors.TEAMS_NOT_DEFINED);
    });

    it('should trim whitespace', () => {
      expect(() => validateTeams('   ', Teams.B)).toThrow(Errors.TEAMS_NOT_DEFINED);
    });
  });

  describe('Validate Score', () => {
    it('should pass for valid integer score', () => {
      expect(() => validateScore(5)).not.toThrow();
    });

    it('should throw if not a number', () => {
      expect(() => validateScore('5' as any)).toThrow(Errors.INVALID_SCORE_TYPE);
    });

    it('should throw for NaN or Infinity', () => {
      expect(() => validateScore(NaN)).toThrow(Errors.INVALID_SCORE);
      expect(() => validateScore(Infinity)).toThrow(Errors.INVALID_SCORE);
    });

    it('should throw for non-integers', () => {
      expect(() => validateScore(1.5)).toThrow(Errors.INVALID_SCORE);
    });

    it('should throw for negative numbers', () => {
      expect(() => validateScore(-1)).toThrow(Errors.INVALID_SCORE);
    });
  });

  describe('Match Helpers', () => {
    let matches: Match[];

    beforeEach(() => {
      const m1 = new Match(Teams.A, Teams.B, 0);
      const m2 = new Match(Teams.C, Teams.D, 1);

      matches = [m1, m2];
    });

    describe('findMatch', () => {
      it('should return the correct match', () => {
        const match = findMatch(matches, Teams.A, Teams.B);

        expect(match.homeTeam).toBe(Teams.A);
        expect(match.awayTeam).toBe(Teams.B);
      });

      it('should throw if match is not found', () => {
        expect(() => findMatch(matches, Teams.E, Teams.F)).toThrow(Errors.MATCH_NOT_FOUND);
      });
    });

    describe('matchExists', () => {
      it('should return true if match exists', () => {
        expect(matchExists(matches, Teams.A, Teams.B)).toBe(true);
      });

      it('should return false if match does not exist', () => {
        expect(matchExists(matches, Teams.E, Teams.F)).toBe(false);
      });
    });
  });
});
