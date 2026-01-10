export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface ProgressRecord {
  unlockedLevels: number;
  unlockedPens: string[];
}

const DEFAULT_PROGRESS: ProgressRecord = {
  unlockedLevels: 1,
  unlockedPens: ['pencil-black']
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      if (typeof data?.error === 'string') {
        message = data.error;
      }
    } catch (_err) {
      // ignore parse errors; fall back to default message
    }
    throw new Error(message);
  }
  return response.json();
};

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const data = await handleResponse(await fetch('/api/me', { credentials: 'same-origin' }));
  if (!data?.user) {
    throw new Error('Missing user payload');
  }
  return data.user as AuthUser;
};

export const fetchProgress = async (): Promise<ProgressRecord> => {
  const data = await handleResponse(await fetch('/api/progress', { credentials: 'same-origin' }));
  if (!data?.progress) {
    return { ...DEFAULT_PROGRESS, unlockedPens: [...DEFAULT_PROGRESS.unlockedPens] };
  }
  return data.progress as ProgressRecord;
};

export const saveProgress = async (progress: ProgressRecord): Promise<void> => {
  await handleResponse(
    await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(progress)
    })
  );
};

export const signOut = async (): Promise<void> => {
  await handleResponse(
    await fetch('/api/sessionLogout', {
      method: 'POST',
      credentials: 'same-origin'
    })
  );
};
