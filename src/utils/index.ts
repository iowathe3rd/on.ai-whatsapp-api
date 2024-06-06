export function normalizeUrl(inputUrl: string): string | null {
	try {
		new URL(inputUrl);
		// If the URL is valid, return the original URL
		return inputUrl;
	} catch (error) {
		// Attempt to fix common URL issues
		if (!inputUrl.includes('://')) {
			// Add missing protocol
			inputUrl = 'https://' + inputUrl;
		} else if (inputUrl.startsWith('//')) {
			// Add missing protocol if only double slashes are present
			inputUrl = 'https:' + inputUrl;
		}
		try {
			// Attempt to parse the fixed URL
			new URL(inputUrl);
			return inputUrl;
		} catch (error) {
			// If still invalid, return null
			return null;
		}
	}
}
