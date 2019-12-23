package main

import (
    "errors"
    "fmt"
    "io/ioutil"
    "log"
    "regexp"
    "sort"
    "strconv"
    "strings"
    "time"
)


const TABLE_HEADER = `
Date   ID     Minute
              000000000011111111112222222222333333333344444444445555555555
              012345678901234567890123456789012345678901234567890123456789`


type Schedule struct {
    id int
    total int
    minutes []int
    occurrences map[int]int
}

func (schedule *Schedule) update(minutes []int) {
    for _, minute := range minutes {
        if _, ok := schedule.occurrences[minute]; ok {
            schedule.occurrences[minute]++
        } else {
            schedule.minutes = append(schedule.minutes, minute)
            schedule.occurrences[minute] = 1
        }

        schedule.total++
    }

    sort.Slice(schedule.minutes, func(i, j int) (bool) {
        a := schedule.occurrences[schedule.minutes[i]]
        b := schedule.occurrences[schedule.minutes[j]]

        return a > b
    })
}

func NewSchedule() (*Schedule) {
    schedule := &Schedule{}
    schedule.minutes = make([]int, 0, 64)
    schedule.occurrences = make(map[int]int)

    return schedule
}


type Event struct {
    err error
    id int
    asleep bool
    awake bool
    time time.Time
}

func (event *Event) parse_field(input string) (int) {
    output := -1

    if event.err != nil { return output }
    if len(input) == 0 {
        event.err = errors.New("field cannot be empty")
    } else {
        output, event.err = strconv.Atoi(input)
    }

    return output
}

func NewEvent(fields ...string) (*Event) {
    event := &Event{}

    if fields == nil || len(fields) != 4 {
        event.err = errors.New("invalid event")
    } else {
        event.time, event.err = time.Parse("2006-01-02 15:04", fields[1])

        switch fields[2] {
        case "falls asleep":
            event.asleep = true
        case "wakes up":
            event.awake = true
        default:
            event.id = event.parse_field(fields[3])

            if event.time.Hour() != 0 {
                minutes := time.Duration(60 - event.time.Minute())
                event.time = event.time.Add(time.Minute * minutes)
            }
        }
    }

    return event
}


func PrintEntry(events []*Event) (int, []int) {
    elapsed := 0
    slept := make([]int, 0, 64)

    for i, event := range events {
        if i == 0 {
            fmt.Printf("%s  #%04d  ", event.time.Format("01-02"), event.id)
        } else {
            previous := events[i-1]
            minutes := int(event.time.Sub(previous.time).Minutes())
            elapsed += minutes

            if event.awake {
                fmt.Print(strings.Repeat("#", minutes))

                for i := previous.time.Minute(); i < event.time.Minute(); i++ {
                    slept = append(slept, i)
                }
            } else {
                fmt.Print(strings.Repeat(".", minutes))
            }
        }
    }

    if remaining := 60 - elapsed; remaining > 0 {
        fmt.Print(strings.Repeat(".", remaining))
    }

    fmt.Println()

    return events[0].id, slept
}

func PrintEntries(events []*Event) {
    fmt.Println(TABLE_HEADER)

    guards := make(map[int]*Schedule)
    schedules := make([]*Schedule, 0, 16)
    head := 0

    for i, event := range events {
        if i == 0 { continue }
        if event.id > 0 {
            id, slept := PrintEntry(events[head:i])

            var schedule *Schedule
            if _, ok := guards[id]; !ok {
                schedule = NewSchedule()
                schedule.id = id

                guards[id] = schedule
                schedules = append(schedules, schedule)
            } else {
                schedule = guards[id]
            }

            schedule.update(slept)

            head = i
        }
    }

    sort.Slice(schedules, func(i, j int) (bool) {
        a := schedules[i]
        b := schedules[j]

        if len(a.minutes) < 1 { return false }
        if len(b.minutes) < 1 { return true }

        return a.occurrences[a.minutes[0]] > b.occurrences[b.minutes[0]]
    })

    schedule := schedules[0]

    fmt.Printf("\nThe answer is: %d (guard) * %d (minute) =  %d\n",
        schedule.id, schedule.minutes[0], schedule.id * schedule.minutes[0])
}


func main() {
    data, err := ioutil.ReadFile("input.txt")
    if err != nil { log.Fatal(err) }

    event_re := regexp.MustCompile(`^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\] (Guard #(\d+)|falls asleep|wakes up)`)
    events := make([]*Event, 0, 64)

    for _, line := range strings.Split(string(data), "\n") {
        if len(line) == 0 { continue }

        fields := event_re.FindStringSubmatch(line)
        event := NewEvent(fields...)

        if event.err != nil {
            log.Fatalf("Error parsing log: %s\n", event.err)
        }

        events = append(events, event)
    }

    sort.Slice(events, func(i, j int) (bool) {
        a, b := events[i], events[j]
        since := a.time.Sub(b.time).Nanoseconds()

        if since == 0 {
            return a.id > 0
        }

        return since < 0
    })

    PrintEntries(events)
}

