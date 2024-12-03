import { Document } from "@api/services/documents";

export interface DocumentItemProps {
	document: Document;
	onRemoveDocument: (documentsToRemove: number[]) => void;
}
