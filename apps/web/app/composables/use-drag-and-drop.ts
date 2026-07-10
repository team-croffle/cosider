export function useDragAndDrop<T>(initList: T[]) {
  const list = ref<T[]>(initList);
  const draggedIndex = ref<number | null>(null);
  const dropTargetIndex = ref<number | null>(null);

  function onDragStart(idx: number) {
    draggedIndex.value = idx;
  }

  function onDragEnter(idx: number) {
    if (draggedIndex.value === idx) {
      dropTargetIndex.value = null;
      return;
    }
    dropTargetIndex.value = idx;
  }

  function onDrop() {
    if (draggedIndex.value === null || dropTargetIndex.value === null) {
      return;
    }

    const [item] = list.value.splice(draggedIndex.value, 1);
    const from = draggedIndex.value;
    let to = dropTargetIndex.value;

    if (item !== undefined) {
      if (from < to) {
        to -= 1;
      }
      list.value.splice(to, 0, item);
    }

    // TODO: Server에 변경된 리스트 저장 API를 Call.
    // 해당 logic이 내장된 것이 아니라, 해당 API를 Call하는 CallBack함수를 인자로 받도록 변경

    draggedIndex.value = null;
    dropTargetIndex.value = null;
  }

  return {
    list,
    draggedIndex,
    dropTargetIndex,
    onDragStart,
    onDragEnter,
    onDrop,
  };
}
