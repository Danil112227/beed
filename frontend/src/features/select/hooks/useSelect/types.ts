export interface UseSelectProps<K> {
	defaultSelectedValue?: K;
}

export interface SelectValue<T> {
	value: T;
	label: string;
}

export type SelectedState<U> = U | null;
