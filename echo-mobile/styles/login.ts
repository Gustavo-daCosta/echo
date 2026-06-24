import { StyleSheet } from 'react-native';
import { Accent, Neutral, Radius, Spacing, Typography, Shadow } from '@/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Neutral.white,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge * 2,
    paddingBottom: Spacing.huge,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Accent.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  appName: {
    ...Typography.hero,
    fontSize: 40,
    color: Neutral.text,
  },
  tagline: {
    ...Typography.body,
    color: Neutral.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    gap: Spacing.lg,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Accent.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: Radius.xl,
    width: '100%',
    ...Shadow.card,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...Typography.h3,
    color: Neutral.textInverse,
    fontWeight: '600',
  },
  disclaimer: {
    ...Typography.caption,
    color: Neutral.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
