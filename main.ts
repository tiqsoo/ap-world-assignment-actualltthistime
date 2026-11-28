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


function createShipImage(pirate: boolean): Image {
    const ship = image.create(24, 24)
    const sailColor = pirate ? 14 : 1
    const trimColor = pirate ? 2 : 4
    for (let y = 2; y <= 17; y++) ship.setPixel(12, y, 15)
    for (let x = 10; x <= 14; x++) ship.setPixel(x, 5, 14)
    for (let y = 5; y <= 15; y++) {
        const left = 12 - (y - 5)
        for (let x = left; x <= 11; x++) ship.setPixel(x, y, sailColor)
    }
    for (let y = 8; y <= 15; y++) {
        const right = 13 + (y - 8)
        for (let x = 13; x <= right; x++) ship.setPixel(x, y, sailColor)
    }
    for (let y = 6; y <= 14; y += 3) {
        ship.setPixel(11 - Math.floor((y - 5) * 0.7), y, trimColor)
        ship.setPixel(13 + Math.floor((y - 8) * 0.8), y, trimColor)
    }
    for (let x = 4; x <= 19; x++) ship.setPixel(x, 17, 15)
    for (let y = 18; y <= 20; y++) {
        const inset = y - 18
        for (let x = 4 + inset; x <= 19 - inset; x++) ship.setPixel(x, y, 14)
    }
    for (let x = 7; x <= 16; x++) ship.setPixel(x, 21, 15)
    for (let x = 6; x <= 17; x++) ship.setPixel(x, 18, trimColor)
    ship.setPixel(18, 15, 2)
    ship.setPixel(19, 14, 15)
    return ship
}

function createUnionJackPortImage(): Image {
    const port = image.create(24, 24)
    for (let y = 1; y <= 22; y++) port.setPixel(2, y, 15)
    port.setPixel(1, 1, 5)
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 20; x++) {
            port.setPixel(x + 4, y + 2, 8)
            const rising = Math.abs(y - x * 0.5)
            const falling = Math.abs(y - (9 - x * 0.5))
            if (rising <= 1.35 || falling <= 1.35) port.setPixel(x + 4, y + 2, 1)
            if (Math.abs(y - (x * 0.5 + 1.1)) <= 0.55 ||
                Math.abs(y - (9 - x * 0.5 - 1.1)) <= 0.55) port.setPixel(x + 4, y + 2, 2)
            if ((x >= 8 && x <= 11) || (y >= 3 && y <= 6)) port.setPixel(x + 4, y + 2, 1)
            if ((x >= 9 && x <= 10) || (y >= 4 && y <= 5)) port.setPixel(x + 4, y + 2, 2)
        }
    }
    for (let x = 3; x <= 22; x++) {
        port.setPixel(x, 18, 15)
        port.setPixel(x, 19, 13)
        if (x % 4 < 2) port.setPixel(x, 20, 11)
        port.setPixel(x, 21, 15)
    }
    port.setPixel(4, 17, 5)
    port.setPixel(21, 17, 5)
    return port
}

function createCargoImage(): Image {
    const box = image.create(16, 16)
    for (let y = 2; y <= 13; y++) for (let x = 2; x <= 13; x++) box.setPixel(x, y, 14)
    for (let x = 2; x <= 13; x++) { box.setPixel(x, 2, 15); box.setPixel(x, 13, 15) }
    for (let y = 2; y <= 13; y++) { box.setPixel(2, y, 15); box.setPixel(13, y, 15) }
    for (let y = 3; y <= 12; y++) { box.setPixel(7, y, 4); box.setPixel(8, y, 4) }
    for (let x = 3; x <= 12; x++) { box.setPixel(x, 7, 4); box.setPixel(x, 8, 4) }
    box.setPixel(7, 7, 5); box.setPixel(8, 7, 5); box.setPixel(7, 8, 5); box.setPixel(8, 8, 5)
    box.setPixel(4, 4, 5); box.setPixel(11, 11, 5)
    return box
}

