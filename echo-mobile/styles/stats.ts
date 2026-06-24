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
  pageTitle: {
    ...Typography.h1,
    color: Neutral.text,
    marginBottom: Spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Neutral.card,
    borderWidth: 1,
    borderColor: Neutral.border,
    marginHorizontal: 2,
  },
  chipActive: {
    backgroundColor: Accent.primary,
    borderColor: Accent.primary,
  },
  chipText: {
    ...Typography.captionBold,
    color: Neutral.textSecondary,
  },
  chipTextActive: {
    color: Neutral.textInverse,
  },
  scopeChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Neutral.card,
    borderWidth: 1,
    borderColor: Neutral.borderLight,
    marginHorizontal: 2,
  },
  scopeChipActive: {
    backgroundColor: Accent.primaryBg,
    borderColor: Accent.primary,
  },
  scopeText: {
    ...Typography.captionBold,
    color: Neutral.textTertiary,
  },
  scopeTextActive: {
    color: Accent.primary,
  },
  quickFacts: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Neutral.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  factsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  factCard: {
    flex: 1,
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.card,
  },
  factValue: {
    ...Typography.h2,
    color: Accent.primary,
  },
  factLabel: {
    ...Typography.micro,
    color: Neutral.textSecondary,
    marginTop: 4,
  },
  gridSection: {
    marginBottom: Spacing.lg,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: Accent.primaryBg,
  },
  exportText: {
    ...Typography.captionBold,
    color: Accent.primary,
  },
});
