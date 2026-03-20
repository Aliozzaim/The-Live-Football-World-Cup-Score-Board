export const Teams = {
  MEXICO: 'Mexico',
  CANADA: 'Canada',
  SPAIN: 'Spain',
  BRAZIL: 'Brazil',
  GERMANY: 'Germany',
  FRANCE: 'France',
  URUGUAY: 'Uruguay',
  ITALY: 'Italy',
  ARGENTINA: 'Argentina',
  AUSTRALIA: 'Australia',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
} as const;

export const Errors = {
  SAME_TEAM: 'Teams must be different',
  MATCH_EXISTS: 'Match already exists',
  MATCH_NOT_FOUND: 'Match not found',
  NEGATIVE_SCORE: 'Scores cannot be negative',
  INVALID_SCORE_TYPE: 'Score must be a number',
  INVALID_SCORE: 'Score must be a non-negative integer',
  TEAMS_NOT_DEFINED: 'Both home and away teams must be defined',
} as const;
