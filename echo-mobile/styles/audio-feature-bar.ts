import { StyleSheet } from 'react-native';
import { Neutral, Radius, Spacing, Typography } from '@/constants/theme';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Neutral.textSecondary,
    width: 90,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Neutral.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  value: {
    ...Typography.captionBold,
    color: Neutral.text,
    width: 36,
    textAlign: 'right',
  },
});
