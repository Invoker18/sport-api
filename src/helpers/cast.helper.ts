import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { json } from 'sequelize';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toLowerCase(value: string): string {
  return value.toLowerCase();
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value, 10);

  if (newValue < opts.min) {
    newValue = opts.min;
  }

  if (newValue > opts.max) {
    newValue = opts.max;
  }

  return newValue;
}

export function jsonToXML(value: json): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    attributesGroupName: '',
  });
  return builder.build({ xml: value });
}

export function XMLToJson(value: string): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    attributesGroupName: '',
  });
  const xmlParsed = parser.parse(value);
  return parser.parse(xmlParsed.string['#text'])['xml'] ?? '';
}
