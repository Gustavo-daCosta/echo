import { StyleSheet } from 'react-native';
import { Accent, Neutral, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

export default StyleSheet.create({
  card: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
    marginBottom: Spacing.md,
  },
  top: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Accent.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    ...Typography.h2,
    color: Accent.primary,
  },
  dateMonth: {
    ...Typography.micro,
    color: Accent.primary,
    marginTop: -2,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...Typography.bodyBold,
    color: Neutral.text,
  },
  venue: {
    ...Typography.caption,
    color: Neutral.textSecondary,
  },
  distance: {
    ...Typography.micro,
    color: Accent.primary,
  },
  eventImage: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Neutral.borderLight,
  },
  matches: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Neutral.borderLight,
    gap: Spacing.xs,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Accent.primaryBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  matchIcon: {
    fontSize: 12,
  },
  matchText: {
    ...Typography.micro,
    color: Accent.primary,
  },
});
