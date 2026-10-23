import { useEffect, useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { documentMetadata, DOCUMENT_MIME_TYPES, validateDocument } from '../domain/validation';
import { createId } from '../store/utils';
import { useDemo } from '../store/useDemo';

export function useDocumentSelection() {
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(true);
  const busy = useRef(false);
  const setDocument = useDemo(state => state.setDocument);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);

  async function pick() {
    if (busy.current) return;
    busy.current = true;
    setPicking(true);
    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: DOCUMENT_MIME_TYPES, multiple: false, copyToCacheDirectory: false, base64: false,
      });
      if (!active.current || result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      const size = asset.size ?? asset.file?.size;
      const problem = validateDocument({ name: asset.name, size });
      if (problem || size === undefined) { setError(problem ?? 'Não foi possível verificar o documento.'); return; }
      setDocument(documentMetadata({ name: asset.name, size }, createId('document')));
    } catch {
      if (active.current) setError('Não foi possível abrir o seletor. Tente novamente ou use o currículo de demonstração.');
    } finally {
      busy.current = false;
      if (active.current) setPicking(false);
    }
  }
  return { pick, picking, error, clearError: () => setError('') };
}
