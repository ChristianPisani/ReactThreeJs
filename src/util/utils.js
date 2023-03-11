export const getTiledPos = (pos, tileSize) => {
    return [
        Math.round(pos[0] / tileSize),
        Math.round(pos[1] / tileSize),
        Math.round(pos[2] / tileSize),
    ]
}