import { ref, watch, type Ref } from 'vue'

/**
 * Creates a debounced version of a reactive value
 * @param value - The reactive value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced reactive value
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout>

  watch(
    value,
    (newValue) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: false },
  )

  return debouncedValue
}
