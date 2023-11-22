async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
}
async function getJson(url) {
    const response = await fetch(url);
    const jj = await response.json();
    return jj
}

function putLink(text) {
    const p = document.createElement("p")
    const preres = text.split("£")
    // console.log(preres.length,preres)
    if ((preres.length-1) % 2 == 0) {
        p.innerText = preres[0]
        for (let i = 1; i < Math.floor(preres.length / 2)+1; i++) {
            const now = [preres[2*i-1],preres[2*i]]
            const a = document.createElement("a")
            let url = now[0]
            if(url[0] == "*"){
                url = "https://guillaume-favier.github.io/agendaMP2I/docs"+url.substring(1)
            }
            a.href = url
            const linkIcon = document.createElement("i")
            linkIcon.className = "fa-solid fa-link"
            a.appendChild(linkIcon)
            a.appendChild(document.createTextNode(now[1]))
            
            p.appendChild(a)
            if (i+1 < Math.floor(preres.length / 2) + 1) {
                p.appendChild(document.createTextNode(" & "))
            }
        }

    }else{
        p.innerText = text
    }
    return p
}

;(async() => {
    let generalText = getText("https://guillaume-favier.github.io/agendaMP2I/agenda.txt");
    let big = document.createElement("ul")
    let cur;
    let sous;
    (await generalText).split("\n").forEach(e => {
        if (e == "") {
            return
        } if (e.startsWith("  - ")){
            let li = document.createElement("li")
            li.appendChild(putLink(e.substring(4)))
            sous.appendChild(li)
        }
        else if (e.startsWith("- ")) {
            let li = document.createElement("li")
            li.appendChild(putLink(e.substring(2)))
            if (e.endsWith(":") || e.endsWith(": ")){
                let ul = document.createElement("ul")
                li.appendChild(ul)
                sous = ul
            }
            cur.appendChild(li)
        }else {
            let li = document.createElement("li")
            li.innerText = e
            // console.log(e)
            let ul = document.createElement("ul")
            li.appendChild(ul)
            big.append(document.createElement("br"))
            big.appendChild(li)
            cur = ul
        }
        document.getElementsByClassName("content")[1].appendChild(big)
    })

    const Bdiv = document.getElementById("contrib")
    const table = document.getElementById("listContr")
    let contrib = await getJson("https://api.github.com/repos/Guillaume-favier/agendaMP2I/contributors")
    contrib.forEach((e,i) => {
        const div = document.createElement("div")
        const a = document.createElement("a")
        a.href = e.html_url
        const a2 = a.cloneNode(true);
        a.innerHTML = `<img src="${e.avatar_url}" alt="pfp" width="100" height="100">`

        

        a2.innerText = e.login
        const nb = document.createElement("p")
        nb.innerText = e.contributions == 1 ? e.contributions + " contribution" : e.contributions + " contributions"

        div.appendChild(a)
        div.appendChild(document.createElement("br"))
        div.appendChild(a2)
        div.appendChild(nb)

        const comments = {
            "Guillaume-favier": "Le maitre",
            "Getoune": "Le sage",
            "Hamanarca": "Le BG",
            "NolanGlotin": "Le "+["premier","deuxième","troisième","quatrième","cinquième","sixième"][i]
        }
        
        if (Object.keys(comments).includes(e.login)){
            const comm = document.createElement("i")
            comm.innerText = comments[e.login]
            div.appendChild(comm)
        }
        table.appendChild(div)
    })
    

    
})()