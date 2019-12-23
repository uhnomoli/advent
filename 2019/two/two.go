package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "os"
    "strconv"
    "strings"
)


func program_execute(program []int, noun int, verb int) (int) {
    program[1] = noun
    program[2] = verb

    counter := 0
    for {
        switch program[counter] {
        case 1:
            lval := program[program[counter+1]]
            rval := program[program[counter+2]]
            program[program[counter+3]] = lval + rval
            counter += 4
        case 2:
            lval := program[program[counter+1]]
            rval := program[program[counter+2]]
            program[program[counter+3]] = lval * rval
            counter += 4
        case 99:
            return program[0]
        default:
            log.Fatalf("Invalid opcode: %d\n", program[counter])
        }
    }

    return -1
}

func program_init(data []byte) ([]int) {
    instructions := strings.Split(strings.TrimSpace(string(data)), ",")
    memory := make([]int, len(instructions))

    for i := range instructions {
        instruction, err := strconv.Atoi(instructions[i])
        if err != nil {
            log.Fatalf("invalid instruction at index: %d=%s\n",
                i, instructions[i])
        }

        memory[i] = instruction
    }

    return memory
}



func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    for noun := 0; noun < 100; noun++ {
        for verb := 0; verb < 100; verb++ {
            memory := program_init(data)
            result := program_execute(memory, noun, verb)

            if result == 19690720 {
                fmt.Printf("For noun=%d, verb=%d the answer=%d\n",
                    noun, verb, 100*noun+verb)

                os.Exit(0)
            }
        }
    }

    log.Fatalf("no solution found")
}

