package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strconv"
    "strings"
)


type Instruction struct {
    address int
    memory []int

    length int
    opcode int
    parameters [][2]int
}

func (ins Instruction) Execute(program []int) {
}

func NewInstruction(program []int, address int) (*Instruction) {
    ins := &Instruction{}
    ins.address = address
    ins.memory = program

    encoded := strconv.Itoa(program[counter])
    encoded_length := len(encoded)

    var err error = nil
    ins.opcode, err = strconv.Atoi(encoded[encoded_length-2:])
    if err != nil { log.Fatal(err) }

    if ins.opcode < 3 { ins.length = 3 }
    else if ins.opcode < 99 { ins.length = 3 }

    modes := make([]int, ins.length, ins.length)
    for i := encoded_length - 3; i >= 0; i-- {
        modes[encoded_length-3-i] = int(encoded[i] - 0x30)
    }

    ins.paramters = make([][2]int, ins.length, ins.length)
    for i, mode := range modes {
        ins.parameters[i][0] = mode
        ins.parameters[i][1] = program[counter+1+i]
    }

    return ins
}


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
        case 3:
            var val int
            fmt.Print("[>] ")
            fmt.Scanf("%d", &val)

            program[program[counter+1]] = val
            counter += 2
        case 4:
            val := program[program[counter+1]]
            counter += 2

            fmt.Printf("[%d] %d\n", counter, val)
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

