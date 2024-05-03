// adapted from https://stackoverflow.com/questions/63854208/dynamically-load-images-with-react
export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error("Could not load image"));
    });
}