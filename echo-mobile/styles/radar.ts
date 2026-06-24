import { StyleSheet } from 'react-native';
import {
  Accent,
  Neutral,
  Radius,
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
  pageTitle: {
    ...Typography.h1,
    color: Neutral.text,
    marginBottom: Spacing.lg,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  locationBannerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Accent.primaryBg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Accent.primary,
  },
  locationText: {
    ...Typography.body,
    color: Neutral.textTertiary,
  },
  locationTextActive: {
    ...Typography.bodyBold,
    color: Accent.primary,
    flex: 1,
  },
  refreshBtn: {
    padding: 4,
  },
  locationPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Accent.primaryBg,
    borderStyle: 'dashed',
  },
  locationPromptText: {
    ...Typography.body,
    color: Accent.primary,
    flex: 1,
  },
  matchInfo: {
    marginBottom: Spacing.lg,
  },
  matchLabel: {
    ...Typography.caption,
    color: Neutral.textTertiary,
  },
  loadingState: {
    paddingVertical: Spacing.huge,
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: Neutral.textTertiary,
  },
  emptyState: {
    paddingVertical: Spacing.huge,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Neutral.textSecondary,
  },
  emptyDesc: {
    ...Typography.body,
    color: Neutral.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
  feed: {
    gap: Spacing.md,
  },
  feedCount: {
    ...Typography.captionBold,
    color: Neutral.textSecondary,
    marginBottom: Spacing.xs,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Accent.primaryBg,
    borderStyle: 'dashed',
  },
  demoBtnText: {
    ...Typography.bodyBold,
    color: Accent.primary,
  },
});
