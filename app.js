import inquirer from "inquirer";
import colors from 'colors';
import fs from 'fs';

const N = 10000;

const readInput = async (message, number = false) => {
    const q = [{
        type: 'input',
        name: 'response',
        message,
        validate(value) {
            if (number) {
                if (value === '') {
                    console.log('Debes ingresar un número')
                }
                if (isNaN(Number(value))) {
                    console.log('El valor debe ser numérico')
                }
                return true;
            } else {
                if (value === '') {
                    console.log('No puede ingresar campos vacios')
                }
                return true;
            }
        }
    }]

    const { response } = await inquirer.prompt(q);

    return response;
}

const saveFile = (data, filename) => {
    const file = `./files/${filename}.json`;

    fs.writeFileSync(file, JSON.stringify(data));
}

const main = async () => {
    console.clear();
    console.log('###################################################\n'.blue.bgWhite)
    console.log('                  Metodo Montecarlo'.red)

    const radio = await readInput('Ingrese el radio: '.red, true);
    const filename = await readInput('Ingrese el nombre de archivo: '.red);
    const iter = await readInput('Ingrese la cantidad de muestras: '.red);
    let arrayData = []

    for (let j = 0; j < iter; j++) {
        let inside = 0, outside = 0;
        let start = process.hrtime();
        
        for (let i = 0; i < N; i++) {
            (genRandom(radio) <= radio) ? inside++ : outside++;
        }

        const total = outside + inside;
        const area = 4 * (inside / total) * Math.pow(radio, 2);
        const err = ((Math.PI * Math.pow(radio, 2)) - area) / (Math.PI * Math.pow(radio, 2));
        
        let end = process.hrtime(start);

        
        console.log(`\t     Puntos que caen dentro del circulo: ${inside * 4}`.green);
        console.log(`\t     Puntos que caen fuera del circulo: ${outside * 4}`.green);

        console.log(`\t     Area aproximada calculo con el método: ${area}`.green);
        console.log(`\t     Area real: ${Math.PI * Math.pow(radio, 2)}`.green);

        console.log(`\t     Error relativo: ${err}`.green);

        console.log(`\t     Tiempo de ejecución ${end[0]} s y ${end[1] / 1000000} ms`.green);
        console.log('\n###################################################'.blue.bgWhite)

        arrayData.push({
                total,
                apArea: area,
                error: err,
                execTime: `${end[0]}s:${end[1] / 1000000}ms`
        });
    }

    saveFile({data: arrayData}, filename);
}

const genRandom = (r) => {
    const x = Math.random() * r;
    const y = Math.random() * r;

    // console.log(Math.pow(x, 2));
    // console.log(Math.pow(y, 2));

    const len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return len;
}

main()