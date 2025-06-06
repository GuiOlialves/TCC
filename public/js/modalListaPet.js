// Em public/js/modalListaPet.js
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const tableBody = document.querySelector(".pets-table tbody"); // Alvo é o corpo da tabela

    // Função para filtrar as linhas da tabela
    function filterTableRows() {
        if (!searchInput || !tableBody) return;
        const term = searchInput.value.trim().toLowerCase();
        const rows = tableBody.querySelectorAll("tr.pet-row"); // Seleciona todas as linhas de dados

        rows.forEach((row) => {
            // Pega os dados da linha para a busca
            const nome = row.dataset.nome?.toLowerCase() || "";
            const raca = row.dataset.raca?.toLowerCase() || "";
            const tutor = row.dataset.tutorNome?.toLowerCase() || "";
            const especie = row.dataset.especie?.toLowerCase() || "";

            if (nome.includes(term) || raca.includes(term) || tutor.includes(term) || especie.includes(term)) {
                row.style.display = ""; // Mostra a linha
            } else {
                row.style.display = "none"; // Esconde a linha
            }
        });
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            filterTableRows();
        });
    }
    if (searchInput) {
        searchInput.addEventListener("input", filterTableRows); // Filtra enquanto digita
    }

    // Função para criar e mostrar o modal de detalhes do pet
    function showPetDetailsModal(petRowElement) { // Recebe a LINHA TR como argumento
        const petData = petRowElement.dataset; // Pega todos os atributos data-* da LINHA TR
        console.log("Dados capturados da linha (petData):", petData); // <--- PONTO DE DEPURAÇÃO

        const existingModal = document.querySelector(".modal-dashboard-lista-pet");
        if (existingModal) {
            existingModal.remove();
        }

        const modalDashboard = document.createElement("div");
        modalDashboard.classList.add("modal-dashboard", "modal-dashboard-lista-pet");

        const closeButton = document.createElement("div");
        closeButton.classList.add("close-modal");
        closeButton.textContent = "X";
        closeButton.addEventListener("click", () => modalDashboard.remove());
        modalDashboard.appendChild(closeButton);

        const profilePetModal = document.createElement("div");
        profilePetModal.classList.add("profile-pet-modal");

        const petInfoModal = document.createElement("div");
        petInfoModal.classList.add("pet-info-modal");
        
        const petImage = document.createElement("img");
        // Verifique se petData.imagemSrcArquivo existe e tem valor
        petImage.src = `/assets/images/${petData.imagemSrcArquivo || 'default-pet.png'}`;
        petImage.alt = `Foto de ${petData.nome || 'Pet'}`;
        petInfoModal.appendChild(petImage);

        const petInfoModalName = document.createElement('div');
        petInfoModalName.classList.add('pet-info-modal-name');

        const petName = document.createElement("h3");
        petName.textContent = petData.nome || 'Nome Indisponível';
        petInfoModalName.appendChild(petName);

        const petDetails = document.createElement("p");
        // Verifique petData.idadeDisplay, petData.sexo, petData.peso
        petDetails.innerHTML = `<span>${petData.idadeDisplay || 'Idade N/A'}</span> - <span>${petData.sexo || 'Sexo N/A'}</span> - <span>${petData.peso || 'Peso N/A'}</span>`;
        petInfoModalName.appendChild(petDetails);
        
        petInfoModal.appendChild(petInfoModalName);
        profilePetModal.appendChild(petInfoModal);
        
        const additionalInfoContainer = document.createElement('div');
        additionalInfoContainer.classList.add('pet-additional-info-modal');

        const petBreed = document.createElement("h3");
        petBreed.textContent = "Raça: " + (petData.raca || 'Indisponível');
        additionalInfoContainer.appendChild(petBreed);

        const ownerName = document.createElement("h3");
        ownerName.textContent = "Tutor: " + (petData.tutorNome || 'Indisponível');
        additionalInfoContainer.appendChild(ownerName);

        profilePetModal.appendChild(additionalInfoContainer);
        modalDashboard.appendChild(profilePetModal);

        // Seção de registros (Histórico, Vacinas, Alergias)
        const recordOfPet = document.createElement("div");
        recordOfPet.classList.add("record-of-pet");

        const recordAppointments = document.createElement("div");
        recordAppointments.classList.add("record-appointments");
        const appointmentsTitle = document.createElement("h3");
        appointmentsTitle.textContent = "Histórico de consultas";
        const exemploConsulta = document.createElement("p");
        exemploConsulta.textContent = "Nenhum histórico de consulta disponível."; // TODO: Popular com dados reais
        recordAppointments.appendChild(appointmentsTitle);
        recordAppointments.appendChild(exemploConsulta);
        recordOfPet.appendChild(recordAppointments);

        const recordVaccines = document.createElement("div");
        recordVaccines.classList.add("record-vaccines");
        const vaccinesTitle = document.createElement("h3");
        vaccinesTitle.textContent = "Vacinas";
        const statusVacinasP = document.createElement("p");
        statusVacinasP.textContent = petData.statusVacinas || "Não informado";
        recordVaccines.appendChild(vaccinesTitle);
        recordVaccines.appendChild(statusVacinasP);
        recordOfPet.appendChild(recordVaccines);

        const allergiesSection = document.createElement("div");
        allergiesSection.classList.add("allergies");
        const allergiesTitle = document.createElement("h3");
        allergiesTitle.textContent = "Alergias";
        const alergiasP = document.createElement("p");
        alergiasP.textContent = petData.alergias || "Não informado";
        allergiesSection.appendChild(allergiesTitle);
        allergiesSection.appendChild(alergiasP);
        recordOfPet.appendChild(allergiesSection);
        modalDashboard.appendChild(recordOfPet);

        // Seção de Novo Agendamento
        const newAppointmentSection = document.createElement("div");
        newAppointmentSection.classList.add("new-appointment");
        const titleDiv = document.createElement("div");
        titleDiv.classList.add("title");
        const titleIcon = document.createElement("img");
        titleIcon.src = "/assets/images/novo-agendamento.png";
        titleIcon.alt = "Ícone de novo agendamento";
        const titleText = document.createElement("h1");
        titleText.appendChild(titleIcon);
        titleText.appendChild(document.createTextNode("Novo Agendamento"));
        titleDiv.appendChild(titleText);
        newAppointmentSection.appendChild(titleDiv);
        const formNewAppointment = document.createElement("form");
        formNewAppointment.id = "formNewAppointmentFromListaPet";
        
        function createFormField(labelText, inputType, inputName, inputId, options = null, value = null) {
            const div = document.createElement("div");
            const p = document.createElement("p");
            p.textContent = labelText;
            div.appendChild(p);

            if (inputType === 'select') {
                const select = document.createElement("select");
                select.name = inputName;
                select.id = inputId;
                if (options) {
                    options.forEach(opt => {
                        const optionEl = document.createElement("option");
                        optionEl.value = opt.value;
                        optionEl.textContent = opt.text;
                        select.appendChild(optionEl);
                    });
                }
                div.appendChild(select);
            } else {
                const input = document.createElement("input");
                input.type = inputType;
                input.name = inputName;
                input.id = inputId;
                if (value) input.value = value;
                div.appendChild(input);
            }
            return div;
        }

        const inputsContainer = document.createElement("div");
        inputsContainer.classList.add("inputs");

        inputsContainer.appendChild(createFormField("Data", "date", "dataConsulta", "listaPetModalData"));
        const horariosOptions = [
            { value: "", text: "Selecione um horário" }, { value: "08:00", text: "08:00" }, { value: "08:30", text: "08:30" },
            { value: "09:00", text: "09:00" }, { value: "09:30", text: "09:30" }, { value: "10:00", text: "10:00" },
            { value: "10:30", text: "10:30" }, { value: "11:00", text: "11:00" }, { value: "11:30", text: "11:30" },
            { value: "12:00", text: "12:00" }, { value: "12:30", text: "12:30" }, { value: "14:00", text: "14:00" },
            { value: "14:30", text: "14:30" }, { value: "15:00", text: "15:00" }, { value: "15:30", text: "15:30" },
            { value: "16:00", text: "16:00" }, { value: "16:30", text: "16:30" }, { value: "17:00", text: "17:00" },
            { value: "17:30", text: "17:30" }
        ];
        inputsContainer.appendChild(createFormField("Horário", "select", "horario", "listaPetModalHorario", horariosOptions));
        const tipoConsultaOptions = [
            { value: "", text: "Selecione uma consulta" }, { value: "Consulta de Rotina", text: "Consulta de Rotina" },
            { value: "Primeira Consulta", text: "Primeira Consulta" }, { value: "Consulta Especializada", text: "Consulta Especializada" },
            { value: "Vacinação", text: "Vacinação" }, { value: "Emergência", text: "Emergência" }
        ];
        inputsContainer.appendChild(createFormField("Tipo de Consulta", "select", "tipoConsulta", "listaPetModalTipoConsulta", tipoConsultaOptions));
        inputsContainer.appendChild(createFormField("Doutor(a)", "text", "doutor", "listaPetModalDoutor"));


        formNewAppointment.appendChild(inputsContainer);
        const confirmButton = document.createElement("button");
        confirmButton.type = "submit";
        confirmButton.textContent = "Confirmar Agendamento";
        confirmButton.classList.add("new-appointment-button");
        formNewAppointment.appendChild(confirmButton);
        newAppointmentSection.appendChild(formNewAppointment);
        modalDashboard.appendChild(newAppointmentSection);

        document.body.appendChild(modalDashboard);

        const newDataInput = document.getElementById("listaPetModalData");
        if (newDataInput) {
            const dataAtual = new Date();
            const diaAtual = String(dataAtual.getDate()).padStart(2, '0');
            const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const anoAtual = dataAtual.getFullYear();
            newDataInput.min = `${anoAtual}-${mesAtual}-${diaAtual}`;
        }

        formNewAppointment.addEventListener("submit", async function(e) {
            e.preventDefault();
            const dataToSend = {
                petNome: petData.nome,
                especie: petData.especie,
                petRaca: petData.raca,
                sexo: petData.sexo,
                petAnoNascimento: petData.anoNascimento,
                petPeso: petData.peso,
                alergiasPet: petData.alergias,
                petVacinas: petData.statusVacinas,
                tutorNome: petData.tutorNome,
                cpf: petData.tutorCpf,
                tipoConsulta: document.getElementById("listaPetModalTipoConsulta").value,
                dataConsulta: document.getElementById("listaPetModalData").value,
                horario: document.getElementById("listaPetModalHorario").value,
                doutor: document.getElementById("listaPetModalDoutor").value,
            };

            if (!dataToSend.dataConsulta || !dataToSend.horario || !dataToSend.tipoConsulta || !dataToSend.doutor) {
                alert("Por favor, preencha todos os campos do agendamento.");
                return;
            }
            if (!dataToSend.petNome || !dataToSend.especie || !dataToSend.tutorNome) {
                alert("Dados do pet ou tutor ausentes. Não é possível agendar.");
                return;
            }

            try {
                const response = await fetch("/agenda", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSend),
                });
    
                if (response.ok) {
                    alert("Novo agendamento criado com sucesso!");
                    modalDashboard.remove();
                } else {
                    const errorData = await response.text();
                    alert("Erro ao criar novo agendamento: " + errorData);
                }
            } catch (networkError) {
                alert("Erro de rede. Verifique sua conexão e tente novamente.");
            }
        });
    }

    // Adicionar listener de clique aos botões "Ver Perfil" na tabela
    const viewProfileButtons = document.querySelectorAll(".action-btn.view-profile");
    if (viewProfileButtons.length > 0) {
        viewProfileButtons.forEach((button) => {
            button.addEventListener("click", function() { 
                const petRow = this.closest("tr.pet-row"); 
                if (petRow) {
                    showPetDetailsModal(petRow); 
                }
            });
        });
    }
    
    // LÓGICA PARA ABRIR MODAL DO PET DESTACADO VINDO DA AGENDA
    if (window.highlightedPetIdFromAgenda) {
        const targetPetRow = document.querySelector(`tr.pet-row[data-pet-id="${window.highlightedPetIdFromAgenda}"]`);
        if (targetPetRow) {
            setTimeout(() => { 
                showPetDetailsModal(targetPetRow); 
                targetPetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100); 
            delete window.highlightedPetIdFromAgenda; 
        }
    }
});
