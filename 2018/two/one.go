package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strings"
)


func id_parse(id string) (int, int) {
    two, three := 0, 0
    characters := make(map[rune]int)

    for _, character := range id {
        if _, seen := characters[character]; seen == false {
            characters[character] = 1

            continue
        }

        characters[character]++

        switch characters[character] {
        case 2:
            two++
        case 3:
            two--
            three++
        }
    }

    return two, three
}


func main() {
    twos, threes := 0, 0

    ids, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    for _, id := range strings.Split(string(ids), "\n") {
        if len(id) == 0 { continue }

        two, three := id_parse(id)
        if two > 0 { twos++ }
        if three > 0 { threes++ }
    }

    fmt.Printf("The checksum is: %d\n", twos * threes)
}

