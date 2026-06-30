export function useModal(modalId: string) {
  // Global Modal Stack
  const activeModals = useState<string[]>('active-modals', () => []);

  // Modal Payload
  const modalPayloads = useState<Record<string, unknown>>('modal-payloads', () => ({}));

  const isOpen = computed(() => activeModals.value.includes(modalId));
  const payload = computed(() => modalPayloads.value[modalId]);

  function open(data?: unknown) {
    if (!isOpen.value) {
      activeModals.value.push(modalId);
    }
    if (data) {
      modalPayloads.value[modalId] = data;
    }
  }

  function close() {
    activeModals.value = activeModals.value.filter((id) => id !== modalId);
    const { [modalId]: _, ...restPayloads } = modalPayloads.value;
    modalPayloads.value = restPayloads;
  }

  return {
    isOpen,
    payload,
    open,
    close,
  };
}
