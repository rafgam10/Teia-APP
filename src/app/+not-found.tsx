import { router } from 'expo-router';
import { EmptyState, Screen } from '@/components/UI';

export default function NotFound() {
  return <Screen><EmptyState title="Essa página não existe" message="Volte ao início para continuar sua jornada." action="Voltar ao início" onAction={() => router.replace('/(tabs)')} /></Screen>;
}
