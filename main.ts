namespace SpriteKind {
    export const HomePort = SpriteKind.create()
    export const Cargo = SpriteKind.create()
    export const FortMarker = SpriteKind.create()
    export const ColonyMarker = SpriteKind.create()
    export const ColonyNPC = SpriteKind.create()
}
const MAP_WIDTH = 200
const MAP_HEIGHT = 200
function pointInPolygon(x: number, y: number, points: number[], start: number, pointCount: number): boolean {
    let inside = false
    for (let i = 0, j = pointCount - 1; i < pointCount; j = i++) {
        const xi = points[start + i * 2]
        const yi = points[start + i * 2 + 1]
        const xj = points[start + j * 2]
        const yj = points[start + j * 2 + 1]
        if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside
        }
    }
    return inside
}

function buildWorldMap(): void {
    const continentPoints: number[] = [
        14, 12, 24, 20, 13, 34, 9, 47, 13, 56, 22, 53, 31, 60, 39, 51, 48, 45, 57, 39, 65, 31, 62, 27, 53, 19, 48, 14, 39,
        7, 39, 63, 45, 67, 49, 73, 54, 77, 51, 81, 46, 77, 43, 71,
        11, 47, 79, 58, 82, 64, 93, 62, 108, 57, 124, 53, 143, 47, 157, 42, 146, 39, 128, 37, 111, 39, 94,
        6, 48, 5, 61, 2, 70, 8, 66, 20, 56, 24, 49, 17,
        7, 91, 27, 99, 21, 109, 22, 116, 28, 112, 36, 103, 39, 96, 35,
        9, 96, 41, 112, 39, 120, 48, 118, 65, 111, 83, 103, 98, 96, 85, 91, 68, 90, 52,
        12, 112, 19, 132, 12, 153, 15, 173, 24, 188, 34, 184, 47, 169, 51, 158, 47, 146, 55, 133, 48, 121, 43, 115, 34,
        5, 132, 49, 143, 52, 146, 65, 140, 76, 134, 66,
        5, 151, 52, 163, 55, 170, 64, 166, 73, 158, 67,
        4, 180, 45, 184, 49, 182, 58, 178, 54,
        7, 158, 111, 174, 107, 185, 116, 181, 130, 169, 137, 157, 129, 153, 119,
        4, 119, 91, 122, 96, 120, 105, 117, 100,
        9, 20, 180, 45, 176, 72, 179, 99, 177, 128, 180, 155, 177, 181, 181, 190, 190, 10, 190
    ]
    const mapImage = image.create(MAP_WIDTH, MAP_HEIGHT)
    mapImage.fill(1)
    let offset = 0
    while (offset < continentPoints.length) {
        const pointCount = continentPoints[offset]
        offset += 1
        let minX = MAP_WIDTH - 1
        let maxX = 0
        let minY = MAP_HEIGHT - 1
        let maxY = 0
        for (let k = 0; k < pointCount; k++) {
            const px = continentPoints[offset + k * 2]
            const py = continentPoints[offset + k * 2 + 1]
            minX = Math.min(minX, px)
            maxX = Math.max(maxX, px)
            minY = Math.min(minY, py)
            maxY = Math.max(maxY, py)
        }
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                if (pointInPolygon(x, y, continentPoints, offset, pointCount)) {
                    mapImage.setPixel(x, y, 2)
                }
            }
        }
        offset += pointCount * 2
    }
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            if (mapImage.getPixel(x, y) == 2) {
                if (mapImage.getPixel(x - 1, y) == 1 || mapImage.getPixel(x + 1, y) == 1 || mapImage.getPixel(x, y - 1) == 1 || mapImage.getPixel(x, y + 1) == 1) {
                    mapImage.setPixel(x, y, 3)
                }
            }
        }
    }
    for (let x = 91; x <= 95; x++) {
        for (let y = 32; y <= 38; y++) {
            mapImage.setPixel(x, y, 1)
        }
    }
    const transparentTile = image.create(16, 16)
    transparentTile.fill(0)
    const waterTile = image.create(16, 16)
    waterTile.fill(8)
    for (let y = 3; y < 16; y += 5) {
        for (let x = (y % 2) * 2; x < 15; x += 8) {
            waterTile.setPixel(x, y, 9)
            waterTile.setPixel(x + 1, y, 9)
        }
    }
    const landTile = image.create(16, 16)
    landTile.fill(7)
    landTile.setPixel(2, 3, 6)
    landTile.setPixel(3, 3, 6)
    landTile.setPixel(10, 11, 5)
    landTile.setPixel(11, 11, 5)
    landTile.setPixel(6, 7, 6)
    const coastTile = image.create(16, 16)
    coastTile.fill(13)
    coastTile.setPixel(3, 4, 5)
    coastTile.setPixel(12, 10, 5)
    const mapData = control.createBuffer(4 + MAP_WIDTH * MAP_HEIGHT)
    mapData.setNumber(NumberFormat.UInt16LE, 0, MAP_WIDTH)
    mapData.setNumber(NumberFormat.UInt16LE, 2, MAP_HEIGHT)
    // Populate the tile IDs in the tilemap's data buffer. Leaving these bytes
    // at zero creates an entirely transparent/empty map.
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            mapData.setNumber(NumberFormat.UInt8LE, 4 + y * MAP_WIDTH + x, mapImage.getPixel(x, y))
        }
    }
    const world = tiles.createTilemap(mapData, mapImage, [transparentTile, waterTile, landTile, coastTile], TileScale.Sixteen)
    tiles.setCurrentTilemap(world)
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const tileIndex = mapImage.getPixel(x, y)
            if (tileIndex == 2 || tileIndex == 3 || x == 0 || y == 0 || x == MAP_WIDTH - 1 || y == MAP_HEIGHT - 1) {
                tiles.setWallAt(tiles.getTileLocation(x, y), true)
            }
        }
    }
}
const PLAYER_START_COL = 95
const PLAYER_START_ROW = 35
const HOME_PORT_COL = 93
const HOME_PORT_ROW = 35
const CARGO_COL = 61
const CARGO_ROW = 72
const FORT_ONE_COL = 74
const FORT_ONE_ROW = 61
const FORT_TWO_COL = 81
const FORT_TWO_ROW = 55
const COLONY_COL = 64
const COLONY_ROW = 69
const COLONY_NPC_COL = 67
const COLONY_NPC_ROW = 69
const PIRATE_COL = 76
const PIRATE_ROW = 64
const NORMAL_SHIP_SPEED = 90
const COMPASS_BOOST_SPEED = 145
const COMPASS_BOOST_DURATION_MS = 2000
let hasCargo = false
let pirateHitLock = false
let compassReady = true
let homePort: Sprite
let cargo: Sprite
let colony: Sprite
let colonyNPC: Sprite
game.splash("The Atlantic Trade Route", "A British Empire voyage")
buildWorldMap()
let mySprite = sprites.create(img`
.......e........
......e1e.......
.....e111e......
....e11111e.....
...e1111111e....
..e111111111e...
...e111e111e....
....e11e11e.....
.....e1e1e......
....eeeeeee.....
...edddddde.....
..edddddddde....
...edddddde.....
....eeeeeee.....
.....eeeee......
......eee.......
`, SpriteKind.Player)
mySprite.z = 10
mySprite.setFlag(SpriteFlag.StayInScreen, false)
info.setLife(3)
info.setScore(0)
tiles.placeOnTile(mySprite, tiles.getTileLocation(PLAYER_START_COL, PLAYER_START_ROW))
scene.cameraFollowSprite(mySprite)
controller.moveSprite(mySprite, NORMAL_SHIP_SPEED, NORMAL_SHIP_SPEED)
let myEnemy = sprites.create(img`
.......e........
......e1e.......
.....efffe......
....eff1ffe.....
...efff1f1ffe...
..effff111fffe..
...efffffffe....
....eeeeeee.....
...edddddde.....
..edddddddde....
..edddddddde....
...edddddde.....
....eeeeeee.....
.....eeeee......
......eee.......
.......e........
`, SpriteKind.Enemy)
tiles.placeOnTile(myEnemy, tiles.getTileLocation(PIRATE_COL, PIRATE_ROW))
myEnemy.follow(mySprite, 45)
homePort = sprites.create(img`
..e.............
..e.88888888....
..e.88111888....
..e.81111188....
..e.11122111....
..e.81122188....
..e.88111888....
..e.88888888....
..e.............
..e.............
..e.............
..e.............
..e.............
..e.............
..e.............
..eeee..........
`, SpriteKind.HomePort)
tiles.placeOnTile(homePort, tiles.getTileLocation(HOME_PORT_COL, HOME_PORT_ROW))
homePort.z = 2
cargo = sprites.create(img`
. . . . 6 6 6 6 . . . . . . . .
. . . 6 a a a a 6 . . . . . . .
. . 6 a a 6 6 a a 6 . . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. 6 a a a a a a a a 6 . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. . 6 a a a a a a 6 . . . . . . .
. . . 6 a a a a 6 . . . . . . . .
. . . . 6 6 6 6 . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`, SpriteKind.Cargo)
tiles.placeOnTile(cargo, tiles.getTileLocation(CARGO_COL, CARGO_ROW))
let fortOne = sprites.create(img`
. . . . . 9 9 9 9 9 9 . . . . .
. . . . . 9 1 1 1 1 9 . . . . .
. . . . . 9 1 9 9 1 9 . . . . .
. . . . . 9 1 9 9 1 9 . . . . .
. . . . . 9 1 1 1 1 9 . . . . .
. . . . . 9 9 9 9 9 9 . . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . 9 9 9 9 9 9 9 9 9 . . .
. . 9 9 9 9 9 9 9 9 9 9 9 . . .
. . 9 9 9 9 9 9 9 9 9 9 9 . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
`, SpriteKind.FortMarker)
tiles.placeOnTile(fortOne, tiles.getTileLocation(FORT_ONE_COL, FORT_ONE_ROW))
let fortTwo = sprites.create(img`
. . . . . 9 9 9 9 9 9 . . . . .
. . . . . 9 1 1 1 1 9 . . . . .
. . . . . 9 1 9 9 1 9 . . . . .
. . . . . 9 1 9 9 1 9 . . . . .
. . . . . 9 1 1 1 1 9 . . . . .
. . . . . 9 9 9 9 9 9 . . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . . 9 9 9 9 9 9 9 9 . . . .
. . . 9 9 9 9 9 9 9 9 9 . . .
. . 9 9 9 9 9 9 9 9 9 9 9 . . .
. . 9 9 9 9 9 9 9 9 9 9 9 . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
`, SpriteKind.FortMarker)
tiles.placeOnTile(fortTwo, tiles.getTileLocation(FORT_TWO_COL, FORT_TWO_ROW))
colony = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . . . . 6 6 6 6 . . . . .
. . . . . . 6 6 6 6 6 6 . . . .
. . . . . 6 6 6 6 6 6 6 6 . . .
. . . . 6 6 6 6 6 6 6 6 6 6 . .
. . . . a a a a a a a a a a . .
. . . . a 1 a a a a a a 1 a . .
. . . . a 1 a a a a a a 1 a . .
. . . . a 1 a a a a a a 1 a . .
. . . . a a a a a a a a a a . .
. . . . a a 1 1 1 1 1 1 a a . .
. . . . a a 1 1 1 1 1 1 a a . .
. . . . a a a a a a a a a a . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`, SpriteKind.ColonyMarker)
tiles.placeOnTile(colony, tiles.getTileLocation(COLONY_COL, COLONY_ROW))
colony.z = 2
colonyNPC = sprites.create(img`
. . . . 5 5 5 5 . . . . . . . .
. . . 5 5 5 5 5 5 . . . . . . .
. . . . 5 5 5 5 . . . . . . . .
. . . . 1 1 1 1 . . . . . . . .
. . . 1 1 1 1 1 1 . . . . . . .
. . . 1 1 1 1 1 1 . . . . . . .
. . . . 1 1 1 1 . . . . . . . .
. . . . 6 6 6 6 . . . . . . . .
. . . 6 6 6 6 6 6 . . . . . . .
. . . 6 6 6 6 6 6 . . . . . . .
. . . 6 6 6 6 6 6 . . . . . . .
. . . 6 6 6 6 6 6 . . . . . . .
. . . 6 6 . . 6 6 . . . . . . .
. . . 6 6 . . 6 6 . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`, SpriteKind.ColonyNPC)
tiles.placeOnTile(colonyNPC, tiles.getTileLocation(COLONY_NPC_COL, COLONY_NPC_ROW))
colonyNPC.z = 3
sprites.onOverlap(SpriteKind.Player, SpriteKind.Cargo, function (player, item) {
    if (!hasCargo) {
        hasCargo = true
        item.destroy(effects.disintegrate)
        info.changeScoreBy(10)
        game.splash("Cargo collected", "Return it to London!")
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.HomePort, function (player, port) {
    if (hasCargo) {
        hasCargo = false
        info.changeScoreBy(50)
        game.splash("Trade route complete!", "Cargo delivered to London.")
        game.over(true)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player, pirate) {
    if (!pirateHitLock) {
        pirateHitLock = true
        info.changeLifeBy(-1)
        player.setFlag(SpriteFlag.GhostThroughSprites, true)
        tiles.placeOnTile(player, tiles.getTileLocation(PLAYER_START_COL, PLAYER_START_ROW))
        myEnemy.setPosition(PIRATE_COL * 16 + 8, PIRATE_ROW * 16 + 8)
        if (hasCargo) {
            hasCargo = false
            cargo = sprites.create(img`
