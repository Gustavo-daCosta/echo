import * as SQLite from 'expo-sqlite';
import type { CachedTrack, ListeningStats } from '@/types';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('echo.db');
    await initialize();
  }
  return db;
}

async function initialize(): Promise<void> {
  const database = db!;
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS listening_history (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT NOT NULL,
      album_art TEXT,
      played_at TEXT NOT NULL,
      duration_ms INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      total_plays INTEGER NOT NULL DEFAULT 0,
      total_ms INTEGER NOT NULL DEFAULT 0,
      unique_artists INTEGER NOT NULL DEFAULT 0,
      unique_tracks INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_history_played_at
      ON listening_history(played_at DESC);

    CREATE INDEX IF NOT EXISTS idx_daily_stats_date
      ON daily_stats(date DESC);
  `);
}

export async function saveTrack(track: CachedTrack): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO listening_history
     (id, name, artist, album, album_art, played_at, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      track.id,
      track.name,
      track.artist,
      track.album,
      track.albumArt,
      track.playedAt,
      track.durationMs,
    ],
  );
}

export async function saveTracks(tracks: CachedTrack[]): Promise<void> {
  const database = await getDb();
  const stmt = await database.prepareAsync(
    `INSERT OR REPLACE INTO listening_history
     (id, name, artist, album, album_art, played_at, duration_ms)
     VALUES ($id, $name, $artist, $album, $albumArt, $playedAt, $durationMs)`,
  );

  for (const track of tracks) {
    await stmt.executeAsync({
      $id: track.id,
      $name: track.name,
      $artist: track.artist,
      $album: track.album,
      $albumArt: track.albumArt,
      $playedAt: track.playedAt,
      $durationMs: track.durationMs,
    });
  }
  await stmt.finalizeAsync();
}

export async function getRecentTracks(limit = 20): Promise<CachedTrack[]> {
  const database = await getDb();
  return database.getAllAsync<CachedTrack>(
    `SELECT * FROM listening_history ORDER BY played_at DESC LIMIT ?`,
    [limit],
  );
}

export async function getTrackCount(): Promise<number> {
  const database = await getDb();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM listening_history',
  );
  return result?.count ?? 0;
}

export async function updateDailyStats(
  date: string,
  plays: number,
  ms: number,
  uniqueArtists: number,
  uniqueTracks: number,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO daily_stats
     (date, total_plays, total_ms, unique_artists, unique_tracks)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       total_plays = total_plays + excluded.total_plays,
       total_ms = total_ms + excluded.total_ms,
       unique_artists = MAX(unique_artists, excluded.unique_artists),
       unique_tracks = MAX(unique_tracks, excluded.unique_tracks)`,
    [date, plays, ms, uniqueArtists, uniqueTracks],
  );
}

export async function getDailyStats(days = 7): Promise<ListeningStats[]> {
  const database = await getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];

  return database.getAllAsync<ListeningStats>(
    `SELECT * FROM daily_stats
     WHERE date >= ?
     ORDER BY date DESC`,
    [sinceStr],
  );
}

export async function getTotalListeningMs(): Promise<number> {
  const database = await getDb();
  // Try daily_stats first, fall back to listening_history
  const result = await database.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(
      (SELECT SUM(total_ms) FROM daily_stats),
      (SELECT SUM(duration_ms) FROM listening_history),
      0
    ) as total`,
  );
  return result?.total ?? 0;
}

export async function getMostPlayedArtist(): Promise<string | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<{ artist: string }>(
    `SELECT artist, COUNT(*) as cnt
     FROM listening_history
     GROUP BY artist
     ORDER BY cnt DESC
     LIMIT 1`,
  );
  return result?.artist ?? null;
}

export async function getMostActiveDay(): Promise<string | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<{ date: string }>(
    `SELECT date FROM daily_stats
     ORDER BY total_plays DESC
     LIMIT 1`,
  );
  return result?.date ?? null;
}

export async function getDatabaseSize(): Promise<number> {
  const database = await getDb();
  const result = await database.getFirstAsync<{ size: number }>(
    "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()",
  );
  return result?.size ?? 0;
}

export async function clearHistory(): Promise<void> {
  const database = await getDb();
  await database.execAsync('DELETE FROM listening_history');
}

export async function clearAll(): Promise<void> {
  const database = await getDb();
  await database.execAsync('DELETE FROM listening_history');
  await database.execAsync('DELETE FROM daily_stats');
}
