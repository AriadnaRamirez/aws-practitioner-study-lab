import type { PodiumEntry } from '@aps/shared';
import { entriesForViewer } from './podium.service';

const entries: PodiumEntry[] = Array.from({ length: 8 }, (_, i) => ({
  rank: i + 1,
  userId: `u${i + 1}`,
  username: `user${i + 1}`,
  score: 20 - i,
}));

const ranks = (list: PodiumEntry[]) => list.map((e) => e.rank);

describe('entriesForViewer', () => {
  it('gives admins the full ranking', () => {
    expect(ranks(entriesForViewer(entries, { id: 'x', role: 'ADMIN' }))).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
  });

  it('gives a student the top 3, the entry above and themselves', () => {
    expect(ranks(entriesForViewer(entries, { id: 'u6', role: 'STUDENT' }))).toEqual(
      [1, 2, 3, 5, 6],
    );
  });

  it('does not duplicate entries when the student is near the top', () => {
    expect(ranks(entriesForViewer(entries, { id: 'u4', role: 'STUDENT' }))).toEqual(
      [1, 2, 3, 4],
    );
    expect(ranks(entriesForViewer(entries, { id: 'u2', role: 'STUDENT' }))).toEqual(
      [1, 2, 3],
    );
  });

  it('gives an unranked student only the top 3', () => {
    expect(ranks(entriesForViewer(entries, { id: 'nobody', role: 'STUDENT' }))).toEqual(
      [1, 2, 3],
    );
  });
});
