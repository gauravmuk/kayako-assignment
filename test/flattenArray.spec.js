describe('method: flattenArray', function () {
   it ('flattens a nested array into a single array', function () {
       expect(flattenArray([[1,2,[3]],4])).toEqual([1,2,3,4]);
   });

    it ('return the same array when no nesting exists', function () {
        expect(flattenArray([1,2,3,4])).toEqual([1,2,3,4]);
    });
});