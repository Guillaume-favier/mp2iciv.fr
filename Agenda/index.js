async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
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

    

    
})()