export function merge(a, b) {
    return merge_into(merge_into({}, a), b);
}

export function merge_into(a, b) {
    for (var key in b) a[key] = b[key];
    return a;
}
