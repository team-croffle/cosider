import { MODAL_IDS } from '~/constants/modal.const';

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: 'error' | 'primary' | 'neutral' | 'warning';
};

type ConfirmResolver = (confirmed: boolean) => void;

/** Kept outside useState so we never store functions in serializable modal payloads. */
let pendingResolve: ConfirmResolver | null = null;

function settle(confirmed: boolean) {
  const resolve = pendingResolve;
  pendingResolve = null;
  resolve?.(confirmed);
}

/**
 * Promise-based confirm dialog.
 * Call `confirm(options)` from pages/features; mount OverlayConfirm once in app.vue.
 */
export function useConfirm() {
  const { isOpen, payload, open, close } = useModal(MODAL_IDS.CONFIRM);

  const data = computed(() => (payload.value as ConfirmOptions | undefined) ?? {});

  function confirm(options: ConfirmOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      if (pendingResolve) {
        pendingResolve(false);
        pendingResolve = null;
      }
      pendingResolve = resolve;
      open(options);
    });
  }

  function accept() {
    settle(true);
    close();
  }

  function dismiss() {
    settle(false);
    close();
  }

  return {
    isOpen,
    data,
    confirm,
    accept,
    dismiss,
  };
}
