export function sanitizeFilename(filename: string): string {
	return filename.replace('.wav', '')
}
