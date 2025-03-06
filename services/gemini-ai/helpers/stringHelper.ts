const removeTrailingNewlines = (str: string) => {
    return str.replace(/\n+$/, '')
}

export { removeTrailingNewlines }
