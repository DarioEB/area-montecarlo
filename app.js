import inquirer from "inquirer";
import colors from 'colors';

const N = 1000000;

const readInput = async (message) => {
    const q = [{
        type: 'input',
        name: 'radio',
        message,
        validate(value) {
            if(value === '') {
                return 'Debe ingresar un valor.'
            }
            if(isNaN( Number(value) )) {
                return 'Debe ingresar un valor numérico.'
            } 
            return true;
        }
    }]

    const { radio } = await inquirer.prompt(q);

    return radio;
}

const main = async () => {
    console.clear();
    console.log('###################################################\n'.blue.bgWhite)
    console.log('                  Metodo Montecarlo'.red)
    let  inside = 0, outside = 0;
    
    const radio = await readInput('Ingrese el radio: '.red)

    const start = process.hrtime();
    for(let i = 0; i < N ; i++) {
        (genRandom(radio) <= radio) ? inside++ : outside++;
    }

    const total = outside + inside;
    const area = 4*(inside/total)*Math.pow(radio, 2);
    const err = ((Math.PI * Math.pow(radio, 2)) - area ) / (Math.PI * Math.pow(radio, 2));
    
    console.log(`\t     Puntos que caen dentro del circulo: ${inside * 4}`.green);
    console.log(`\t     Puntos que caen fuera del circulo: ${outside * 4}`.green);

    const end = process.hrtime(start);
    
    console.log(`\t     Area aproximada calculo con el método: ${area}`.green);
    console.log(`\t     Area real: ${Math.PI * Math.pow(radio, 2)}`.green);
    
    console.log(`\t     Error relativo: ${err}`.green);

    console.log(`\t     Tiempo de ejecución ${end[0]} s y ${end[1]/1000000} ms`.green);
    console.log('\n###################################################'.blue.bgWhite)
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