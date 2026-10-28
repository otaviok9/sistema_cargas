const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const btn_listar = document.getElementById('btn_listar')
const resposta = document.getElementById('resposta')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()

    const ordem = document.getElementById('ordem').value

    fetch(`http://localhost:3000/entregas?ordem=${ordem}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(dados => {
            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
                return
            }
            resposta.innerHTML = `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
            `
        })
        .catch(err => {
            console.error('Erro:', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codEntrega}</td>`
        corpo += `<td>${el.cidadeDestino}</td>`
        corpo += `<td>${el.status}</td>`
        corpo += `<td>${el.data}</td>`
        corpo += `<td>${el.hora}</td>`
        corpo += `<td>${el.idCarga}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Cidade Destino</th>
                <th>Status</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Carga</th>
            </tr>
        </thead>
    `
}
