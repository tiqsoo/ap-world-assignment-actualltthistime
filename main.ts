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
        21, 8, 18, 16, 11, 27, 9, 38, 12, 47, 9, 59, 16, 65, 25, 61, 34, 68, 42, 64, 51, 57, 55, 54,
        63, 48, 67, 43, 61, 37, 57, 32, 51, 26, 48, 21, 43, 15, 40, 11, 32, 7, 27, 8, 51, 3, 62, 1,
        73, 6, 77, 15, 71, 24, 62, 22, 56, 17, 52, 10, 11, 45, 59, 51, 61, 55, 66, 58, 72, 62, 77, 65,
        83, 62, 87, 58, 83, 55, 77, 51, 72, 48, 67, 17, 62, 83, 71, 84, 78, 91, 82, 101, 81, 113, 77, 127,
        74, 140, 69, 153, 64, 166, 59, 176, 55, 169, 54, 155, 51, 141, 49, 127, 48, 113, 51, 100, 56, 90, 14, 96,
        28, 102, 23, 109, 22, 115, 25, 121, 22, 127, 25, 132, 31, 130, 37, 124, 40, 119, 38, 113, 42, 107, 40, 101,
        42, 96, 37, 6, 91, 31, 94, 29, 96, 32, 95, 36, 92, 36, 90, 33, 16, 105, 45, 115, 44, 125, 48, 133,
        55, 138, 65, 136, 78, 131, 91, 126, 104, 121, 117, 115, 126, 109, 118, 106, 105, 102, 92, 99, 79, 98, 66, 101,
        55, 18, 128, 20, 140, 13, 154, 13, 167, 16, 180, 14, 192, 22, 197, 31, 193, 42, 186, 48, 179, 45, 172, 51,
        164, 48, 156, 55, 147, 52, 140, 57, 132, 50, 126, 41, 124, 31, 7, 139, 54, 147, 57, 153, 65, 154, 75, 149,
        83, 145, 76, 142, 67, 7, 154, 66, 164, 67, 172, 73, 175, 81, 169, 84, 162, 80, 157, 75, 5, 185, 48, 190,
        47, 193, 53, 190, 58, 186, 55, 9, 158, 121, 170, 117, 182, 122, 190, 132, 187, 144, 178, 151, 166, 151, 157, 143,
        154, 132, 5, 128, 115, 131, 121, 130, 133, 127, 137, 125, 127, 5, 85, 23, 89, 21, 92, 24, 90, 27, 86, 27,
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
    const coastMask = image.create(MAP_WIDTH, MAP_HEIGHT)
    coastMask.fill(0)
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            if (mapImage.getPixel(x, y) == 2) {
                if (
                    mapImage.getPixel(x - 1, y) == 1 ||
                    mapImage.getPixel(x + 1, y) == 1 ||
                    mapImage.getPixel(x, y - 1) == 1 ||
                    mapImage.getPixel(x, y + 1) == 1
                ) {
                    coastMask.setPixel(x, y, 1)
                }
            }
        }
    }
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            if (coastMask.getPixel(x, y) == 1) {
                mapImage.setPixel(x, y, 3)
            }
        }
    }
    for (let x = 2; x < MAP_WIDTH - 2; x++) {
        for (let y = 2; y < MAP_HEIGHT - 2; y++) {
            if (mapImage.getPixel(x, y) == 2 && (x * 7 + y * 11) % 19 == 0) {
                mapImage.setPixel(x, y, 4)
            }
            if (mapImage.getPixel(x, y) == 1 && (x * 13 + y * 5) % 37 == 0) {
                mapImage.setPixel(x, y, 5)
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
    for (let y = 2; y < 16; y += 5) {
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
    const forestTile = image.create(16, 16)
    forestTile.fill(7)
    forestTile.setPixel(3, 3, 6)
    forestTile.setPixel(4, 3, 6)
    forestTile.setPixel(2, 4, 6)
    forestTile.setPixel(3, 5, 6)
    forestTile.setPixel(11, 9, 6)
    forestTile.setPixel(12, 9, 6)
    forestTile.setPixel(10, 10, 6)
    forestTile.setPixel(11, 11, 6)
    const waveTile = image.create(16, 16)
    waveTile.fill(8)
    for (let x = 2; x < 14; x++) {
        if (x % 3 != 0) {
            waveTile.setPixel(x, 5, 9)
            waveTile.setPixel(x - 1, 6, 9)
        }
    }
    const mapData = control.createBuffer(4 + MAP_WIDTH * MAP_HEIGHT)
    mapData.setNumber(NumberFormat.UInt16LE, 0, MAP_WIDTH)
    mapData.setNumber(NumberFormat.UInt16LE, 2, MAP_HEIGHT)
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            mapData.setNumber(NumberFormat.UInt8LE, 4 + y * MAP_WIDTH + x, mapImage.getPixel(x, y))
        }
    }
    const world = tiles.createTilemap(mapData, mapImage, [transparentTile, waterTile, landTile, coastTile, forestTile, waveTile], TileScale.Sixteen)
    tiles.setCurrentTilemap(world)
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const tileIndex = mapImage.getPixel(x, y)
            if (tileIndex == 2 || tileIndex == 3 || tileIndex == 4 || x == 0 || y == 0 || x == MAP_WIDTH - 1 || y == MAP_HEIGHT - 1) {
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
.......f........
......fff.......
.....f111f......
....f11111f.....
...f1111111f....
...f1111111f....
....f11111f.....
.....f1f1f......
.....fefef......
....feeeeef.....
...feeeeeeef....
....feeeeef.....
.....feef.......
......fff.......
.......f........
................
`, SpriteKind.Player)
mySprite.z = 10
mySprite.setFlag(SpriteFlag.StayInScreen, false)
info.setLife(3)
info.setScore(0)
tiles.placeOnTile(mySprite, tiles.getTileLocation(PLAYER_START_COL, PLAYER_START_ROW))
scene.cameraFollowSprite(mySprite)
controller.moveSprite(mySprite, NORMAL_SHIP_SPEED, NORMAL_SHIP_SPEED)
let myEnemy = sprites.create(img`
.......f........
......fff.......
.....f222f......
....f22222f.....
...f2222222f....
...f222f222f....
....f22222f.....
.....f2f2f......
.....fefef......
....ffffffff....
...ffffefffff...
....ffffffff....
.....ffffff.....
......ffff......
.......ff.......
................
`, SpriteKind.Enemy)
tiles.placeOnTile(myEnemy, tiles.getTileLocation(PIRATE_COL, PIRATE_ROW))
myEnemy.follow(mySprite, 45)
homePort = sprites.create(img`
..f.............
..f.888888888...
..f.881118811...
..f.881118811...
..f.111111111...
..f.881218811...
..f.881218811...
..f.888888888...
..f.............
..f.............
..f.............
..f.............
..f.............
..f.............
..f.............
..fff...........
`, SpriteKind.HomePort)
tiles.placeOnTile(homePort, tiles.getTileLocation(HOME_PORT_COL, HOME_PORT_ROW))
homePort.z = 2
cargo = sprites.create(img`
....ffffffff....
...feeeeeeeef...
..fee5eeee5eef..
..fee5eeee5eef..
..feee5ee5eeef..
..feeee55eeeef..
..feeee55eeeef..
..feee5ee5eeef..
..fee5eeee5eef..
..fee5eeee5eef..
..feeeeeeeeeef..
...feeeeeeeef...
....ffffffff....
................
................
................
`, SpriteKind.Cargo)
tiles.placeOnTile(cargo, tiles.getTileLocation(CARGO_COL, CARGO_ROW))
let fortOne = sprites.create(img`
......f2f.......
.....f222f......
....ffffffff....
...fddddddddf...
...fdeddddedf...
...fddddddddf...
...fddfddfddf...
...fddddddddf...
..fddddddddddf..
..fddddddddddf..
..fddddddddddf..
..fddfddddfddf..
..fddfddddfddf..
..ffffffffffff..
................
................
`, SpriteKind.FortMarker)
tiles.placeOnTile(fortOne, tiles.getTileLocation(FORT_ONE_COL, FORT_ONE_ROW))
let fortTwo = sprites.create(img`
.......f........
......f2f.......
.....f222f......
......f2f.......
.....fffff......
....fdddddf.....
...fdddddddf....
...fdeddddef....
...fdddddddf....
...fddfdfddf....
...fddfdfddf....
...fdddddddf....
....fdddddf.....
.....fffff......
......fff.......
................
`, SpriteKind.FortMarker)
tiles.placeOnTile(fortTwo, tiles.getTileLocation(FORT_TWO_COL, FORT_TWO_ROW))
colony = sprites.create(img`
......f.........
.....f777f......
....f77777f.....
...f7777777f....
......f.........
......f.........
......f.........
.....fefef......
....feeeef......
...feeeeeef.....
...fddddddf.....
....fddddf......
.....ffffff.....
...dddddddd.....
..dddddddddd....
................
`, SpriteKind.ColonyMarker)
tiles.placeOnTile(colony, tiles.getTileLocation(COLONY_COL, COLONY_ROW))
colony.z = 2
colonyNPC = sprites.create(img`
.....fffff......
....feeeeef.....
....fe33ef......
....fe33ef......
.....feeef......
......f3f.......
....ff888ff.....
...f8888888f....
...f8888888f....
....f88888f.....
....feeeeef.....
....feeeeef.....
....fef.fef.....
....fef.fef.....
....fff.fff.....
................
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
....ffffffff....
...feeeeeeeef...
..fee5eeee5eef..
..fee5eeee5eef..
..feee5ee5eeef..
..feeee55eeeef..
..feeee55eeeef..
..feee5ee5eeef..
..fee5eeee5eef..
..fee5eeee5eef..
..feeeeeeeeeef..
...feeeeeeeef...
....ffffffff....
................
................
................
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
