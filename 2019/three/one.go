package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "math"
    "strconv"
    "strings"
)


func abs(n int) (int) {
    if (n < 0) { return -n }

    return n
}

func max(a, b int) (int) {
    if (a > b) { return a }

    return b
}

func min(a, b int) (int) {
    if (a < b) { return a }

    return b
}

func zero(x float64) (bool) {
    var epsilon float64 = 1 / 1000000

    return math.Abs(x) < epsilon
}


type Point struct {
    x, y float64
}

func (a Point) Add(b *Point) (result *Point) {
    return &Point{
        x: a.x + b.x,
        y: a.y + b.y}
}

func (a Point) Cross(b *Point) (result float64) {
    return a.x * b.y - a.y * b.x
}

func (a Point) Distance(b *Point) (result float64) {
    x_distance := math.Max(a.x, b.x) - math.Min(a.x, b.x)
    y_distance := math.Max(a.y, b.y) - math.Min(a.y, b.y)

    return x_distance + y_distance
}

func (a Point) Dot(b *Point) (result float64) {
    return a.x * b.x + a.y + b.y
}

func (a Point) Equal(b *Point) (equal bool) {
    return (a.x == b.x) && (a.y == b.y)
}

func (a Point) Subtract(b *Point) (result *Point) {
    return &Point{
        x: a.x - b.x,
        y: a.y - b.y}
}

type Segment struct {
    direction string
    distance float64
    start *Point
    end *Point
}

func (a Segment) Intersects(b *Segment) (intersects bool, intersection *Point) {
    intersection = &Point{x: 0.0, y: 0.0}

    p, q := a.start, b.start
    r := &Point{
        x: a.end.x - a.start.x,
        y: a.end.y - a.start.y}
    s := &Point{
        x: b.end.x - b.start.x,
        y: b.end.y - b.start.y}

    r_s := r.Cross(s)
    q_p_r := q.Subtract(p).Cross(r)

    if zero(r_s) && zero(q_p_r) {
        t1 := q.Add(s.Subtract(p)).Dot(r) / r.Dot(r)
        t0 := t1 - s.Dot(r) / r.Dot(r)

        if t0 >= 0 && t0 <= 1 || t1 >= 0 && t1 <= 1 {
            return true, intersection
        }

        return false, intersection
    }

    if zero(r_s) && !zero(q_p_r) {
        return false, intersection
    }

    t := q.Subtract(p).Cross(s) / r.Cross(s)
    u := q.Subtract(p).Cross(r) / r.Cross(s)

    if !zero(r_s) && (t >= 0 && t <= 1) && (u >= 0 && u <= 1) {
        intersection.x = r.x * t + p.x
        intersection.y = r.y * t + p.y

        return true, intersection
    }

    return false, intersection
}

func (s Segment) Walk(distance float64) (p *Point) {
    p = &Point{x: s.start.x, y: s.start.y}

    switch s.direction {
    case "D":
        p.y -= distance
    case "L":
        p.x -= distance
    case "R":
        p.x += distance
    case "U":
        p.y += distance
    }

    return p
}

func NewSegment(origin *Point, vector string) (*Segment) {
    start := &Point{x: origin.x, y: origin.y}
    end := &Point{x: origin.x, y: origin.y}
    direction := vector[:1]
    distance, err := strconv.ParseFloat(vector[1:], 64)
    if err != nil { log.Fatal(err) }

    switch direction {
    case "D":
        end.y = start.y - distance
    case "L":
        end.x = start.x - distance
    case "R":
        end.x = start.x + distance
    case "U":
        end.y = start.y + distance
    default:
        log.Fatalf("invalid direction in vector: %s\n", vector)
    }

    return &Segment{
        direction: direction,
        distance: distance,
        start: start,
        end: end}
}


func path_parse(path string) ([]*Segment) {
    origin := &Point{x: 0.0, y: 0.0}
    vectors := strings.Split(path, ",")
    segments := make([]*Segment, 0, len(vectors))

    for _, vector := range vectors {
        segment := NewSegment(origin, vector)
        segments = append(segments, segment)

        origin.x, origin.y = segment.end.x, segment.end.y
    }

    return segments
}

func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    paths := strings.Split(strings.TrimSpace(string(data)), "\n")
    lines := make([][]*Segment, 0, len(paths))

    for _, path := range paths {
        lines = append(lines, path_parse(path))
    }

    var origin *Point = &Point{x: 0.0, y: 0.0}
    var closest *Point = nil
    var closest_distance float64 = 0.0

    var a_steps float64 = 0.0
    for _, a := range lines[0] {
        var b_steps float64 = 0.0
        for _, b := range lines[1] {
            intersects, intersection := a.Intersects(b)
            if intersects {
                distance := origin.Distance(intersection)
                if closest == nil || distance < closest_distance {
                    closest = intersection
                    closest_distance = distance
                }

                fmt.Printf(
                    "a{(%g, %g),(%g, %g)} intersects b{(%g, %g),(%g, %g)}\n",
                    a.start.x, a.start.y, a.end.x, a.end.y,
                    b.start.x, b.start.y, b.end.x, b.end.y)
                fmt.Printf("\tat (%g,%g)\n",
                    intersection.x, intersection.y)
                fmt.Printf("\twith an origin distance of %g\n",
                    intersection.Distance(origin))
                fmt.Printf("\twith an a distance of %g\n",
                    a_steps + intersection.Distance(a.start))
                fmt.Printf("\twith a b distance of %g\n",
                    b_steps + intersection.Distance(b.start))
                fmt.Printf("\twith a combined distance of %g\n",
                    a_steps + intersection.Distance(a.start) +
                    b_steps + intersection.Distance(b.start))
            }

            b_steps += b.distance
        }

        a_steps += a.distance
    }
}

