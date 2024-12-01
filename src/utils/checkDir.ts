import { existsSync, readdirSync } from "fs";

const VALID_PROJECT_DIRECTORY_SAFE_LIST = [
	'.DS_Store',
	'.git',
	'.gitkeep',
	'.gitattributes',
	'.gitignore',
	'.gitlab-ci.yml',
	'.hg',
	'.hgcheck',
	'.hgignore',
	'.idea',
	'.npmignore',
	'.travis.yml',
	'.yarn',
	'.yarnrc.yml',
	'docs',
	'LICENSE',
	'mkdocs.yml',
	'Thumbs.db',
	/\.iml$/,
	/^npm-debug\.log/,
	/^yarn-debug\.log/,
	/^yarn-error\.log/,
];

export function isEmpty(dirPath: string) {
	if (!existsSync(dirPath)) {
		return true;
	}

	const conflicts = readdirSync(dirPath).filter((content) => {
		return !VALID_PROJECT_DIRECTORY_SAFE_LIST.some((safeContent) => {
			return typeof safeContent === 'string' ? content === safeContent : safeContent.test(content);
		});
	});

	return conflicts.length === 0;
}