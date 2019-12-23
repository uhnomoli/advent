package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "strconv"
    "strings"
)


type Boundary struct {
    str string
    num int
}

func (b *Boundary) Next(increment bool) (*Boundary) {
    num := b.num
    if increment { num += 1 }
    str := strconv.Itoa(num)

    length := len(str)
    bytes := make([]byte, length)
    bytes[0] = str[0]

    doubled := false
    repeated := 1

    for i := 1; i < length; i++ {
        if str[i] < bytes[i-1] {
            bytes[i] = bytes[i-1]
        } else if str[i] > bytes[i-1] && bytes[i-1] > str[i-1] {
            bytes[i] = bytes[i-1]
        } else {
            bytes[i] = str[i]
        }

        if bytes[i] == bytes[i-1] {
            repeated += 1
        } else {
            if repeated == 2 {
                doubled = true
            }

            repeated = 1
        }
    }

    var err error = nil
    str = string(bytes)
    num, err = strconv.Atoi(str)
    if err != nil { log.Fatal(err) }

    b.str = str
    b.num = num

    if doubled || repeated == 2 {
        return b
    } else {
        return b.Next(true)
    }
}

func NewBoundary(str string) (*Boundary) {
    num, err := strconv.Atoi(str)
    if err != nil { log.Fatal(err) }

    return &Boundary{str: str, num: num}
}


func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    boundaries := strings.Split(strings.TrimSpace(string(data)), "-")
    start := NewBoundary(boundaries[0])
    end := NewBoundary(boundaries[1])

    fmt.Printf("[+] Start=%s, End=%s\n", start.str, end.str)
    fmt.Printf("[+] First=%s\n", start.Next(false).str)

    password_count := 1
    for {
        start.Next(true)
        if start.num < end.num {
            password_count += 1
            fmt.Printf("\t[%04d] %s\n", password_count, start.str)
        } else {
            break
        }
    }

    fmt.Printf("[+] Password count=%d\n", password_count)
}

