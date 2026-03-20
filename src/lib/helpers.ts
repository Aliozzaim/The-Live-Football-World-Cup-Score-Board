import type { Match } from './Match';
import { Errors } from '@/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isInteger(value: unknown): boolean {
  return Number.isInteger(value);
}

export function isFiniteNumber(value: unknown): boolean {
  return Number.isFinite(value);
}

export function validateTeams(home: string, away: string): void {
  if (!isString(home) || !isString(away) || !home.trim() || !away.trim()) {
    throw new Error(Errors.TEAMS_NOT_DEFINED);
  }

  if (home === away) {
    throw new Error(Errors.SAME_TEAM);
  }
}

export function validateScore(score: number): void {
  if (!isNumber(score)) {
    throw new Error(Errors.INVALID_SCORE_TYPE);
  }

  if (!Number.isFinite(score) || Number.isNaN(score)) {
    throw new Error(Errors.INVALID_SCORE);
  }

  if (!Number.isInteger(score) || score < 0) {
    throw new Error(Errors.INVALID_SCORE);
  }
}

export function findMatch(matches: Match[], homeTeam: string, awayTeam: string): Match {
  const match = matches.find((m) => m.homeTeam === homeTeam && m.awayTeam === awayTeam);
  if (!match) {
    throw new Error(Errors.MATCH_NOT_FOUND);
  }
  return match;
}

export function matchExists(matches: Match[], homeTeam: string, awayTeam: string): boolean {
  return matches.some((m) => m.homeTeam === homeTeam && m.awayTeam === awayTeam);
}
