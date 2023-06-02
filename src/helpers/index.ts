export const getDicesCombinations = (array: []) =>
  array.flatMap((ae, ai, aa) => {
    const subArray = aa.filter((_, si) => si > ai);
    return subArray.flatMap((se) => [`${ae}-${se}`, `${se}-${ae}`]);
  });
