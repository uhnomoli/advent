function report_check(report: number[], dampen: boolean = false): boolean {
    let safe = report_safe(report);
    if (safe || !dampen) { return safe; }

    for (let i = 0; i < report.length; ++i) {
        let dampened = [...report]

        dampened.splice(i, 1);

        if (report_safe(dampened)) { return true; }
    }

    return false;
}

function report_safe(report: number[]): boolean {
    let direction = 0;
    let previous = report[0];

    for (const [index, value] of report.slice(1).entries()) {
        let distance = previous - value;
        if (distance !== direction && (
                Math.min(distance, direction) < 0 &&
                Math.max(distance, direction) > 0)) {
            return false;
        }

        direction = distance;
        previous = value;

        distance = Math.abs(distance);
        if (distance < 1 || distance > 3) {
            return false;
        }
    }

    return true;
}


function first(reports: number[][]): void {
    let result = 0;
    for (const report of reports) {
        if (report_check(report)) { ++result; }
    }

    console.log(`[.] Solution: ${result}`);
}

function second(reports: number[][]): void {
    let result = 0;
    for (const report of reports) {
        if (report_check(report, true)) { ++result; }
    }

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        let reports: number[][] = [];
        for (const line of data.split('\n')) {
            reports.push(line.split(' ').map((value) => parseInt(value, 10)));
        }

        if (part === 1) {
            first(reports);
        } else {
            second(reports);
        }
    });
}

