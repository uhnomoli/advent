package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "os"
    "sort"
    "strconv"
    "strings"
)


func frequency_seen(frequencies []int, frequency int) bool {
    i := sort.SearchInts(frequencies, frequency)
    if i < len(frequencies) && frequencies[i] == frequency {
        return true
    }

    return false
}


func main() {
    frequencies := make(map[int]bool)
    frequency := 0

    for {
        numbers, err := ioutil.ReadFile("input.txt")
        if err != nil { log.Fatal(err) }

        for _, number := range strings.Split(string(numbers), "\n") {
            value, err := strconv.Atoi(number)
            if err != nil { continue }

            frequencies[frequency] = true
            frequency += value

            if _, seen := frequencies[frequency]; seen == true {
                fmt.Printf("The first repeated frequency was: %d\n", frequency)

                os.Exit(0)
            }
        }
    }
}

