import Color from 'color';

export function getContrastColor(color: string) {
  const luminosity = Color(color).luminosity();
  if (luminosity > 0.5) return '#000';
  return '#fff';
}
