
export const removeDuplicatesArray = (originalArray=[] as any) =>  {
    const arrayFilter = originalArray.filter(
        (item: any, index: any, self: any[]) =>
          index === self.findIndex((t) => t.id === item.id)
      );
    return arrayFilter
}