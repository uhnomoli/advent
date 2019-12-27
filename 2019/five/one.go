package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "os"
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

func (ins Instruction) Execute() (*Instruction) {
    pc := ins.address + ins.length + 1

    switch ins.opcode {
    case 1:
        ins.Store(3, ins.Fetch(1)+ins.Fetch(2))
    case 2:
        ins.Store(3, ins.Fetch(1)*ins.Fetch(2))
    case 3:
        var input int
        fmt.Print("[<] ")
        fmt.Scanf("%d", &input)

        ins.Store(1, input)
    case 4:
        fmt.Printf("[>] (%03d) %d\n", ins.address, ins.Fetch(1))
    case 5:
        if ins.Fetch(1) != 0 {
            pc = ins.Fetch(2)
        }
    case 6:
        if ins.Fetch(1) == 0 {
            pc = ins.Fetch(2)
        }
    case 7:
        value := 0
        if ins.Fetch(1) < ins.Fetch(2) {
            value = 1
        }

        ins.Store(3, value)
    case 8:
        value := 0
        if ins.Fetch(1) == ins.Fetch(2) {
            value = 1
        }

        ins.Store(3, value)
    case 99:
        fmt.Printf("[=] %d\n", ins.memory[0])

        os.Exit(0)
    default:
        log.Fatalf("Invalid opcode: %d\n", ins.opcode)
    }

    return NewInstruction(ins.memory, pc)
}

func (ins Instruction) Fetch(index int) (int) {
    if index > ins.length {
        log.Fatalf("Invalid parameter fetch: %d\n", index);
    }

    parameter := index - 1
    mode := ins.parameters[parameter][0]
    value := ins.parameters[parameter][1]

    if mode == 0 {
        return ins.memory[value]
    }

    return value
}

func (ins Instruction) Store(index int, value int) {
    if index > ins.length {
        log.Fatalf("Invalid parameter fetch: %d\n", index);
    }

    parameter := index - 1
    mode := ins.parameters[parameter][0]
    if mode != 0 {
        log.Fatalf("Illegal parameter mode for store instruction: %d\n", mode)
    }

    address := ins.parameters[parameter][1]
    ins.memory[address] = value
}

func NewInstruction(program []int, address int) (*Instruction) {
    ins := &Instruction{}
    ins.address = address
    ins.memory = program

    encoded := fmt.Sprintf("%05d", program[address])
    encoded_length := len(encoded)

    var err error = nil
    ins.opcode, err = strconv.Atoi(encoded[encoded_length-2:])
    if err != nil { log.Fatal(err) }

    if ins.opcode < 3 {
        ins.length = 3
    } else if ins.opcode < 5 {
        ins.length = 1
    } else  if ins.opcode < 7 {
        ins.length = 2
    } else if ins.opcode < 99 {
        ins.length = 3
    }

    modes := make([]int, ins.length, ins.length)
    for i := encoded_length-3; i > encoded_length-ins.length-3; i-- {
        modes[encoded_length-3-i] = int(encoded[i] - 0x30)
    }

    ins.parameters = make([][2]int, ins.length, ins.length)
    for i, mode := range modes {
        ins.parameters[i][0] = mode
        ins.parameters[i][1] = program[address+1+i]
    }

    return ins
}


func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    tokens := strings.Split(strings.TrimSpace(string(data)), ",")
    program := make([]int, len(tokens))

    for i, token := range tokens {
        value, err := strconv.Atoi(token)
        if err != nil {
            log.Fatalf("invalid token at index: %d=%s\n", i, token[i])
        }

        program[i] = value
    }

    instruction := NewInstruction(program, 0)
    for {
        instruction = instruction.Execute()
    }
}

