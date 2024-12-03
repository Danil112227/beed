import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Font } from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { List } from "@ckeditor/ckeditor5-list";
import { Indent } from "@ckeditor/ckeditor5-indent";
import { Link, AutoLink } from "@ckeditor/ckeditor5-link";

export const editorConfiguration = {
	plugins: [
		Essentials,
		Bold,
		Italic,
		Paragraph,
		Font,
		Heading,
		Alignment,
		List,
		Indent,
		Link,
		AutoLink,
	],
	toolbar: {
		items: [
			"undo",
			"redo",
			"heading",
			"bold",
			"link",
			"italic",
			"fontColor",
			"alignment",
			"bulletedList",
			"numberedList",
			"outdent",
			"indent",
		],
		shouldNotGroupWhenFull: true,
		addTargetToExternalLinks: true,
		link: {
			// Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
			addTargetToExternalLinks: true,

			// Let the users control the "download" attribute of each link.
			decorators: [
				{
					mode: "manual",
					label: "Downloadable",
					attributes: {
						download: "download",
					},
				},
			],
		},
	},
};
