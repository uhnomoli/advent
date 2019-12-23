package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strings"
)


func abs(x byte, y byte) (int) {
    distance := int(x) - int(y)

    if distance < 0 { return -distance }

    return distance
}

func react(polymer string) (int) {
    for {
        length := len(polymer)
        reaction := false

        for i := 0; i < length - 1; i++ {
            current := polymer[i]
            next := polymer[i+1]

            if abs(current, next) == 32 {
                polymer = polymer[0:i] + polymer[i+2:length]
                length = len(polymer)
                reaction = true

                i--
            }
        }

        if !reaction { break }
    }

    return len(polymer)
}


func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    polymer := strings.TrimSpace(string(data))

    fmt.Printf("The answer is: %d units\n", react(polymer))
}

