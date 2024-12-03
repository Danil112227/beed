export interface DeleteDesciplineDialogProps {
	isVisible: boolean;
	disciplineName: string;
	disciplineId: number;
	onClose: () => void;
	invalidateQueryKeyOnSuccess: string;
}
