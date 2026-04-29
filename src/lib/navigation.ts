/**
 * Extracts the section identifier from a given path string.
 *
 * @param path - The path string to parse. Can be in the format `/docs/section/...` or `/section/...`.
 *               If undefined or empty, defaults to 'other'.
 * @returns The section identifier. Returns 'guide' if the path matches the guide section,
 *          'bamboo-base-go' if the path matches bamboo-base-go section,
 *          otherwise returns 'other' as a fallback.
 *
 * @example
 * getSection('/docs/guide/intro') // returns 'guide'
 * getSection('/guide/intro') // returns 'guide'
 * getSection('/docs/bamboo-base-go/core') // returns 'bamboo-base-go'
 * getSection('/docs/') // returns 'other'
 * getSection(undefined) // returns 'other'
 */
export function getSection(path: string | undefined) {
  if (!path) return 'other';

  // 移除开头的斜杠并分割路径
  const segments = path.replace(/^\//, '').split('/');
  // 对于 /docs/guide/xxx 格式，取第二个段（索引1）
  // 对于 /guide/xxx 格式，取第一个段（索引0）
  const section = segments[0] === 'docs' ? segments[1] : segments[0];

  if (!section) return 'other';
  return (
    {
      guide: 'guide',
      'bamboo-base-go': 'bamboo-base-go',
    }[section] ?? 'other'
  );
}