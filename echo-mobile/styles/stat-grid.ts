import { StyleSheet } from 'react-native';
import { Accent, Neutral, Radius, Spacing, Typography } from '@/constants/theme';

export default StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  cell: {
    width: '30%',
    flexGrow: 1,
    flexBasis: '30%',
    marginBottom: Spacing.md,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.sm,
  },
  imagePlaceholder: {
    backgroundColor: Neutral.borderLight,
  },
  imageRound: {
    borderRadius: Radius.full,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: Accent.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.badge,
    color: Neutral.textInverse,
  },
  name: {
    ...Typography.captionBold,
    color: Neutral.text,
    marginTop: 6,
  },
  subtitle: {
    ...Typography.micro,
    color: Neutral.textSecondary,
    marginTop: 1,
  },
});