. . . . 6 6 6 6 . . . . . . . .
. . . 6 a a a a 6 . . . . . . .
. . 6 a a 6 6 a a 6 . . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. 6 a a a a a a a a 6 . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. 6 a a 6 6 6 6 a a 6 . . . . . .
. . 6 a a a a a a 6 . . . . . . .
. . . 6 a a a a 6 . . . . . . . .
. . . . 6 6 6 6 . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`, SpriteKind.Cargo)
            tiles.placeOnTile(cargo, tiles.getTileLocation(CARGO_COL, CARGO_ROW))
        }
        pause(900)
        player.setFlag(SpriteFlag.GhostThroughSprites, false)
        pirateHitLock = false
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Math.abs(mySprite.x - colonyNPC.x) < 32 && Math.abs(mySprite.y - colonyNPC.y) < 32) {
        game.showLongText("Colonial trader: These goods are bound for Britain. Your cargo is aboard. Sail northeast across the Atlantic and return it to the home port at London.", DialogLayout.Bottom)
    }
})
game.showLongText("Captain, your voyage begins just offshore from the London home port on the west coast of Europe. Sail southwest across the Atlantic to the Caribbean colony, shown toward the lower-left of the map. Collect the cargo, then sail northeast back to London and touch the home-port flag to complete the trade route. Use the arrow keys to steer, A to speak with the colonial trader, and B for a short compass speed boost. Keep clear of the pirate ship. The camera follows your ship, so it stays near the center of the screen while the coastline and port move past it.", DialogLayout.Bottom)
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (compassReady) {
        compassReady = false
        controller.moveSprite(mySprite, COMPASS_BOOST_SPEED, COMPASS_BOOST_SPEED)
        pause(COMPASS_BOOST_DURATION_MS)
        controller.moveSprite(mySprite, NORMAL_SHIP_SPEED, NORMAL_SHIP_SPEED)
        compassReady = true
    }
})