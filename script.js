// Alternar tema escuro/claro
function toggleDarkMode() {
    const body = document.body;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const icon = document.getElementById('darkModeToggle');

    body.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    footer.classList.toggle('dark-mode');

    icon.textContent = body.classList.contains('dark-mode') ? '🌜' : '🌞';

    // Salvar a preferência de tema no armazenamento local
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
}

// Carregar a preferência de tema ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelector('header').classList.add('dark-mode');
        document.querySelector('footer').classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '🌜';
    }
    formatarValores(); // Formatar os valores na tabela ao carregar a página
    calcularTotal(); // Recalcular o total ao carregar a página
});

// Formatar valores na tabela
function formatarValores() {
    document.querySelectorAll("#tabela tbody tr").forEach(row => {
        let cell = row.cells[2]; // Assumindo que a coluna de valores é a terceira
        let valorTexto = cell.innerText.trim();
        let valor = parseFloat(valorTexto);
        if (!isNaN(valor)) {
            cell.innerText = `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    });
}

// Filtro de pesquisa na tabela
function filterTable() {
    let input = document.getElementById("search").value.toUpperCase();
    let rows = document.querySelectorAll("#tabela tbody tr");
    rows.forEach(row => {
        let text = row.innerText.toUpperCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
    calcularTotal(); // Recalcular o total após filtragem
}

// Ordenar colunas ao clicar no cabeçalho
function sortTable(n) {
    let table = document.getElementById("tabela");
    let rows = Array.from(table.rows).slice(1);
    let ascending = table.dataset.sort === "asc";
    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[n].innerText.trim();
        let cellB = rowB.cells[n].innerText.trim();
        return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });
    table.tBodies[0].append(...rows);
    table.dataset.sort = ascending ? "desc" : "asc";
    calcularTotal(); // Recalcular o total após ordenação
}

// Calcular o total dos valores
function calcularTotal() {
    let total = 0;
    document.querySelectorAll("#tabela tbody tr").forEach(row => {
        let valorTexto = row.cells[2].innerText.replace("R$", "").replaceAll(".", "").replace(",", ".").trim();
        let valor = parseFloat(valorTexto);
        total += isNaN(valor) ? 0 : valor;
    });
    // Formatar o total com separadores de milhar e decimais
    document.getElementById("total").innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Exportar para CSV
function exportCSV() {
    let csv = "Item,Data,Valor\n";
    document.querySelectorAll("#tabela tbody tr").forEach(row => {
        let dados = Array.from(row.cells).map(cell => cell.innerText);
        csv += dados.join(",") + "\n";
    });
    let link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = "dados.csv";
    link.click();
}

// Salvar como PDF
function saveAsPDF() {
    window.print();
}

// Filtrar por intervalo de datas
function filterByDate() {
    let startDate = new Date(document.getElementById('start-date').value);
    let endDate = new Date(document.getElementById('end-date').value);
    let rows = document.querySelectorAll('#tabela tbody tr');
    rows.forEach(row => {
        let date = new Date(row.cells[1].innerText);
        row.style.display = (date >= startDate && date <= endDate) ? "" : "none";
    });
    calcularTotal(); // Recalcular o total após filtragem por data
}
