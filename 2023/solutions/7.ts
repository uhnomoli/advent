enum HandType {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIR,
    THREE_KIND,
    FULL_HOUSE,
    FOUR_KIND,
    FIVE_KIND
}

enum RuleSet {
    JOKERS,
    STANDARD
}

interface Hand {
    bid: number;
    cards: number[];
    type: HandType;
}


function cards_parse(data: string, ruleset: RuleSet): number[] {
    const characters = data.split('');
    const values: number[] = [];

    for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        switch(character) {
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                values.push(parseInt(character, 10));

                break;
            case 'T':
                values.push(10);

                break;
            case 'J':
                values.push(ruleset === RuleSet.JOKERS ? 1 : 11);

                break;
            case 'Q':
                values.push(12);

                break;
            case 'K':
                values.push(13);

                break;
            case 'A':
                values.push(14);

                break;
            default:
                throw new Error(
                    `Invalid card: ${character}: must be: 2-9, T, J, Q, K, A`);
        }
    }

    return values;
}

function hand_parse(data: string, ruleset: RuleSet): Hand {
    const [cards, bid] = data.split(' ');

    return {
        bid: parseInt(bid, 10),
        cards: cards_parse(cards, ruleset),
        type: hand_type(cards, ruleset)};
}

function hand_sort(a: Hand, b: Hand): number {
    if (a.type !== b.type) { return a.type - b.type; }

    for (let i = 0; i < a.cards.length; i++) {
        if (a.cards[i] == b.cards[i]) { continue; }

        return a.cards[i] - b.cards[i];
    }

    return 0;
}

function hand_type(cards: string, ruleset: RuleSet): HandType {
    const jokers = ruleset === RuleSet.JOKERS ?
        cards.split('J').length - 1 : 0;
    let match = null;
    const re_one_pair = /(.)\1/;
    const re_full_house = /^((.)\2{1,2})((.)\4{1,2})$/;
    const re_three_kind = /.*?((.)\2{2})/;
    const re_two_pair = /.*?((.)\2).*?((.)\4)/;
    const sorted = cards.split('').toSorted().join('');

    if ((match = sorted.match(re_full_house)) !== null) {
        if (match[2] === match[4]) { return HandType.FIVE_KIND; }
        if (jokers !== 0) { return HandType.FIVE_KIND; }

        return HandType.FULL_HOUSE;
    }

    if ((match = sorted.match(re_two_pair)) !== null) {
        if (match[2] === match[4]) {
            if (jokers !== 0) { return HandType.FIVE_KIND; }

            return HandType.FOUR_KIND;
        }

        switch (jokers) {
            case 1:
                return HandType.FULL_HOUSE;
            case 2:
                return HandType.FOUR_KIND;
            default:
                return HandType.TWO_PAIR;
        }
    }

    if ((match = sorted.match(re_three_kind)) !== null) {
        switch (jokers) {
            case 1:
            case 3:
                return HandType.FOUR_KIND;
            default:
                return HandType.THREE_KIND;
        }
    }

    if ((match = sorted.match(re_one_pair)) !== null) {
        switch (jokers) {
            case 1:
            case 2:
                return HandType.THREE_KIND;
            default:
                return HandType.ONE_PAIR;
        }
    }

    if (jokers === 1) { return HandType.ONE_PAIR; }

    return HandType.HIGH_CARD;
}


function first(data: string): void {
    let result = 0;
    const hands: Hand[] = data.split('\n')
        .map(line => hand_parse(line, RuleSet.STANDARD));

    hands.sort(hand_sort);

    for (const [i, hand] of hands.entries()) {
        result += hand.bid * (i + 1);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let result = 0;
    const hands: Hand[] = data.split('\n')
        .map(line => hand_parse(line, RuleSet.JOKERS));

    hands.sort(hand_sort);

    for (const [i, hand] of hands.entries()) {
        result += hand.bid * (i + 1);
    }

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then(data => {
        data = data.trim();

        if (part === 1) {
            first(data);
        } else {
            second(data);
        }
    });
}

