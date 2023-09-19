async function getJson(url) {
    const response = await fetch(url);
    const jj = await response.json();
    return jj
}
const clear = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");



const table = document.getElementById("toPutTo")
const errr = document.getElementById("errr")



const resetTable = () => {
    table.innerHTML = "";
    const titles = ["Nom","Prénom","Classe ou fonction","Status"];
    const tr = document.createElement("tr")
    titles.forEach(element => {
        const th = document.createElement("th")
        th.innerText = element
        tr.appendChild(th)
    });
    table.appendChild(tr)
}
;(async()=>{
    const db = await getJson("/search/db.json");
    resetTable()
    const getFromName = (s) => {
        let res = []
        s = clear(s)
        let apres = false
        console.log(Object.keys(db["classes"]))
        Object.keys(db["classes"]).forEach(clsName => {
            if (apres == false && s == clear(clsName)) {
                apres = true
                db["classes"][clsName].forEach(id => {
                    res.push(db["per"][id])
                });
            }
        })
        if(apres) return res
        if(s.length < 3) return false
        Object.keys(db["per"]).forEach(id => {
            const element = db["per"][id]
            const pre = clear(element["prenom"])
            const nom = clear(element["nom"])
            if((pre+" "+nom).indexOf(s) != -1){
                res.push(element)
            }
        });
        return res.length == 0 ? "nope" : res;
    }
    const putElems = (l) => {
        const statusConv = ["","Élève","Parent d'élève","Enseignant","Personnel non enseignant"]
        l.forEach(per => {
            const tr = document.createElement("tr")
            const attr = [per["prenom"], per["nom"], per["classe"], statusConv[per["status"]]]
            attr.forEach(element => {
                const td = document.createElement("td")
                td.innerText = element
                tr.appendChild(td)
            });
            table.appendChild(tr)
        });
    }

    document.getElementById("inp").oninput = (e) => {
        const txt = e.target.value;
        resetTable()
        const test = getFromName(txt)
        
        if (test == "nope") {
            errr.style.display = "block";
            errr.innerHTML = "0 personnes trouvés"
            table.style.display = "none";
        }else if (test !== false) {
            errr.style.display = "none";
            table.style.display = "block";
            putElems(test)
        }
        else{
            errr.innerHTML = "Pas assès de caractères"
            errr.style.display = "block";
            table.style.display = "none";
        }
    }
})()