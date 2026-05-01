export class Sort {
  static readonly INITIAL_GAP = 65535;

  private constructor(readonly value: number) {}

  static of(value: number): Sort {
    return new Sort(value);
  }

  static appendAfter(maxSort: number): Sort {
    return new Sort(Math.floor(maxSort) + Sort.INITIAL_GAP);
  }

  static between(prev: Sort | null, next: Sort | null): Sort {
    const prevValue = prev?.value ?? 0;
    const nextValue = next?.value ?? Sort.INITIAL_GAP;
    return new Sort((prevValue + nextValue) / 2);
  }

  toJSON(): number {
    return this.value;
  }
}
