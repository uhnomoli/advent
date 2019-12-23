package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strconv"
    "strings"
)


func main() {
    frequency := 0
    numbers, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    for _, number := range strings.Split(string(numbers), "\n") {
        if value, err := strconv.Atoi(number); err == nil {
            frequency += value
        }
    }

    fmt.Printf("The frequency is: %d\n", frequency)
}

