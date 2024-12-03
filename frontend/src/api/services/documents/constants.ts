import { BEED_BASE_URL } from "@api/constants";

const MATERIALS_API = "/api/materials";

export const UPLOAD_DOCUMENTS_API = () =>
	BEED_BASE_URL + MATERIALS_API + "/document/";
