const checkEmpty = (data: any, key: string) => {
    // const empty = []
    // // console.log(key, data[key], data)
    // Object.keys(data[key]).map((k) => {
    //     if (data[key][k] > 0) empty.push(1)
    // })
    // return empty.length === 0
    if (data[key] === undefined) return 0
    else return 1
}

const writeToTextOr = (fm: string, d: any) => {
    for (const k of d) {
        const key = Object.keys(k)[0]
        const val = k[key]
        if (val > 0) fm = fm + key + ' or '
    }
    fm = fm.substr(0, fm.length - 4) + '.'
    return fm
}

const writeToTextComma = (fm: string, d: any) => {
    for (const k of d) {
        const key = Object.keys(k)[0]
        const val = k[key]
        if (val > 0) fm = fm + key + ', '
    }
    fm = fm.substr(0, fm.length - 2) + '.'
    return fm
}

export const generate = (data: any) => {
    let fm = ''
    let k = ''
    console.log(data['Setting'])
    console.log(data['Alignment'])
    if (checkEmpty(data, 'Encounter Type')) {
        const et = data['Encounter Type']
        fm = fm + 'It is a good time for a '
        fm = writeToTextOr(fm, et)
    }

    if (checkEmpty(data, 'DM Actions')) {
        const dma = data['DM Actions']
        fm = fm + ' As the DM, you should probably '
        fm = writeToTextOr(fm, dma)
    }

    if (checkEmpty(data, 'General Mood')) {
        const m = data['General Mood']
        fm = fm + ' The genral mood feels '
        fm = writeToTextComma(fm, m)
    }

    if (checkEmpty(data, 'Actions')) {
        const a = data.Actions
        fm = fm + 'There are probably characters doing '
        fm = writeToTextComma(fm, a)

        fm = fm + ' Better take note of that.'
    }

    if (checkEmpty(data, 'Races')) {
        const r = data.Races
        fm = fm + ' Some of the characters races include '
        fm = writeToTextComma(fm, r)
        fm = fm.substr(0, fm.length - 1) + ' among others.'
    }

    // if (checkEmpty(data, 'Weapons')) {
    //     const w = data.Weapons
    //     fm = fm + 'Some of the characters are wielding '
    //     fm = writeToTextComma(fm, w)
    // }

    if (checkEmpty(data, 'Alignment')) {
        const a = data.Alignment
        fm = fm + ' These characters aligmnets are '
        fm = writeToTextComma(fm, a)
        fm = fm + ' It should probably be accounted for when considering the next move.'
    }

    if (checkEmpty(data, 'General Time')) {
        const gt = data['General Time']
        fm = fm + ' It is '
        fm = writeToTextComma(fm, gt)
        fm = fm.substr(0, fm.length - 1) + ' time.'
    }

    if (checkEmpty(data, 'Time Of Day')) {
        const tod = data['Time Of Day']
        fm = fm + ' Around '
        fm = writeToTextComma(fm, tod)
        fm = fm.substr(0, fm.length - 1) + ' time.'
    }

    if (checkEmpty(data, 'Setting')) {
        const s = data.Setting
        fm = fm + ' The area includes '
        fm = writeToTextComma(fm, s)
        fm = fm.substr(0, fm.length - 1) + ' .Maybe the characters can use it for their adventage. Or maybe you can?'
    }

    if (checkEmpty(data, 'Misc / Statues Condition')) {
        const msc = data['Misc / Statues Condition']
        fm = fm + ' The characters are affected or receive a '
        fm = writeToTextOr(fm, msc)
    }

    return fm
}
