import { StyleSheet } from 'react-native';
import {
  Accent,
  Neutral,
  Radius,
  Shadow,
  Spacing,
  Typography,
} from '@/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Neutral.bg,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.huge,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  greetingText: {
    ...Typography.body,
    color: Neutral.textSecondary,
  },
  userName: {
    ...Typography.h1,
    color: Neutral.text,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Neutral.borderLight,
    borderWidth: 2,
    borderColor: Accent.primaryBg,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Neutral.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  insightCard: {
    backgroundColor: Accent.primaryBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  insightIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  insightText: {
    ...Typography.body,
    color: Neutral.text,
    lineHeight: 22,
  },
  insightBold: {
    fontWeight: '700',
    color: Accent.primary,
  },
  insightSub: {
    ...Typography.caption,
    color: Neutral.textSecondary,
    marginTop: 4,
  },
  recentList: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadow.card,
  },
  emptyText: {
    ...Typography.caption,
    color: Neutral.textTertiary,
    paddingVertical: Spacing.xl,
    textAlign: 'center',
  },
});
