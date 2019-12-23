package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strconv"
    "strings"
)


func execute(program []int) (int) {
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



func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    instructions := strings.Split(strings.TrimSpace(string(data)), ",")
    program := make([]int, len(instructions))

    for i := range instructions {
        instruction, err := strconv.Atoi(instructions[i])
        if err != nil {
            log.Fatalf("invalid instruction at index: %d=%s\n",
                i, instructions[i])
        }

        program[i] = instruction
    }

    result := execute(program)

    fmt.Printf("The value at position 0 is: %d\n", result)
}

