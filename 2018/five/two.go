package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "log"
)


func min(x int, y int) (int) {
    if x < y { return x }

    return y
}


func react(polymer []byte, ignore byte) ([]byte) {
    polymer = append(polymer[:0:0], polymer...)

    for {
        length := len(polymer)
        reaction := false

        for i := 1; i < length; i++ {
            current := polymer[i]
            previous := polymer[i-1]

            if current & 31 == ignore {
                polymer = append(polymer[:i], polymer[i+1:]...)
                length = len(polymer)

                i--
            } else if current ^ previous == 32 {
                polymer = append(polymer[:i-1], polymer[i+1:]...)
                length = len(polymer)
                reaction = true

                i--
            }
        }

        if !reaction { return polymer }
    }
}


func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    polymer := react(bytes.TrimSpace(data), 0)
    length := len(polymer)

    for c := byte(1); c < byte(27); c++ {
        length = min(length, len(react(polymer, c)))
    }

    fmt.Printf("The answer is: %d units\n", length)
}

