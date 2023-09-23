
const conHeure = (n) => {
    if (typeof n == typeof 2) return n
    if (n.indexOf("h") > -1) {
        let nn = n.split("h")
        return Number(nn[0]) + (Number(nn[1]) / 60)
    } return Number(n)
}

const backHour = (n) => {
    let reste = n - Math.floor(n)
    if (reste > 0) return Math.floor(n).toString() + "h" + Math.round(reste * 60)
    return Math.floor(n).toString() + "h"
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


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



var selectGrp = document.getElementById("grpKhole")
for (let i = 1; i <= 16; i++) {

    const opt = document.createElement("option")
    opt.value = i.toString()
    opt.innerText = "G" + i
    selectGrp.appendChild(opt)
}

const cookiegrp = getCookie("GroupeKholle")
selectGrp.value = cookiegrp


var semaines = document.getElementById("semaine")
for (let i = 3; i < 19; i++) {

    const opt = document.createElement("option")
    opt.value = i.toString()
    opt.innerText = i
    semaines.appendChild(opt)
}
var palletteElem = document.getElementById("pallette")



; (async () => {

    var txt = document.getElementById("outTxt")
    txt.innerText = "Chargement des données..."
    const db = await getJson("/EDT/kholes.json")
    const ds = await getJson("/EDT/DS.json")
    const info = await getText("/EDT/info.txt")
    const orgEDT = await getJson("/EDT/EDT.json")
    const pallette = await getJson("/EDT/palettes.json")
    let EDT = structuredClone(orgEDT)
    txt.innerHTML = "Traitement des données ..."
    let ninfo = []
    info.split("\n").forEach(lign => {
        ninfo.push(lign.split(" "))
    })


    let groupeK = selectGrp.value == "" ? 0 : Number(selectGrp.value);
    let groupeI = 0;
    let semaine = 4;
    semaines.value = semaine
    let CKh = 0;
    let kholes = []
    for (let i = 0; i < 17; i++) {
        kholes.push([]);
    }

    const afficheCours = (m, nom) => {
        const p = document.createElement("p")
        p.innerText = nom + ", " + m[0] + " le " + jours[m[1]] + " à  " + (typeof m[2] == typeof 2 ? (m[2] + "h") : m[2]) + " en " + m[3]
        txt.appendChild(p)
    }
    const getKholes = (c, s) => {
        let all = [db["maths"][c - 1].concat(["Maths"])]

        if (c % 2 == 1) {
            all.push(db["physique"][c - 1].concat(["Physique"]))
        } else {
            all.push(db["anglais"][c - 1].concat(["Anglais"]))
        }
        if (c == 1 || c == 10) {
            all.push(db["info"][c - 1].concat(["Info"]))
        }
        if ((s % 2 == 0 && (c == 2 || c == 5)) || (s % 2 == 1 && (c == 9 || c == 14))) {
            all.push(db["francais"][c - 1].concat(["Français"]))
        }
        return all
    }





    const afficheSemaine = (c, s) => {
        txt.appendChild(document.createElement("br"))
        const h1 = document.createElement("h1")
        h1.innerText = "Semaine " + (s + 3) + " C" + c
        txt.appendChild(h1)

        const dsP = document.createElement("p")
        const inputDs = ds[semaine - 2]
        dsP.innerText = "DS : " + (typeof (inputDs) != "undefined" ? inputDs : "Non défini")
        txt.appendChild(dsP)
        txt.appendChild(document.createElement("br"))

        const kholesTexte = document.createElement("p")
        kholesTexte.innerText = "Kôlles :"
        txt.appendChild(kholesTexte)
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
            afficheCours(db["francais"][c - 1], "Français")
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

        const n1 = () => {
            vendrediAMrtrre.push(["TD Maths", "20", conHeure("7h50"), conHeure("9h50"),"Maths"])
            vendrediAMrtrre.push(["TP Physique", "B214", conHeure("9h50"), conHeure("11h50"),"Physique"])

            lundiAMettre.push(["Anglais", "33", 13, 14])
            lundiAMettre.push(["TD Physique", "20", 14, 16, "Physique"])
        }

        const n2 = () => {
            vendrediAMrtrre.push(["TD Maths", "20", conHeure("9h50"), conHeure("11h50"), "Maths"])
            vendrediAMrtrre.push(["TP Physique", "B214", conHeure("7h50"), conHeure("9h50"), "Physique"])

            lundiAMettre.push(["Anglais", "33", 14, 15])
            lundiAMettre.push(["TD Physique", "20", 12, 14, "Physique"])
        }
        const toCheck = kholes[semaine - 3]
        if (semaine % 2 == 1) {

            if (groupeK % 2 == 1) {
                if (toCheck == 5) {
                    lundiAMettre.push(["TD SI", "20", 10, 11,"SI"])
                }
                else lundiAMettre.push(["TD SI", "20", 9, 10,"SI"])
                n1()
                

                
            } else {
                if (toCheck == 6) {
                    lundiAMettre.push(["TD SI", "20", 9, 10,"SI"])
                }
                else lundiAMettre.push(["TD SI", "20", 10, 11,"SI"])
                n2()
                
                console.log(lundiAMettre)
            }
        } else {
            if (groupeK % 2 == 1) {
                
                if (toCheck == 6) {
                    lundiAMettre.push(["TD SI", "20", 9, 10, "SI"])
                }
                else lundiAMettre.push(["TD SI", "20", 10, 11, "SI"])

                n2()
            } else {
                if (toCheck == 5) {
                    lundiAMettre.push(["TD SI", "20", 10, 11, "SI"])
                }
                else lundiAMettre.push(["TD SI", "20", 9, 10, "SI"])

                n1()
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
        if (groupeI == 1 || groupeI == "S") {
            mardi.push([" TP Info", "37", 15, 17,"Info"])
        } if (groupeI == 2 || groupeI == "S") {
            mardi.push(["TP Info", "37", 17, 19, "Info"])
        } if (groupeI == 3 || groupeI == "S") {
            // cas particulier car seule occurence d'un changement d'emplois du temps le mercredi donc obligé d'inclure le passage suivant
            cou = ["TP Info", "37", 16, 18, "Info"]
            let bon = false;
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
        }
        if (groupeI == "S") alert("Il faut se répartir les groupes d'info !")
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
            const val = ["Khôlle " + kh[4], kh[3], conHeure(kh[2]), conHeure(kh[2]) + 1, kh[4]]
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
        for (let i = 8; i < 20; i++) { // De 8h à 19h
            let tr = document.createElement("tr") // ligne pour troute la semaine

            const heure = document.createElement("td")
            heure.className = "heure"
            heure.innerText = i + "h" // colonne de gauche des heures
            tr.appendChild(heure)
            for (let jour = 0; jour < 5; jour++) { 
                let done = false
                for (let numE = 0; numE < EDT[jour].length; numE++) {
                    const element = EDT[jour][numE];
                    if (i == Math.round(element[2])) {
                        last[jour] = element[3]
                        const coursMatiere = element.length == 4 ? element[0] : element[4]
                        const td = document.createElement("td")
                        td.className = "cours " + coursMatiere
                        td.innerText = element[0] + "\n (" + element[1] + ")\n" + backHour(element[2]) + " - " + backHour(element[3])
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
    Object.keys(pallette).forEach(name => {
        const option = document.createElement("option")
        option.value = name
        option.innerText = name
        palletteElem.appendChild(option)
    })

    const setPallette = () => {
        const palcook = getCookie("pallette")
        if (palcook == "") {
            palletteElem.value = "Guillaume"
            setCookie("pallette", palletteElem.value, 100)
        }else {
            palletteElem.value = palcook
        }

        const namePal = palletteElem.value
        const pal = pallette[namePal]
        Object.keys(pal).forEach(matiere => {
            const mm = document.getElementsByClassName(matiere)
            for (let i = 0; i < mm.length; i++) {
                const element = mm[i];
                element.style.background = pal[matiere]
            }
        })
    }

    const updateSemaines = () => {
        if (groupeK == "") {
            txt.innerText = "Paramètres invalides"
            return
        }
        groupeI = ninfo[groupeK - 1][semaine - 3]
        if (semaine > 18) semaine = 3
        if (semaine < 3) semaine = 18
        semaines.value = semaine
        for (let i = 0; i < 16; i++) {
            kholes[i] = (16 - i + Number(groupeK) - 1) % 16 + 1;
        }
        txt.innerHTML = ""
        afficheSemaine(kholes[semaine - 3], semaine - 3)

        if (testparams() == false) return
        afficheEDT()
        setPallette()
    }

    const changementPourEdt = () => {
        resetEDT()
        groupeK = Number(selectGrp.value)
        updateSemaines()

    }

    semaines.onchange = e => {
        semaine = e.target.value;
        if (testparams() == false) {
            txt.innerText = "Paramètres invalides"
            return
        }
        updateSemaines()
    }
    document.getElementById("nextWeek").onclick = e=> {
        e.preventDefault()
        semaine++
        updateSemaines()
    }

    document.getElementById("prevWeek").onclick = e => {
        e.preventDefault()
        semaine--
        updateSemaines()
    }


    changementPourEdt()

    selectGrp.onchange = e => {
        setCookie("GroupeKholle", e.target.value, 100)
        changementPourEdt()

    }
    palletteElem.onchange = e => {
        setCookie("pallette", palletteElem.value, 100)
        updateSemaines()
    }
    setPallette()
    // console.log(info)
})()