function createFortImage(variant: number): Image {
    const fort = image.create(20, 20)
    for (let x = 3; x <= 16; x++) fort.setPixel(x, 17, 15)
    for (let y = 7; y <= 16; y++) for (let x = 4; x <= 15; x++) fort.setPixel(x, y, 13)
    for (let x = 4; x <= 15; x += 4) for (let y = 4; y <= 7; y++) fort.setPixel(x, y, 13)
    for (let x = 4; x <= 15; x++) fort.setPixel(x, 7, 15)
    for (let y = 5; y <= 15; y++) { fort.setPixel(3, y, 15); fort.setPixel(16, y, 15) }
    fort.setPixel(5, 10, 8); fort.setPixel(14, 10, 8)
    for (let y = 12; y <= 16; y++) { fort.setPixel(9, y, 14); fort.setPixel(10, y, 14) }
    for (let y = 1; y <= 5; y++) fort.setPixel(10, y, 15)
    fort.setPixel(11, 1, 2); fort.setPixel(12, 2, 2)
    if (variant == 2) { fort.setPixel(8, 9, 5); fort.setPixel(11, 9, 5) }
    return fort
}

function createColonyImage(): Image {
    const building = image.create(24, 24)
    for (let x = 3; x <= 21; x++) building.setPixel(x, 21, 15)
    for (let y = 10; y <= 20; y++) for (let x = 5; x <= 19; x++) building.setPixel(x, y, 13)
    for (let y = 4; y <= 10; y++) {
        const inset = y - 4
        for (let x = 3 + inset; x <= 21 - inset; x++) building.setPixel(x, y, 14)
    }
    for (let x = 5; x <= 19; x++) building.setPixel(x, 10, 15)
    for (let x = 7; x <= 17; x += 5) building.setPixel(x, 7, 4)
    for (let y = 11; y <= 19; y++) { building.setPixel(6, y, 14); building.setPixel(18, y, 14) }
    for (let y = 15; y <= 20; y++) { building.setPixel(11, y, 14); building.setPixel(12, y, 14) }
    building.setPixel(8, 13, 8); building.setPixel(9, 13, 8)
    building.setPixel(16, 13, 8); building.setPixel(17, 13, 8)
    for (let y = 1; y <= 6; y++) building.setPixel(4, y, 15)
    building.setPixel(5, 1, 8); building.setPixel(6, 1, 1)
    building.setPixel(5, 2, 1); building.setPixel(6, 2, 2)
    return building
}

