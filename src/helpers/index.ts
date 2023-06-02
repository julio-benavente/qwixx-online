export const getDicesCombinations = (array: string[]): string[] =>
  array.flatMap((ae, ai, aa) => {
    const subArray = aa.filter((_, si) => si > ai);
    return subArray.flatMap((se) => [`${ae}-${se}`, `${se}-${ae}`]);
  });
