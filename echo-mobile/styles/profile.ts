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
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
    marginBottom: Spacing.xxl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Neutral.borderLight,
    borderWidth: 2,
    borderColor: Accent.primaryBg,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Neutral.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityMeta: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    ...Typography.h3,
    color: Neutral.text,
  },
  email: {
    ...Typography.caption,
    color: Neutral.textSecondary,
  },
  tierBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Accent.primaryBg,
  },
  tierText: {
    ...Typography.micro,
    color: Accent.primary,
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
  cacheCard: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  cacheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  cacheItem: {
    alignItems: 'center',
  },
  cacheValue: {
    ...Typography.h3,
    color: Accent.primary,
  },
  cacheLabel: {
    ...Typography.micro,
    color: Neutral.textSecondary,
    marginTop: 2,
  },
  storageBar: {
    gap: 4,
  },
  storageBarTrack: {
    height: 6,
    backgroundColor: Neutral.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: Accent.primary,
    borderRadius: Radius.full,
  },
  settingsCard: {
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    ...Shadow.card,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    ...Typography.body,
    color: Neutral.text,
  },
  divider: {
    height: 1,
    backgroundColor: Neutral.borderLight,
    marginLeft: 52,
  },
  logoutButton: {
    marginTop: Spacing.sm,
    backgroundColor: Neutral.card,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    ...Typography.bodyBold,
    color: '#EF4444',
  },
  version: {
    ...Typography.caption,
    color: Neutral.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
