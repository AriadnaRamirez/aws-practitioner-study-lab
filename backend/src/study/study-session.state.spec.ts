import {
  flashScopeOf,
  parseState,
  serializeState,
  type SessionRuntimeState,
} from './study-session.state';

describe('flashScopeOf', () => {
  it('returns the scope topics and the partida rápida flag', () => {
    expect(
      flashScopeOf('["topic-linux","topic-security"]', { balanced: true }),
    ).toEqual({ topicIds: ['topic-linux', 'topic-security'], balanced: true });
  });

  it('treats an empty scope as the whole bank, not balanced', () => {
    expect(flashScopeOf('[]', {})).toEqual({ topicIds: [], balanced: false });
  });

  it('ignores malformed or non-string scopes', () => {
    expect(flashScopeOf('not json', {})).toEqual({
      topicIds: [],
      balanced: false,
    });
    expect(flashScopeOf('[{"itemId":"x"},"topic-a"]', {})).toEqual({
      topicIds: ['topic-a'],
      balanced: false,
    });
  });
});

describe('parseState', () => {
  const base: SessionRuntimeState = {
    queue: [],
    current: null,
    masteredItemIds: [],
  };

  it('keeps the balanced flag across a serialize round-trip', () => {
    const state = parseState(serializeState({ ...base, balanced: true }));
    expect(state.balanced).toBe(true);
    expect(flashScopeOf('["topic-a"]', state).balanced).toBe(true);
  });

  it('omits balanced for legacy states', () => {
    expect(parseState(serializeState(base))).not.toHaveProperty('balanced');
  });
});
