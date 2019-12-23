package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "os"
    "strings"
)


func id_compare(a string, b string) (int, []int) {
    a_length := len(a)
    b_length := len(b)

    id_distance := b_length - a_length
    id_length := a_length
    if b_length < a_length {
        id_distance = a_length - b_length
        id_length = b_length
    }

    id_difference := make([]int, 0, id_length)
    for i := 0; i < id_length; i++ {
        if a[i] != b[i] {
            id_difference = append(id_difference, i)
            id_distance++
        }
    }

    return id_distance, id_difference
}


func main() {
    ids := make([]string, 0, 64)

    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    for _, id := range strings.Split(string(data), "\n") {
        if len(id) == 0 { continue }

        ids = append(ids, id)
    }

    id_count := len(ids)
    for i := 0; i < id_count; i++ {
        for j := i + 1; j < id_count; j++ {
            distance, difference := id_compare(ids[i], ids[j])
            if distance == 1 {
                character := string(ids[i][difference[0]])

                fmt.Printf("The box IDs are: %s and %s\n", ids[i], ids[j])
                fmt.Printf("The common indexs are: %s\n", strings.Replace(
                    ids[i], character, "", -1))

                os.Exit(0)
            }
        }
    }
}

