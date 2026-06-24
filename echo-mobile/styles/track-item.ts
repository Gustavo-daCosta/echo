import { StyleSheet } from 'react-native';
import { Neutral, Radius, Spacing, Typography } from '@/constants/theme';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rank: {
    ...Typography.h3,
    color: Neutral.textTertiary,
    width: 28,
    textAlign: 'center',
  },
  art: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Neutral.borderLight,
  },
  artPlaceholder: {
    backgroundColor: Neutral.borderLight,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...Typography.bodyBold,
    color: Neutral.text,
  },
  artist: {
    ...Typography.caption,
    color: Neutral.textSecondary,
  },
});
