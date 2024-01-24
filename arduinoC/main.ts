
enum Motor {
    //% block="New_Motor"
    A,
    //% block="Old_Motor"
    B
}

//% color="#AA278D" iconWidth=50 iconHeight=40
namespace maqueenPlusMotorMap {
    //% block="[Motor] [Speed]" blockType="reporter"
    //% Motor.shadow="dropdown" Motor.options="Motor" Motor.defl="Motor.A"
    //% Speed.shadow="range" Speed.params.min=0 Speed.params.max=255 Speed.defl=200
    export function motorMap(parameter: any, block: any) {
        let motor = parameter.Motor.code;
        let speed = parameter.Speed.code;
        let outputSpeed = 0;
        let code = '';
        if (motor === "A") {
            if (parameter.Speed.parType === "math_range") {
                if(speed > 255) {
                    outputSpeed = 255;
                } else if (speed > 200 && speed <= 255) {
                    outputSpeed = Math.round(0.43*speed);
                } else if (speed > 150 && speed <= 200) {
                    outputSpeed = Math.round(0.75*speed - 0.0016*speed*speed);
                } else if (speed > 100 && speed <= 150) {
                    outputSpeed = Math.round(0.9*speed - 0.0024*speed*speed);
                } else if (speed > 50 && speed <= 100) {
                    outputSpeed = Math.round(1.23*speed - 0.006*speed*speed);
                } else {
                    outputSpeed = speed;
                }
                code = `${outputSpeed}`;
            } else {
                let func = [
                    'uint8_t speedMap(uint8_t speed)',
                    '{',
                    '  float outputSpeed;',
                    '  if(speed > 255) {',
                    '    outputSpeed = 255;',
                    '  } else if (speed > 200 && speed <= 255) {',
                    '    outputSpeed = 0.43*speed;',
                    '  } else if (speed > 150 && speed <= 200) {',
                    '    outputSpeed = 0.75*speed - 0.0016*speed*speed;',
                    '  } else if (speed > 100 && speed <= 150) {',
                    '    outputSpeed = 0.9*speed - 0.0024*speed*speed;',
                    '  } else if (speed > 50 && speed <= 100) {',
                    '    outputSpeed = 1.23*speed - 0.006*speed*speed;',
                    '  } else {',
                    '    outputSpeed = speed;',
                    '  }',
                    '  return outputSpeed;',
                    '}'
                ];
                this.addFunction("speedMap", "uint8_t", "speedMap", "uint8_t speed", func);
                code = `speedMap(${speed})`;
            }
        } else {
            code = `${speed}`;
        }
		Generator.addCode([code, this.ORDER_ATOMIC]);
    }
}
