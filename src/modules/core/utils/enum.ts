export type StandardEnum<T> = {
  [id: string]: T | string | number;
  [nu: number]: string;
};

class EnumUtils {
  static toNumberArray<T>(value: StandardEnum<T>) {
    return Object.values(value)
      .filter((enumValue) => isNaN(Number(enumValue)))
      .map(Number);
  }
}

export enum AutocompleteBadgeStatus {
  SEARCHING = 0,
  SUCCESS = 1,
  ERROR = 2,
  INFO = 3,
}

export { EnumUtils };
