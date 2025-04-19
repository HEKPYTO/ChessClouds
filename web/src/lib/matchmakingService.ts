import { Color } from '@/types/shared';

export type MatchRequest = {
  user_id: string;
};

export type MatchResponse =
  | { result: 'Ok'; value: { game_id: string; color: Color } }
  | { result: 'Err'; value: string };

let matchmakingInstance: MatchMakingService | null = null;

export class MatchMakingService {
  private severUrl: string;
  private requestInProgresss: boolean = false;
  private abortController: AbortController | null = null;

  constructor(serverUrl: string = 'http://localhost:8001') {
    this.severUrl = serverUrl;
  }

  static getInstance(serverUrl?: string): MatchMakingService {
    if (!matchmakingInstance) {
      matchmakingInstance = new MatchMakingService(serverUrl);
    }
    return matchmakingInstance;
  }

  static resetInstace(): void {
    matchmakingInstance = null;
  }

  async findMatch(
    user_id: string
  ): Promise<{ game_id: string; color: 'w' | 'b' }> {
    if (this.requestInProgresss) {
      throw new Error('Macthing is already in progress');
    }

    this.requestInProgresss = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const response = await fetch(`${this.severUrl}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id }),
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to find match');
      }

      const matchResponse = (await response.json()) as MatchResponse;

      if (matchResponse.result === 'Err') {
        throw new Error(`Failed to find match: ${matchResponse.value}`);
      }

      const { game_id, color } = matchResponse.value;
      return {
        game_id,
        color: color === 'White' ? 'w' : 'b',
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Match finding aborted');
        throw new Error('Match finding was canceled');
      }
      console.error('Matchmaking error:', error);
      throw error;
    } finally {
      this.requestInProgresss = false;
      this.abortController = null;
    }
  }

  cancelMatch(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.requestInProgresss = false;
      this.abortController = null;
    }
  }
}
