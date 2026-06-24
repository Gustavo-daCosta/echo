import { StyleSheet } from 'react-native';
import { Accent, Neutral, Radius, Shadow, Typography, Spacing } from '@/constants/theme';

export default StyleSheet.create({
  card: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.captionBold,
    color: Neutral.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Accent.primary,
  },
  trackInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  albumArt: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    backgroundColor: Neutral.borderLight,
  },
  albumArtPlaceholder: {
    backgroundColor: Neutral.borderLight,
  },
  trackMeta: {
    flex: 1,
    gap: 2,
  },
  trackName: {
    ...Typography.h3,
    color: Neutral.text,
  },
  artistName: {
    ...Typography.body,
    color: Neutral.textSecondary,
  },
  albumName: {
    ...Typography.caption,
    color: Neutral.textTertiary,
  },
  empty: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Neutral.textSecondary,
  },
  emptySub: {
    ...Typography.caption,
    color: Neutral.textTertiary,
    marginTop: 4,
  },
  skeleton: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  skeletonArt: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    backgroundColor: Neutral.borderLight,
  },
  skeletonText: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: Neutral.borderLight,
    borderRadius: 4,
    width: '80%',
  },
});
