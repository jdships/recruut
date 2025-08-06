import { APP_NAME } from '@workspace/common/app';

export function createTitle(title: string, addSuffix: boolean = true): string {
  if (!addSuffix) {
    return title;
  }
  if (!title) {
    return APP_NAME;
  }

  return `${title} | ${APP_NAME}`;
}

export function capitalize(str: string): string {
  if (!str) {
    return str;
  }

  if (str.length === 1) {
    return str.charAt(0).toUpperCase();
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(name: string): string {
  if (!name) {
    return '';
  }
  return name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');
}
