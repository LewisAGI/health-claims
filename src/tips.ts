/** Hover labels are CSS. Touch and coarse pointers reveal the same label after a press. */
export function installTips(): () => void {
  let pressTimer: ReturnType<typeof setTimeout> | null = null;

  const clearLongTip = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = null;
    document.querySelectorAll('.is-long-tip').forEach((node) => node.classList.remove('is-long-tip'));
  };

  const onDown = (event: PointerEvent) => {
    clearLongTip();
    const element = event.target instanceof Element ? event.target : null;
    const tipHost = element?.closest<HTMLElement>('[data-tip]');
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (tipHost && (!fineHover || event.pointerType === 'touch')) {
      pressTimer = setTimeout(() => tipHost.classList.add('is-long-tip'), 500);
    }
  };

  document.addEventListener('pointerdown', onDown);
  document.addEventListener('pointerup', clearLongTip);
  document.addEventListener('pointercancel', clearLongTip);
  return () => {
    clearLongTip();
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', clearLongTip);
    document.removeEventListener('pointercancel', clearLongTip);
  };
}
