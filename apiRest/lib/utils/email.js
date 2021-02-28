const clean = (email) => {
    return typeof email !== 'string' ? email : email.toLowerCase().trim()
}

const errSig = {
    msg: 'email error',
    status: 400,
    debug: {},
}

const emailValidate = (value) => {
    const defaultRegex = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/)

    let usernameRegex = [
        'charonne.cassidy|',
        '(|.*[-_.])abuse(|[-_.].*)|',
        '(|.*[-_.])admins?(|[-_.].*)|',
        '(|.*[-_.])contacts?(|[-_.].*)|',
        '(|.*[-_.])host(s|master?)?(|[-_.].*)|',
        '(|.*[-_.])infos?(|[-_.].*)|',
        '(|.*[-_.])ipadmin(|[-_.].*)|',
        '(|.*[-_.])noc(|[-_.].*)|',
        '(|.*[-_.])postmaster(|[-_.].*)|',
        '(|.*[-_.])pourriel(|[-_.].*)|',
        '(|.*[-_.])roots?(|[-_.].*)|',
        '(|.*[-_.])security(|[-_.].*)|',
        '(|.*[-_.])spam(|[-_.].*)|',
        '(|.*[-_.])tech(|[-_.].*)|',
        '(|.*[-_.])webmasters?(|[-_.].*)|',
        '(|.*[-_.])maddox(|[-_.].*)|',
        '(|.*[-_.])nexus(|[-_.].*)|',
        '(|.*[-_.])test(|[-_.].*)',
    ].join('')

    let domainRegex = [
        'agora\\.bungi\\.com|',
        'amen\\.fr|',
        'bungi\\.com|',
        'emailvision\\.com|',
        'france-strategies\\.com|',
        'gandi\\.net|',
        'illiad\\.fr|',
        'justice\\.fr|',
        'koszmail\\.pl|',
        'node\\.com|',
        'operamail\\.com|',
        'ovh\\.net|',
        'proxad\\.net|',
        'sdgsd\\.com|',
        'tim\\.it|',
        'tiscali\\.fr|',
        'totalcommunications\\.com|',
        'wrwer\\.com|',
        'anacode\\.com|',
        'ambassade-\\+|',
        'caramail\\..+|',
        'fre\\..+|',
        'freee\\..+|',
        'gmai\\..+|',
        'gmaill\\..+|',
        'hotmai\\..+|',
        'hotmaill\\..+|',
        'lycos.+|',
        'spamgourmet\\.+|',
        'tele2\\.+|',
        'test\\.+|',
        'voila\\..+|',
        'yaho\\..+|',
        'yahooo\\..+|',
        'yopmail.+|',
        '.+\\.bg|',
        '.+\\.cn|',
        '.+\\.coom|',
        '.+\\.f|',
        '.+\\.ffr|',
        '.+\\.frr|',
        '.+\\.r|',
        '.+\\.ru|',
        '.+\\.th|',
        '.+otherinbox.com|',
        '\\.gouv\\.fr|',
        'avocat|',
        'dgccrf|',
        'signal-spam',
    ].join('')

    usernameRegex = new RegExp(
        '(?!.*\\b(' +
            usernameRegex +
            ")\\b.*)^([a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+)",
    )
    domainRegex = new RegExp(
        '@(?!.*\\b(' +
            domainRegex +
            ')\\b.*)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))?(?:\\.([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$',
    )

    if (typeof value !== 'string') {
        errSig.debug.value = value

        throw errSig
    }

    if (!defaultRegex.test(value)) {
        errSig.debug.regex = defaultRegex.toString()
        errSig.debug.value = value

        throw errSig
    }

    const username = value.substr(0, value.indexOf('@'))

    if (!usernameRegex.test(username)) {
        errSig.debug.regex = usernameRegex.toString()
        errSig.debug.username = username

        throw errSig
    }

    const domain = value.substr(value.indexOf('@'))

    if (!domainRegex.test(domain)) {
        errSig.debug.regex = domainRegex.toString()
        errSig.debug.domain = domain

        throw errSig
    }

    return true
}

module.exports = { emailValidate, clean }
