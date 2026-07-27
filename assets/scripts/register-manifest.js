if (location.protocol !== 'file:') {
  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = 'site.webmanifest';
  document.head.append(manifest);
}
