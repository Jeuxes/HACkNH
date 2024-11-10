
export const allInterests = [
    'Pop Music',
    'Rock Music',
    'Hip-Hop/Rap Music',
    'EDM',
    'Classical Music',
    'Indie/Alternative Music',
    'Reserved Music 1',
    'Reserved Music 2',
    'Science',
    'Literature',
    'History',
    'Politics/Current Affairs',
    'Philosophy',
    'Technology & Innovation',
    'Business/Entrepreneurship',
    'Environmental Issues',
    'Fitness',
    'Socializing',
    'Mental Health',
    'Gaming',
    'Streaming/Watching TV',
    'Travel',
    'Food',
    'Volunteer/Community Service',
    'Art',
    'Music Production',
    'DIY Projects',
    'Sports',
    'Reserved Misc. 1 ',
    'Reserved Misc. 2 ',
    'Reserved Misc. 3 ',
    'Reserved Misc. 4 '
]

export const packInterests = (interests) => {
    let packed = 0;

    let unrecognized = interests.find((item) => !allInterests.includes(item))

    if (unrecognized) {
        console.warn(`WARNING: Unrecognized interest ${unrecognized}`)
    }

    allInterests.forEach((item, index) => {
        if (interests.includes(item)) {
            packed |= (1 << index)
        }
    })

    return packed
}

export const unpackInterests = (interests) => {
    let unpacked = []

    for (let i=0; i<32; i++) {
        if ((interests & (1 << i)) > 0) {
            unpacked.push(allInterests[i])
        }
    }

    return unpacked
}
