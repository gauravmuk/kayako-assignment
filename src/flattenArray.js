function flattenArray(array, result) {
    result = result || [];
    for (var i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            flattenArray(array[i], result);
        } else {
            result.push(array[i]);
        }
    }

    return result;
}