function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const nombreToHeure2 = (n) => {
    let reste = n - Math.floor(n)
    let prince = Math.floor(n).toString().length == 1 ? "0" + Math.floor(n).toString() : Math.floor(n).toString()
    if (reste > 0) return prince + ":" + Math.round(reste * 60)
    return prince + ":00"
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const makeIcs = ( targets ) => {
    
    const newLine = '\r\n';
    let data = 'BEGIN:VCALENDAR' + newLine + 'VERSION:2.0' + newLine + 'PRODID: ' + uuidv4() + newLine + 'CALSCALE:GREGORIAN' + newLine
    targets.forEach(target => {

        data += 'BEGIN:VEVENT' + newLine +
            `DTSTART:${target.date.format('YYYYMMDD')}T${target.timeFrom.replace(/\D/g, '')}00` + newLine +
            `DTEND:${target.date.format('YYYYMMDD')}T${target.timeTo.replace(/\D/g, '')}00` + newLine +
            // `ORGANIZER;CN=${target.authorName}` + newLine +
            // `DESCRIPTION:${target.description.split('\n').join('\n ')}` + newLine +
            `SUMMARY:${target.title}` + newLine +
            'END:VEVENT' + newLine 
    })
    
    data += 'END:VCALENDAR'
    return data
}

const fromEDTtoIcs = (edt,semaine) => {
    // console.log(edt, semaine)
    const base = semaine.split("/");
    let jours = []

    let init = (new Date(Number("20" + base[2]), Number(base[1]) - 1, Number(base[0]))).getTime()
    let start = new Date(init)
    for (let i = 0; i < 6; i++) {
        jours.push(new Date(init + i * 24 * 3600 * 1000))
    }

    let targets = []
    for (let jour = 0; jour < edt.length; jour++) {
        edt[jour].forEach(cours => {
            let date = moment(jours[jour])
            let timeFrom = nombreToHeure2(cours[2])
            let timeTo = nombreToHeure2(cours[3])
            let title = cours[0] + " (" + cours[1] + ")"
            targets.push({
                date,
                timeFrom,
                timeTo,
                title
            })
        })
    }
    // console.log(targets)

    const res = makeIcs(targets)
    document.getElementById("DownEDT").onclick = () => {
        download("edt.ics", res)
    }
    // console.log(jours)
}