ld h, $03

.4MOD7:
    ldh a, [rDIV]
    ld b, a

.setAToZero:
    xor a

.nextB:
    dec b
    jr z, .floodCheck

    inc a
    inc a
    inc a
    inc a
    cp $1c
    jr z, .setAToZero

    jr .nextB

.floodCheck:
    ld d, a

    ldh a, [RAM-next-next]
    ld e, a
    dec h
    jr z, .pieceChosen

    or d
    or c
    and $fc
    cp c
    jr z, .upToDIV

.pieceChosen:
    ld a, d
    ldh [RAM-next-next], a