import type { ReactNode } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';

export function Screen({ children, tab = false }: { children: ReactNode; tab?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={tab ? 0 : insets.top + 56}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" style={s.screen}
        contentContainerStyle={[s.content, {
          paddingTop: 20 + (tab ? insets.top : 0), paddingBottom: 32 + (tab ? 0 : insets.bottom),
          paddingLeft: Math.max(20, insets.left), paddingRight: Math.max(20, insets.right),
        }]}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={s.pageTitle}><Text accessibilityRole="header" style={s.title}>{title}</Text>{subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}</View>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Btn({ title, onPress, secondary = false, disabled = false, loading = false, danger = false, style }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading} onPress={onPress}
      style={({ pressed }) => [s.btn, secondary && s.btnSecondary, danger && s.dangerButton, style, pressed && s.pressed, (disabled || loading) && s.disabled]}>
      {loading && <ActivityIndicator color={secondary ? C.primary : C.white} size="small" />}
      <Text style={[s.btnText, secondary && { color: C.primary }, danger && { color: C.white }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, error, style, ...props }: { label: string; error?: string } & TextInputProps) {
  return <View style={s.field}>
    <Text style={s.label}>{label}</Text>
    <TextInput accessibilityLabel={label} accessibilityHint={error} placeholderTextColor={C.muted}
      {...props} style={[s.input, props.multiline && s.multiline, error && s.inputError, style]} />
    {error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </View>;
}

export function Tag({ text }: { text: string }) {
  return <View style={s.tag}><Text style={s.tagText}>{text}</Text></View>;
}

export function ProgressBar({ percent, inverse = false }: { percent: number; inverse?: boolean }) {
  const value = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: value }} accessibilityLabel="Progresso"
    style={[s.progressTrack, inverse && { backgroundColor: '#477F6B' }]}>
    <View style={{ width: `${value}%`, height: '100%', borderRadius: 8, backgroundColor: inverse ? C.lime : C.primary }} />
  </View>;
}

export function DemoNotice({ message = 'Resultados simulados, sem IA e sem envio de documentos. Não representam chance de contratação.' }: { message?: string }) {
  return <View style={s.notice}><Ionicons name="information-circle-outline" size={21} color={C.primary} /><View style={s.flex}>
    <Text style={s.noticeTitle}>MODO DEMONSTRAÇÃO</Text><Text style={s.small}>{message}</Text>
  </View></View>;
}

export function EmptyState({ title, message, action, onAction }: { title: string; message: string; action?: string; onAction?: () => void }) {
  return <Card style={s.empty}><Ionicons name="leaf-outline" size={36} color={C.primary} /><Text style={s.sectionTitle}>{title}</Text>
    <Text style={[s.muted, { textAlign: 'center' }]}>{message}</Text>{action && onAction && <Btn title={action} onPress={onAction} />}</Card>;
}

export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel }: {
  visible: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={s.modalBackdrop}><View accessibilityViewIsModal style={s.modalCard}>
      <Text accessibilityRole="header" style={s.sectionTitle}>{title}</Text><Text style={s.body}>{message}</Text>
      <Btn title={confirmLabel} danger onPress={onConfirm} /><Btn title="Cancelar" secondary onPress={onCancel} />
    </View></View>
  </Modal>;
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', flexGrow: 1 },
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  pageTitle: { marginBottom: 22 },
  title: { fontSize: 27, fontWeight: '800', color: C.text },
  subtitle: { color: C.muted, fontSize: 14, marginTop: 7, lineHeight: 21 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 10 },
  body: { fontSize: 14, color: C.text, lineHeight: 22 },
  muted: { fontSize: 14, color: C.muted, lineHeight: 21 },
  small: { fontSize: 12, color: C.muted, lineHeight: 18 },
  strong: { color: C.text, fontWeight: '800', fontSize: 15 },
  link: { color: C.primary, fontWeight: '800', fontSize: 14 },
  card: { backgroundColor: C.white, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: C.line, marginBottom: 14 },
  btn: { minHeight: 50, backgroundColor: C.primary, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, marginTop: 10 },
  btnSecondary: { backgroundColor: C.white, borderWidth: 1, borderColor: C.primary },
  btnText: { color: C.white, fontWeight: '800', fontSize: 15, textAlign: 'center', flexShrink: 1 },
  dangerButton: { backgroundColor: C.danger, borderColor: C.danger },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
  field: { marginBottom: 17 },
  label: { color: C.text, fontWeight: '700', marginBottom: 7, fontSize: 14 },
  input: { minHeight: 50, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 15 },
  multiline: { minHeight: 112, textAlignVertical: 'top' },
  inputError: { borderColor: C.danger },
  error: { color: C.danger, fontSize: 13, lineHeight: 19, marginTop: 5 },
  success: { color: C.primary, fontSize: 14, lineHeight: 21, marginTop: 12 },
  tag: { backgroundColor: C.soft, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10, marginRight: 7, marginBottom: 7 },
  tagText: { fontSize: 12, color: C.primary, fontWeight: '700' },
  progressTrack: { height: 10, backgroundColor: C.soft, borderRadius: 8, overflow: 'hidden', marginVertical: 10 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.soft, padding: 14, borderRadius: 14, marginBottom: 18 },
  noticeTitle: { color: C.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 4 },
  empty: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  modalBackdrop: { flex: 1, backgroundColor: '#102E2899', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: C.bg, width: '100%', maxWidth: 440, borderRadius: 22, padding: 24 },
});
