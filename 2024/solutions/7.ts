interface Equation {
    operands: number[];
    result: number;
    solutions: number;
}

type Operator = (a: number, b: number) => number;


function operator_add(a: number, b: number): number {
    return a + b;
}

function operator_concatenate(a: number, b: number): number {
    const digits = Math.floor(Math.log10(b)) + 1;

    return a * Math.pow(10, digits) + b;
}

function operator_multiply(a: number, b: number): number {
    return a * b;
}


function equation_solve(
        equation: Equation,
        operators: Operator[],
        result: number,
        index: number): void {
    if (result > equation.result) { return; }

    if (index !== equation.operands.length) {
        for (const operator of operators) {
            equation_solve(
                equation,
                operators,
                operator(result, equation.operands[index]),
                index + 1);
        }
    } else if (result === equation.result) {
        ++equation.solutions;
    }

    return;
}


function first(equations: Equation[]): void {
    let result = 0;

    const operators: Operator[] = [
        operator_add,
        operator_multiply];

    for (const equation of equations) {
        equation_solve(equation, operators, equation.operands[0], 1);
        if (equation.solutions > 0) {
            result += equation.result;
        }
    }

    console.log(`[.] Solution: ${result}`);
}

function second(equations: Equation[]): void {
    let result = 0;

    const operators: Operator[] = [
        operator_add,
        operator_concatenate,
        operator_multiply];

    for (const equation of equations) {
        equation_solve(equation, operators, equation.operands[0], 1);
        if (equation.solutions > 0) {
            result += equation.result;
        }
    }

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const equations: Equation[] = [];
        for (const line of data.split('\n')) {
            const [result, operands] = line.split(': ');

            equations.push({
                result: parseInt(result, 10),
                operands: operands.split(' ')
                    .map((operand) => parseInt(operand, 10)),
                solutions: 0});
        }

        if (part === 1) {
            first(equations);
        } else {
            second(equations);
        }
    });
}

