
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

const ajusteDate = (n) => {
    return n < 10 ? "0" + n : n
}

var semaines = document.getElementById("semaine")
for (let i = 3; i < 19; i++) {

    const opt = document.createElement("option")
    opt.value = i.toString()
    opt.innerText = i
    semaines.appendChild(opt)
}

const getGrpFromSem = (s) => {
    s-=4
    let grp = []
    for (let i = 1; i < 17; i++) {
        grp.push((i+s)%16+1)
    }
    return grp
}




;(async()=>{
    const db = await getJson("/EDT/kholes.json")
    const semaineNom = await getJson("/EDT/semaine.json")
    const groupes = await getJson("/EDT/groupes.json")

    let currSem = 12;
    semaines.value = currSem

    const oneGrp = (s,c) => {
        const gr = getGrpFromSem(s)
        return [gr[c - 1], groupes[gr[c - 1]-1]]
    }

    const putName = (l) => {
        let res = l[0][1]+" "+l[0][0]+". "
        for (let i = 1; i < l.length; i++) {
            const pers = l[i];
            res += "; "+pers[1]+" "+pers[0]+". " 
        }
        return res
    }
    const goodDate = (s, j) => {
        const base = semaineNom[semaines.value - 2].split("/");

        let init = (new Date(Number("20" + base[2]), Number(base[1]) - 1, Number(base[0]))).getTime()
        let start = new Date(init)
        let end = new Date(init + j * 24 * 3600 * 1000)
        let str = end.getDate()+"/"+(end.getMonth()+1)
        return str
    }

    const calcFr = (s) => {
        const p1 = document.createElement("li")
        const p2 = document.createElement("li")
        if (s%2 == 1) {
            const g1 = oneGrp(s, 5)
            p1.innerText = "Jeudi " + goodDate(s, 3) + " à 15h avec le groupe " + g1[0] + " qui est composé de : " + putName(g1[1])
            const g2 = oneGrp(s, 2)
            p2.innerText = "Jeudi " + goodDate(s, 3) + " à 16h30 avec le groupe " + g2[0] + " qui est composé de : " + putName(g2[1])
        }else{
            const g1 = oneGrp(s, 14)
            p1.innerText = "Vendredi " + goodDate(s, 4) + " à 16h avec le groupe " + g1[0] + " qui est composé de : " + putName(g1[1])
            const g2 = oneGrp(s, 9)
            p2.innerText = "Vendredi " + goodDate(s, 4) + " à 17h30 avec le groupe " + g2[0] + " qui est composé de : " + putName(g2[1])
        }

        document.getElementById("out").appendChild(p1)
        document.getElementById("out").appendChild(p2)
    }

    

    semaines.childNodes.forEach(elem => {
        const base = semaineNom[elem.value - 2].split("/");

        let init = (new Date(Number("20" + base[2]), Number(base[1]) - 1, Number(base[0]))).getTime()
        let start = new Date(init)
        let end = new Date(init + 4 * 24 * 3600 * 1000)
        elem.innerText = "n°" + elem.value + " : " + ajusteDate(start.getDate()) + "/" + ajusteDate(start.getMonth() + 1) + " - " + ajusteDate(end.getDate()) + "/" + ajusteDate(end.getMonth() + 1)
    })
    

    document.getElementById("sem").innerText = semaines.value
    calcFr(semaines.value)

    semaines.onchange = (e) => {
        document.getElementById("sem").innerText = semaines.value
        document.getElementById("out").innerHTML = ""
        calcFr(semaines.value)
    }

})()