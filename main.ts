let password = "1234"
let inputPassword = ""
let accessGranted = false

// Pins setup
let ledRojo = DigitalPin.P0
let ledVerde = DigitalPin.P1
let ledAmarillo = DigitalPin.P2
let ledAzul = DigitalPin.P8
let ledBlanco1 = DigitalPin.P12
let ledBlanco2 = DigitalPin.P13
let ventilador = DigitalPin.P14
let servoPin = AnalogPin.P15

// Setup servo motor control variables
let servoAngle = 0

// Función para mover servo
function setServoAngle(angle: number) {
    // Map angle 0-180 to pulse width between 500-2500 microseconds
    let pulseWidth = 500 + (angle * 2000 / 180)
    pins.servoWritePin(servoPin, angle)
    servoAngle = angle
}

// Función para mostrar error
function errorAccess() {
    basic.showString("û")
    music.startMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once)
    pins.digitalWritePin(ledRojo, 1)
    basic.pause(3000)
    pins.digitalWritePin(ledRojo, 0)
}

// Función para acceso correcto
function successAccess() {
    basic.showString("ü")
    music.startMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once)
    pins.digitalWritePin(ledVerde, 1)
    setServoAngle(90)
    basic.pause(5000)
    setServoAngle(0)
    pins.digitalWritePin(ledVerde, 0)
}

input.onButtonPressed(Button.A, function () {
    // Simulamos digitar contraseña con botones A y B
    // Aquí para ejemplo agregamos "1" al ingresar A
    if (!accessGranted) {
        inputPassword += "1"
        basic.showString("1")
    }
})

input.onButtonPressed(Button.B, function () {
    // Simulamos digitar contraseña con botón B agregando "2"
    if (!accessGranted) {
        inputPassword += "2"
        basic.showString("2")
    }
})

input.onButtonPressed(Button.AB, function () {
    // Presionar A+B para confirmar contraseña
    if (!accessGranted) {
        if (inputPassword == password) {
            accessGranted = true
            successAccess()
        } else {
            errorAccess()
        }
        inputPassword = ""
    }
})

// Control de temperatura: Mostrar al presionar logo
input.logoEvent(TouchButtonEvent.Pressed, function () {
    let temp = input.temperature()
    basic.showNumber(temp)
    basic.showString("C")
    if (temp > 27) {
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        pins.digitalWritePin(ledAmarillo, 1)
        pins.digitalWritePin(ventilador, 1)
        basic.pause(3000)
        pins.digitalWritePin(ledAmarillo, 0)
        pins.digitalWritePin(ventilador, 0)
    } else if (temp < 17) {
        music.startMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once)
        pins.digitalWritePin(ledAzul, 1)
        // Esperar hasta que temperatura sea mayor o se mantenga presionado 3 segundos
        let waiting = true
        let startTime = input.runningTime()
        while (waiting) {
            basic.pause(100)
            if (input.temperature() >= 17) {
                waiting = false
            }
            if (input.logoIsPressed() && (input.runningTime() - startTime) >= 3000) {
                waiting = false
            }
        }
        pins.digitalWritePin(ledAzul, 0)
    }