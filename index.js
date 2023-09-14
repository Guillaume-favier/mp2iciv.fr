
const conHeure = (n) => {
    if (typeof n == typeof 2) return n
    if (n.indexOf("h") > -1) {
        let nn = n.split("h")
        return Number(nn[0]) + (Number(nn[1]) / 60)
    } return Number(n)
}

jours = ["", "lundi", "mardi", "mercredi", "jeudi", "vendredi"]
async function getJson(url) {
    const response = await fetch(url);
    const jj = await response.json();
    return jj
}
async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
}

const backHour = (n) => {
    let reste = n - Math.floor(n)
    if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60)
    return Math.floor(n).toString() + "h"
}


var selectGrp = document.getElementById("grpKhole")
for (let i = 1; i <= 16; i++) {

    const opt = document.createElement("option")
    opt.value = i.toString()
    opt.innerText = "G" + i
    selectGrp.appendChild(opt)
}

var semaines = document.getElementById("semaine")
for (let i = 3; i < 19; i++) {

    const opt = document.createElement("option")
    opt.value = i.toString()
    opt.innerText = i
    semaines.appendChild(opt)
}

; (async () => {

    var txt = document.getElementById("outTxt")
    txt.innerText = "Chargement des donnÃ©es..."
    const db = await getJson("/kholes.json")
    const info = await getText("/info.txt")
    const orgEDT = await getJson("/EDT.json")
    let EDT = structuredClone(orgEDT)
    txt.innerHTML = "Traitement des donnÃ©es ..."
    let ninfo = []
    info.split("\n").forEach(lign => {
        ninfo.push(lign.split(" "))
    })


    let groupeK = 0;
    let groupeI = 0;
    let semaine = 3;
    let kholes = []
    for (let i = 0; i < 17; i++) {
        kholes.push([]);
    }

    const afficheCours = (m, nom) => {
        const p = document.createElement("p")
        p.innerText = nom + ", " + m[0] + " le " + jours[m[1]] + " Ã  " + (typeof m[2] == typeof 2 ? (m[2] + "h") : m[2]) + " en " + m[3]
        txt.appendChild(p)
    }
    const getKholes = (c, s) => {
        let all = [db["maths"][c - 1].concat(["maths"])]

        if (c % 2 == 1) {
            all.push(db["physique"][c - 1].concat(["physique"]))
        } else {
            all.push(db["anglais"][c - 1].concat(["anglais"]))
        }
        if (c == 1 || c == 10) {
            all.push(db["info"][c - 1].concat(["info"]))
        }
        if ((s % 2 == 0 && (c == 2 || c == 5)) || (s % 2 == 1 && (c == 9 || c == 14))) {
            all.push(db["francais"][c - 1].concat(["francais"]))
        }
        return all
    }





    const afficheSemaine = (c, s) => {
        txt.appendChild(document.createElement("br"))
        const h1 = document.createElement("h1")
        h1.innerText = "Semaine " + (s + 3) + " C" + c
        txt.appendChild(h1)

        afficheCours(db["maths"][c - 1], "Maths")
        if (c % 2 == 1) {
            afficheCours(db["physique"][c - 1], "Physique")
        } else {
            afficheCours(db["anglais"][c - 1], "Anglais")
        }
        if (c == 1 || c == 10) {
            afficheCours(db["info"][c - 1], "Informatique")
        }
        if ((s % 2 == 0 && (c == 2 || c == 5)) || (s % 2 == 1 && (c == 9 || c == 14))) {
            // console.log("test")
            afficheCours(db["francais"][c - 1], "FranÃ§ais")
        }
    }
    txt.innerHTML = "Choisir un groupe"
    const testparams = () => {
        return groupeK != 0
    }

    const makeEDT = () => {
        EDT = structuredClone(orgEDT)

        const vendrediAMrtrre = []
        const lundiAMettre = []
        if (semaine % 2 == 1) {

            if (groupeK % 2 == 1) {
                vendrediAMrtrre.push(["TD Maths", "20", 8, 10])
                vendrediAMrtrre.push(["TP Physique", "B214", 10, 12])

                lundiAMettre.push(["TD SI", "20", 9, 10])
                lundiAMettre.push(["Anglais", "jsp", 13, 14])
                lundiAMettre.push(["TD Physique", "20", 14, 16])
            } else {
                vendrediAMrtrre.push(["TD Maths", "20", 10, 12])
                vendrediAMrtrre.push(["TP Physique", "B214", 8, 10])

                lundiAMettre.push(["TD SI", "20", 10, 11])
                lundiAMettre.push(["Anglais", "jsp", 14, 15])
                lundiAMettre.push(["TD Physique", "20", 12, 14])
                console.log(lundiAMettre)
            }
        } else {
            console.log("test3")
            if (groupeK % 2 == 1) {
                vendrediAMrtrre.push(["TD Maths", "20", 10, 12])
                vendrediAMrtrre.push(["TP Physique", "B214", 8, 10])

                lundiAMettre.push(["TD SI", "20", 10, 11])
                lundiAMettre.push(["Anglais", "jsp", 14, 15])
                lundiAMettre.push(["TD Physique", "20", 12, 14])
            } else {
                vendrediAMrtrre.push(["TD Maths", "20", 8, 10])
                vendrediAMrtrre.push(["TP Physique", "B214", 10, 12])

                lundiAMettre.push(["TD SI", "20", 9, 10])
                lundiAMettre.push(["Anglais", "jsp", 13, 14])
                lundiAMettre.push(["TD Physique", "20", 14, 16])
            }
        }
        console.log(lundiAMettre)
        lundiAMettre.forEach(cou => {
            let bon = false;
            console.log(cou)
            EDT[0].forEach((e, i) => {
                if (bon) return
                if (e[2] > cou[2]) {
                    // console.log("oui",cou)
                    EDT[0].splice(i, 0, cou);
                    bon = true
                }
            });
            if (bon == false) {
                EDT[0].push(cou)
            }

        })
        vendrediAMrtrre.forEach(cou => {
            let bon = false;
            // console.log(cou)
            EDT[4].forEach((e, i) => {
                if (bon) return
                if (e[2] > cou[2]) {
                    EDT[4].splice(i, 0, cou);
                    bon = true
                }
            });
            if (bon == false) {
                EDT[4].push(cou)
            }

        })
        let mardi = []
        if (groupeI == "1" || groupeI == "S") {
            mardi.push(["Info", "37", 15, 17])
        } if (groupeI == 2 || groupeI == "S") {
            mardi.push(["Info", "37", 17, 19])
        } if (groupeI == 3 || groupeI == "S") {
            cou = ["Info", "37", 16, 18]
            let bon = false;
            console.log(cou)
            EDT[2].forEach((e, i) => {
                if (bon) return
                if (e[2] > cou[2]) {
                    EDT[2].splice(i, 0, cou);
                    bon = true
                    return
                }
            });
            if (bon == false) {
                EDT[2].push(cou)
            }
            console.log("mercre", EDT[3])
        }
        if (groupeI == "S") alert("Il faut se rÃ©partir les groupes d'info !")
        console.log("STOP", mardi)
        mardi.forEach(cou => {
            let bon = false;
            console.log(cou)
            structuredClone(EDT[1]).forEach((e, i) => {
                if (bon) return
                if (e[2] > cou[2]) {
                    EDT[1].splice(i, 0, cou);
                    bon = true
                }
            });
            if (bon == false) {
                EDT[1].push(cou)
            }
            console.log("mardi", EDT[1])

        })

        const matiere = getKholes((16 - (semaine - 3) + Number(groupeK) - 1) % 16 + 1, (semaine - 3));
        matiere.forEach(kh => {
            let bon = false;
            const val = ["KhÃ´le " + kh[4], kh[3], conHeure(kh[2]), conHeure(kh[2]) + 1]
            // console.log(EDT, kh)
            EDT[kh[1] - 1].forEach((e, i) => {
                if (bon) return
                if (e[2] > Math.round(conHeure(kh[2]))) {
                    EDT[kh[1] - 1].splice(i, 0, val);
                    bon = true
                }
            })
            if (bon == false) {
                // console.log("test",val)
                EDT[kh[1] - 1].push(val)
            }
        });


    }

    const resetEDT = () => {
        const copy = document.getElementById("EDT2").cloneNode(true);
        document.getElementById("EDT").remove()
        document.getElementById("tocopy").appendChild(copy)
        document.getElementById("EDT2").id = "EDT"

    }

    const afficheEDT = () => {
        makeEDT()
        console.log(EDT)
        console.log("aff")
        resetEDT()

        const joursN = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]

        let eEDT = document.getElementById("EDT")
        let last = [8, 8, 8, 8, 8]
        for (let i = 8; i < 20; i++) {
            let tr = document.createElement("tr")

            const heure = document.createElement("td")
            heure.className = "heure"
            heure.innerText = i + "h"
            tr.appendChild(heure)
            for (let jour = 0; jour < 5; jour++) {
                let done = false
                for (let numE = 0; numE < EDT[jour].length; numE++) {
                    const element = EDT[jour][numE];
                    if (i == Math.round(element[2])) {

                        last[jour] = element[3]
                        // console.log(element, i, joursN[jour], last[jour])
                        const td = document.createElement("td")
                        td.className = "cours"
                        td.innerText = element[0] + " (" + element[1] + ")\n" + backHour(element[2]) + " - " + backHour(element[3])
                        const n = (element[3] - element[2])
                        if (n != 1) td.rowSpan = n
                        tr.appendChild(td)
                        break


                    }
                }
                if (done == false && last[jour] <= i) {
                    last[jour]++
                    const td = document.createElement("td")
                    td.innerText = "\n\n\n"
                    tr.appendChild(td)
                }
            }
            eEDT.appendChild(tr)

        }

    }
    semaines.onchange = e => {
        semaine = e.target.value;
        if (testparams() == false) {
            txt.innerText = "ParamÃ¨tres invalides"
            return
        }
        groupeI = ninfo[groupeK - 1][semaine - 3]
        afficheEDT()
    }


    selectGrp.onchange = e => {
        resetEDT()
        groupeK = Number(e.target.value)
        if (groupeK == "") {
            txt.innerText = "ParamÃ¨tres invalides"
            return
        }
        groupeI = ninfo[groupeK - 1][semaine - 3]

        txt.innerHTML = ""
        console.log("groupe :", e.target.value)

        for (let i = 0; i < 16; i++) {
            kholes[i] = (16 - i + Number(e.target.value) - 1) % 16 + 1;
            console.log(kholes[i])

        }
        afficheSemaine(kholes[semaine - 3], semaine - 3)
        if (testparams() == false) return
        afficheEDT()

    }
    // console.log(info)
})()