// criado verificacao atravez do id via html 
const addP = document.querySelector(".add-p"),
adicionalP = document.querySelector(".adicional-p"),
adicionalTitle = adicionalP.querySelector("header p"),
closeIcon = adicionalP.querySelector("header i"),
titleTag = adicionalP.querySelector("input"),//linha do input para inserir o titulo
descTag = adicionalP.querySelector("textarea"),//linha do textarea
addBtn = adicionalP.querySelector("button");

// array criado para armazenar os meses do ano , e tb deixar as informações armazenadas no navegador via localStorage
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notas = JSON.parse(localStorage.getItem("notas") || "[]");
let isUpdate = false, updateId;

addP.addEventListener("click",() =>
{

    adicionalTitle.innerHTML = "Add Nova Nota";
    addBtn.innerHTML = "Add Nota";
    adicionalP.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(Window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click",() =>
{
    isUpdate = false;
    titleTag.value = descTag.value = "";
    adicionalP.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// função que exibe as notas na tela a partir de inseridas e atualizadas
function showNotas() {
    if(!notas) return;
    document.querySelectorAll(".nota").forEach(li => li.remove());
    notas.forEach((nota, id) => {
        let filterDesc = nota.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="nota">
                        <div class="details">
                            <p>${nota.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${nota.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNota(${id}, '${nota.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNota(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addP.insertAdjacentHTML("afterend", liTag);
    });
}
showNotas();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// função criada para exibir um alerta e verificar se vai ser excluido ou não a nota
function deleteNota(notaId) {
    let confirmDel = confirm("Tem certeza que deseja excluir essa anotação?");
    if(!confirmDel) return;
    notas.splice(notaId, 1);
    localStorage.setItem("notas", JSON.stringify(notas));
    showNotas();
}

// função criada para atualizar a nota - vem depois do evento de clicar em editar a nota
function updateNota(notaId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = notaId;
    isUpdate = true;
    addP.click();
    titleTag.value = title;
    descTag.value = description;
    adicionalTitle.innerText = "Atualizar Nota";
    addBtn.innerText = "Atualizar Nota";
}

// evento que seleciona as informacoes a serem adicionadas, entra em execução depois do clicar em um mais
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let notaInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notas.push(notaInfo);
        } else {
            isUpdate = false;
            notas[updateId] = notaInfo;
        }
        localStorage.setItem("notas", JSON.stringify(notas));
        showNotas();
        closeIcon.click();
    }
});