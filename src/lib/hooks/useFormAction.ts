import { useEffect, useActionState } from "react";

interface BaseState {
  success?: boolean;
  [key: string]: unknown;
}

type UseFormActionOptions<TState> = {
  onSuccess?: (result: TState) => void;
};

export function useFormAction<TState extends BaseState>(
  actionHandler: (formData: FormData) => Promise<TState>,
  initialState: TState,
  options?: UseFormActionOptions<TState>
) {
  const adapter = async (
    _prevState: Awaited<TState>,
    formData: FormData
  ): Promise<TState> => {
    return actionHandler(formData);
  };

  const [state, formAction, isPending] = useActionState<TState, FormData>(
    adapter,
    initialState as Awaited<TState>
  );

  useEffect(() => {
    if (state.success && options?.onSuccess) {
      try {
        options.onSuccess(state as TState);
      } catch (e) {
      }
    }
  }, [state, options]);

  return [state, formAction, isPending] as const;
}

export default useFormAction;