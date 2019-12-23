package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strconv"
    "strings"
)


func module_fuel_calculate(module string) (int) {
    mass, err := strconv.Atoi(module)
    if err != nil {
        log.Fatalf("Invalid module mass: %s\n", module)
    }

    return (mass / 3) - 2
}


func main() {
    modules, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    fuel := 0;
    for _, module := range strings.Split(string(modules), "\n") {
        if module != "" {
            fuel += module_fuel_calculate(module)
        }
    }

    fmt.Printf("The amount of fuel required is: %d\n", fuel)
}