function createTraderImage(): Image {
    const person = image.create(16, 24)
    for (let x = 4; x <= 11; x++) person.setPixel(x, 3, 14)
    for (let x = 5; x <= 10; x++) person.setPixel(x, 2, 15)
    for (let y = 4; y <= 8; y++) for (let x = 5; x <= 10; x++) person.setPixel(x, y, 5)
    person.setPixel(6, 6, 15); person.setPixel(9, 6, 15)
    for (let y = 9; y <= 17; y++) for (let x = 3; x <= 12; x++) person.setPixel(x, y, 8)
    person.setPixel(7, 9, 1); person.setPixel(8, 9, 1)
    for (let y = 10; y <= 16; y++) person.setPixel(7, y, 13)
    for (let y = 11; y <= 15; y++) { person.setPixel(2, y, 5); person.setPixel(13, y, 5) }
    for (let y = 18; y <= 21; y++) {
        person.setPixel(5, y, 15); person.setPixel(6, y, 15)
        person.setPixel(9, y, 15); person.setPixel(10, y, 15)
    }
    person.setPixel(4, 22, 15); person.setPixel(11, 22, 15)
    return person
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
    // Intentional forest belts and mountain ridges replace mathematical speckles.
    const forestCenters = [[28,28,11,8],[49,43,10,7],[68,29,9,7],[82,77,10,8],
        [102,91,8,12],[132,112,12,7],[158,44,11,8],[177,163,9,8],[42,155,8,11]]
    const mountainCenters = [[35,48,6,4],[74,83,7,4],[119,105,6,5],[151,129,8,4],[185,174,5,4]]
    for (let x = 2; x < MAP_WIDTH - 2; x++) {
        for (let y = 2; y < MAP_HEIGHT - 2; y++) {
            if (mapImage.getPixel(x, y) == 2) {
                for (let i = 0; i < forestCenters.length; i++) {
                    const f = forestCenters[i]
                    const dx = (x - f[0]) / f[2], dy = (y - f[1]) / f[3]
                    if (dx * dx + dy * dy < 1) mapImage.setPixel(x, y, 4)
                }
                for (let i = 0; i < mountainCenters.length; i++) {
                    const m = mountainCenters[i]
                    const dx = (x - m[0]) / m[2], dy = (y - m[1]) / m[3]
                    if (dx * dx + dy * dy < 1 && (x + y) % 3 != 0) mapImage.setPixel(x, y, 7)
                }
            }
        }
    }
    // Shallow water hugs the coastline to create a readable surf transition.
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            if (mapImage.getPixel(x, y) == 1) {
                let nearLand = false
                for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
                    if (mapImage.getPixel(x + dx, y + dy) == 3) nearLand = true
                }
                if (nearLand) mapImage.setPixel(x, y, 5)
            }
        }
    }
    for (let x = 91; x <= 95; x++) {
        for (let y = 32; y <= 38; y++) {
            mapImage.setPixel(x, y, 1)
        }
    }
    const routePoints = [[93, 35], [87, 42], [81, 49], [75, 56], [69, 63], [64, 69], [61, 72]]
    for (let p = 0; p < routePoints.length - 1; p++) {
        const ax = routePoints[p][0], ay = routePoints[p][1]
        const bx = routePoints[p + 1][0], by = routePoints[p + 1][1]
        const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay))
        for (let i = 0; i <= steps; i++) {
            if (i % 3 != 1) {
                const x = Math.round(ax + (bx - ax) * i / steps)
                const y = Math.round(ay + (by - ay) * i / steps)
                if (mapImage.getPixel(x, y) == 1) mapImage.setPixel(x, y, 6)
            }
        }
    }
    const transparentTile = image.create(16, 16)
    transparentTile.fill(0)
    // Deep ocean: layered blue with repeating wave highlights.
    const waterTile = image.create(16, 16)
    waterTile.fill(8)
    for (let y = 1; y < 16; y += 4) {
        const start = (y % 8 == 1) ? 2 : 7
        for (let x = start; x < start + 5; x++) {
            waterTile.setPixel(x, y, 9)
            if (x < 15) waterTile.setPixel(x + 1, y, 9)
        }
        waterTile.setPixel(start + 1, y + 1, 6)
    }
    waterTile.setPixel(14, 12, 9); waterTile.setPixel(15, 12, 9)

    // Grassland: grouped highlights rather than isolated random pixels.
    const landTile = image.create(16, 16)
    landTile.fill(7)
    for (let x = 2; x <= 5; x++) landTile.setPixel(x, 3, 6)
    landTile.setPixel(3, 4, 6); landTile.setPixel(10, 10, 6)
    landTile.setPixel(11, 10, 6); landTile.setPixel(10, 11, 6)
    landTile.setPixel(6, 14, 5)

    // Sandy shoreline with a broken surf line and wet-sand accents.
    const coastTile = image.create(16, 16)
    coastTile.fill(5)
    for (let x = 0; x < 16; x++) {
        if (x % 4 != 1) coastTile.setPixel(x, 2 + (x % 3), 13)
        if (x % 5 == 0) coastTile.setPixel(x, 5 + (x % 4), 6)
    }
    for (let x = 2; x < 14; x += 4) coastTile.setPixel(x, 12, 4)

    // Forest: clustered canopy shapes with trunks and shadow pixels.
    const forestTile = image.create(16, 16)
    forestTile.fill(7)
    for (let y = 2; y <= 7; y++) for (let x = 2; x <= 7; x++) {
        if (Math.abs(x - 4) + Math.abs(y - 4) <= 4) forestTile.setPixel(x, y, 6)
    }
    for (let y = 8; y <= 13; y++) for (let x = 9; x <= 14; x++) {
        if (Math.abs(x - 11) + Math.abs(y - 10) <= 4) forestTile.setPixel(x, y, 6)
    }
    forestTile.setPixel(4, 5, 7); forestTile.setPixel(11, 11, 7)
    forestTile.setPixel(5, 7, 14); forestTile.setPixel(12, 13, 14)

    // Turquoise shallows near beaches.
    const shallowTile = image.create(16, 16)
    shallowTile.fill(6)
    for (let y = 2; y < 15; y += 5) for (let x = 1 + (y % 3); x < 14; x += 6) {
        shallowTile.setPixel(x, y, 9); shallowTile.setPixel(x + 1, y, 9)
    }
    shallowTile.setPixel(3, 12, 8); shallowTile.setPixel(4, 12, 8)

    // Gold dotted trade route across the blue sea.
    const routeTile = image.create(16, 16)
    routeTile.fill(8)
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        if (Math.abs(y - x) <= 1 && (x + y) % 4 != 1) routeTile.setPixel(x, y, 5)
        else if (Math.abs(y - x) == 2 && (x + y) % 5 == 0) routeTile.setPixel(x, y, 4)
    }

    // Mountain tile: stepped pale peaks with darker foothills.
    const mountainTile = image.create(16, 16)
    mountainTile.fill(7)
    for (let y = 3; y <= 12; y++) {
        const half = Math.floor((y - 3) * 0.8)
        for (let x = 7 - half; x <= 7 + half; x++) {
            if (x >= 1 && x <= 14) mountainTile.setPixel(x, y, y < 8 ? 13 : 12)
        }
    }
    for (let x = 5; x <= 9; x++) mountainTile.setPixel(x, 7, 1)
    mountainTile.setPixel(7, 4, 1); mountainTile.setPixel(6, 10, 14); mountainTile.setPixel(8, 11, 14)

    const mapData = control.createBuffer(4 + MAP_WIDTH * MAP_HEIGHT)
    mapData.setNumber(NumberFormat.UInt16LE, 0, MAP_WIDTH)
    mapData.setNumber(NumberFormat.UInt16LE, 2, MAP_HEIGHT)
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            mapData.setNumber(NumberFormat.UInt8LE, 4 + y * MAP_WIDTH + x, mapImage.getPixel(x, y))
        }
    }
    const world = tiles.createTilemap(mapData, mapImage, [transparentTile, waterTile, landTile, coastTile, forestTile, shallowTile, routeTile, mountainTile], TileScale.Sixteen)
    tiles.setCurrentTilemap(world)
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const tileIndex = mapImage.getPixel(x, y)
            if (tileIndex == 2 || tileIndex == 3 || tileIndex == 4 || tileIndex == 7 || x == 0 || y == 0 || x == MAP_WIDTH - 1 || y == MAP_HEIGHT - 1) {
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
let mySprite = sprites.create(createShipImage(false), SpriteKind.Player)
mySprite.z = 10
mySprite.setFlag(SpriteFlag.StayInScreen, false)
info.setLife(3)
info.setScore(0)
tiles.placeOnTile(mySprite, tiles.getTileLocation(PLAYER_START_COL, PLAYER_START_ROW))
scene.cameraFollowSprite(mySprite)
controller.moveSprite(mySprite, NORMAL_SHIP_SPEED, NORMAL_SHIP_SPEED)
let myEnemy = sprites.create(createShipImage(true), SpriteKind.Enemy)
tiles.placeOnTile(myEnemy, tiles.getTileLocation(PIRATE_COL, PIRATE_ROW))
myEnemy.follow(mySprite, 45)
homePort = sprites.create(createUnionJackPortImage(), SpriteKind.HomePort)
tiles.placeOnTile(homePort, tiles.getTileLocation(HOME_PORT_COL, HOME_PORT_ROW))
homePort.z = 2
cargo = sprites.create(createCargoImage(), SpriteKind.Cargo)
tiles.placeOnTile(cargo, tiles.getTileLocation(CARGO_COL, CARGO_ROW))
let fortOne = sprites.create(createFortImage(1), SpriteKind.FortMarker)
tiles.placeOnTile(fortOne, tiles.getTileLocation(FORT_ONE_COL, FORT_ONE_ROW))
let fortTwo = sprites.create(createFortImage(2), SpriteKind.FortMarker)
tiles.placeOnTile(fortTwo, tiles.getTileLocation(FORT_TWO_COL, FORT_TWO_ROW))
colony = sprites.create(createColonyImage(), SpriteKind.ColonyMarker)
tiles.placeOnTile(colony, tiles.getTileLocation(COLONY_COL, COLONY_ROW))
colony.z = 2
colonyNPC = sprites.create(createTraderImage(), SpriteKind.ColonyNPC)
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
            cargo = sprites.create(createCargoImage(), SpriteKind.Cargo)
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
