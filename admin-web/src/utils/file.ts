export const urlToFile = async (url: string, fileName = 'cover.jpg'): Promise<File> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' })
}