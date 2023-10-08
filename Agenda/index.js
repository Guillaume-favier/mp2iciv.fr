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
            li.innerText = e.substring(4)
            sous.appendChild(li)
        }
        else if (e.startsWith("- ")) {
            let li = document.createElement("li")
            li.innerText = e.substring(2)
            if (e.endsWith(":") || e.endsWith(": ")){
                let ul = document.createElement("ul")
                li.appendChild(ul)
                sous = ul
            }
            cur.appendChild(li)
        }else {
            let li = document.createElement("li")
            li.innerText = e
            let ul = document.createElement("ul")
            li.appendChild(ul)
            big.append(document.createElement("br"))
            big.appendChild(li)
            cur = ul
        }
        document.getElementsByClassName("content")[1].appendChild(big)
    })

    const Bdiv = document.getElementById("contrib")
    const table = Bdiv.children[1]
    const pfpGithub = document.createElement("tr")
    const nameGithub = document.createElement("tr")
    const nbCommit = document.createElement("tr")
    let contrib = await getJson("https://api.github.com/repos/Guillaume-favier/agendaMP2I/contributors")
    contrib.forEach(e => {
        const pfp = document.createElement("td")
        const name = document.createElement("td")
        const nb = document.createElement("td")
        const a = document.createElement("a")
        a.href = e.html_url
        const a2 = a.cloneNode(true);
        a.innerHTML = `<img src="${e.avatar_url}" alt="pfp" width="100" height="100">`
        pfp.appendChild(a)

        

        a2.innerText = e.login
        name.appendChild(a2)
        nb.innerText = e.contributions == 1 ? e.contributions + " contribution" : e.contributions + " contributions"

        pfpGithub.appendChild(pfp)
        nameGithub.appendChild(name)
        nbCommit.appendChild(nb)
    })
    table.appendChild(pfpGithub)
    table.appendChild(nameGithub)
    table.appendChild(nbCommit) 
    

    
})()