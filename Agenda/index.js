async function getText(url) {
    const response = await fetch(url);
    const txt = await response.text();
    return txt
}


;(async() => {
    let generalText = getText("/Agenda/agenda.txt");
    let big = document.createElement("ul")
    let cur;
    (await generalText).split("\n").forEach(e => {
        if (e == "") {
            return
        }
        if (e.startsWith("- ")) {
            let li = document.createElement("li")
            li.innerText = e.substring(2)
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
        document.getElementsByClassName("content")[0].appendChild(big)
    })

    

    
})()