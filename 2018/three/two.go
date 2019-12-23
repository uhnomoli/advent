package main

import (
    "errors"
    "fmt"
    "io/ioutil"
    "log"
    "os"
    "regexp"
    "strconv"
    "strings"
)


type Claim struct {
    err error

    id int
    left int
    top int
    width int
    height int
    conflict bool
}

func (claim *Claim) parse_field(input string) (int) {
    output := -1

    if claim.err != nil { return output }
    if len(input) == 0 {
        claim.err = errors.New("field cannot be empty")
    } else {
        output, claim.err = strconv.Atoi(input)
    }

    return output
}

func NewClaim(fields ...string) (*Claim) {
    claim := &Claim{}

    if fields == nil || len(fields) != 6 {
        claim.err = errors.New("all fields are required")
    } else {
        claim.id = claim.parse_field(fields[1])
        claim.left = claim.parse_field(fields[2])
        claim.top = claim.parse_field(fields[3])
        claim.width = claim.parse_field(fields[4])
        claim.height = claim.parse_field(fields[5])
        claim.conflict = false
    }

    return claim
}

func NewFabric(width int, height int) ([][][]*Claim) {
    fabric := make([][][]*Claim, height)

    for i := 0; i < height; i++ {
        fabric[i] = make([][]*Claim, width)

        for j := 0; j < width; j++ {
            fabric[i][j] = make([]*Claim, 0, 8)
        }
    }

    return fabric
}


func main() {
    claims := make([]*Claim, 0, 64)
    format := regexp.MustCompile(`^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$`)
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    for _, line := range strings.Split(string(data), "\n") {
        if len(line) == 0 { continue }

        fields := format.FindStringSubmatch(line)
        claim := NewClaim(fields...)

        if claim.err != nil {
            log.Fatalf("Error parsing claim: %s\n", claim.err)
        }

        claims = append(claims, claim)
    }

    fabric := NewFabric(1000, 1000)

    for _, claim := range claims {
        for i := claim.top; i < claim.top + claim.height; i++ {
            for j := claim.left; j < claim.left + claim.width; j++ {
                length := len(fabric[i][j])
                if length == 1 {
                    fabric[i][j][0].conflict = true
                }

                if length > 0 {
                    claim.conflict = true
                }

                fabric[i][j] = append(fabric[i][j], claim)
            }
        }
    }

    for _, claim := range claims {
        if claim.conflict == false {
            fmt.Printf("Claim ID #%d had no overlap\n", claim.id)

            os.Exit(0)
        }
    }
}

