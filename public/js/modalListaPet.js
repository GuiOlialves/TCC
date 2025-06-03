// public/js/modalListaPet.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("modalListaPet.js: DOM Carregado");

  const searchInput = document.getElementById("searchInput");
  const cardsContainer = document.getElementById("cards-container");
  const searchButton = document.getElementById("searchButton");

  let allPetCards = []; // Manter uma referência a todos os cards para a busca

  if (cardsContainer) {
    allPetCards = cardsContainer.querySelectorAll(".pet-card");
    console.log(`modalListaPet.js: Encontrados ${allPetCards.length} pet cards.`);
  } else {
    console.warn("modalListaPet.js: Elemento #cards-container não encontrado. A busca e o modal podem não funcionar.");
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir submit do form se o botão for type="submit"
      filterCards();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  function filterCards() {
    if (!searchInput || !allPetCards) return;
    const term = searchInput.value.trim().toLowerCase();
    allPetCards.forEach((card) => {
      const nome = card.dataset.nome?.toLowerCase() || "";
      const raca = card.dataset.raca?.toLowerCase() || "";
      const tutor = card.dataset.tutorNome?.toLowerCase() || "";
      const especie = card.dataset.especie?.toLowerCase() || "";

      if (nome.includes(term) || raca.includes(term) || tutor.includes(term) || especie.includes(term)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Função para criar e mostrar o modal de detalhes do pet
  function showPetDetailsModal(petCardElement) {
    console.log("showPetDetailsModal chamado para o card:", petCardElement);
    const petData = petCardElement.dataset; // Pega todos os atributos data-*
    console.log("Dados do pet para o modal:", petData);

    // Remover qualquer modal existente para evitar duplicatas
    const existingModal = document.querySelector(".modal-dashboard-lista-pet");
    if (existingModal) {
      existingModal.remove();
    }

    const modalDashboard = document.createElement("div");
    modalDashboard.classList.add("modal-dashboard", "modal-dashboard-lista-pet"); // Adicionando classe específica

    const closeButton = document.createElement("div");
    closeButton.classList.add("close-modal");
    closeButton.textContent = "X";
    closeButton.addEventListener("click", () => modalDashboard.remove());
    modalDashboard.appendChild(closeButton);

    const profilePetModal = document.createElement("div");
    profilePetModal.classList.add("profile-pet-modal");

    const petInfoModal = document.createElement("div");
    const petInfoModalName = document.createElement('div');
    const petImage = document.createElement("img");
    petImage.src = `/assets/images/${petData.imagemSrcArquivo || 'default-pet.png'}`; // Usa o data attribute
    petImage.alt = `Foto de ${petData.nome || 'Pet'}`;
    petInfoModal.appendChild(petImage);
    petInfoModal.appendChild(petInfoModalName);

    petInfoModal.classList.add("pet-info-modal");
    petInfoModalName.classList.add('pet-info-modal-name')

    const petName = document.createElement("h3");
    petName.textContent = petData.nome || 'Nome Indisponível';
    petInfoModalName.appendChild(petName);

    const petDetails = document.createElement("p");
    petDetails.innerHTML = `<span>${petData.idadeDisplay || 'Idade N/A'}</span> - <span>${petData.sexo || 'Sexo N/A'}</span> - <span>${petData.peso || 'Peso N/A'}</span>`;
    petInfoModalName.appendChild(petDetails);
    profilePetModal.appendChild(petInfoModal);

    const petBreed = document.createElement("h3");
    petBreed.textContent = "Raça: "+petData.raca || 'Raça Indisponível';
    profilePetModal.appendChild(petBreed);

    const ownerName = document.createElement("h3");
    ownerName.textContent ="Tutor: "+ petData.tutorNome || 'Tutor Indisponível';
    profilePetModal.appendChild(ownerName);
    modalDashboard.appendChild(profilePetModal);

    // Seção de registros (Histórico, Vacinas, Alergias)
    const recordOfPet = document.createElement("div");
    recordOfPet.classList.add("record-of-pet");

    // Histórico de Consultas (Exemplo - você precisaria de dados reais)
    const recordAppointments = document.createElement("div");
    recordAppointments.classList.add("record-appointments");
    const appointmentsTitle = document.createElement("h3");
    appointmentsTitle.textContent = "Histórico de consultas";
    recordAppointments.appendChild(appointmentsTitle);
    const appointmentsRecord = document.createElement("div");
    appointmentsRecord.classList.add("record");
    // TODO: Popular com dados reais de consultas do pet (ex: via fetch ou mais data attributes)
    const exemploConsulta = document.createElement("p");
    exemploConsulta.textContent = "Nenhum histórico de consulta disponível.";
    appointmentsRecord.appendChild(exemploConsulta);
    recordAppointments.appendChild(appointmentsRecord);
    recordOfPet.appendChild(recordAppointments);

    // Vacinas
    const recordVaccines = document.createElement("div");
    recordVaccines.classList.add("record-vaccines");
    const vaccinesTitle = document.createElement("h3");
    vaccinesTitle.textContent = "Vacinas";
    recordVaccines.appendChild(vaccinesTitle);
    const vaccinesRecord = document.createElement("div");
    vaccinesRecord.classList.add("record");
    const statusVacinasP = document.createElement("p");
    statusVacinasP.textContent = petData.statusVacinas || "Não informado";
    vaccinesRecord.appendChild(statusVacinasP);
    recordVaccines.appendChild(vaccinesRecord);
    recordOfPet.appendChild(recordVaccines);

    // Alergias
    const allergiesSection = document.createElement("div");
    allergiesSection.classList.add("allergies");
    const allergiesTitle = document.createElement("h3");
    allergiesTitle.textContent = "Alergias";
    allergiesSection.appendChild(allergiesTitle);
    const allergiesRecord = document.createElement("div");
    allergiesRecord.classList.add("record");
    const alergiasP = document.createElement("p");
    alergiasP.textContent = petData.alergias || "Não informado";
    allergiesRecord.appendChild(alergiasP);
    allergiesSection.appendChild(allergiesRecord);
    recordOfPet.appendChild(allergiesSection);
    modalDashboard.appendChild(recordOfPet);

    


  const newAppointmentSection = document.createElement("div");
    newAppointmentSection.classList.add("new-appointment"); // Use a mesma classe que você tinha

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title"); // Mantendo sua estrutura
    const titleIcon = document.createElement("img");
    titleIcon.src = "/assets/images/novo-agendamento.png"; // Ajuste o caminho se necessário
    titleIcon.alt = "Ícone de novo agendamento";
    const titleText = document.createElement("h1");
    titleText.appendChild(titleIcon);
    titleText.appendChild(document.createTextNode("Novo Agendamento"));
    titleDiv.appendChild(titleText);
    newAppointmentSection.appendChild(titleDiv);

    const formNewAppointment = document.createElement("form");
    formNewAppointment.id = "formNewAppointmentFromListaPet"; // ID único para este formulário

    const inputsContainer = document.createElement("div");
    inputsContainer.classList.add("inputs"); // Mantendo sua estrutura

    // Função auxiliar para criar campos do formulário
    function createFormField(labelText, inputType, inputName, inputId, options = null) {
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
            div.appendChild(input);
        }
        return div;
    }

    // Campos do formulário
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
    confirmButton.classList.add("new-appointment-button"); // Mantendo sua classe
    formNewAppointment.appendChild(confirmButton);
    newAppointmentSection.appendChild(formNewAppointment);
    modalDashboard.appendChild(newAppointmentSection);
    // --- FIM DA SEÇÃO DE NOVO AGENDAMENTO ---

    document.body.appendChild(modalDashboard);

    // Aplicar data mínima ao novo input de data
    const newDataInput = document.getElementById("listaPetModalData");
    if (newDataInput) {
        const dataAtual = new Date();
        const diaAtual = String(dataAtual.getDate()).padStart(2, '0');
        const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const anoAtual = dataAtual.getFullYear();
        newDataInput.min = `${anoAtual}-${mesAtual}-${diaAtual}`;
    }


    // Event listener para o formulário de novo agendamento
    formNewAppointment.addEventListener("submit", async function(e) {
        e.preventDefault();
        console.log("Formulário de Novo Agendamento (lista-pets modal) submetido.");

        const dataToSend = {
            // Dados do Pet (pegos do 'petData' do card que abriu o modal)
            petNome: petData.nome,
            especie: petData.especie,
            petRaca: petData.raca,
            sexo: petData.sexo,
            petAnoNascimento: petData.anoNascimento, // Supondo que 'anoNascimento' esteja no dataset
            petPeso: petData.peso,
            alergiasPet: petData.alergias,
            petVacinas: petData.statusVacinas,
            // Dados do Tutor (pegos do 'petData')
            tutorNome: petData.tutorNome,
            cpf: petData.tutorCpf, // Supondo que 'tutorCpf' esteja no dataset
            // telefone: petData.tutorTelefone, // Adicionar se tiver
            // endereco: petData.tutorEndereco, // Adicionar se tiver

            // Dados do Agendamento (pegos do formulário dentro do modal)
            tipoConsulta: document.getElementById("listaPetModalTipoConsulta").value,
            dataConsulta: document.getElementById("listaPetModalData").value,
            horario: document.getElementById("listaPetModalHorario").value,
            doutor: document.getElementById("listaPetModalDoutor").value,
        };

        console.log("Dados para novo agendamento (lista-pets modal):", dataToSend);

        // Validação simples (adicione mais se necessário)
        if (!dataToSend.dataConsulta || !dataToSend.horario || !dataToSend.tipoConsulta || !dataToSend.doutor) {
            alert("Por favor, preencha todos os campos do agendamento.");
            return;
        }
        if (!dataToSend.petNome || !dataToSend.especie || !dataToSend.tutorNome) {
            alert("Dados do pet ou tutor ausentes. Não é possível agendar.");
            return;
        }

        try {
            const response = await fetch("/agenda", { // Mesma rota de criar agendamento
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert("Novo agendamento criado com sucesso!");
                modalDashboard.remove(); // Fecha o modal de perfil do pet
                // Opcional: redirecionar para a agenda ou apenas informar o usuário
                // window.location.href = "/agenda"; 
            } else {
                const errorData = await response.text();
                console.error("Erro ao criar novo agendamento (lista-pets modal):", response.status, errorData);
                alert("Erro ao criar novo agendamento: " + errorData);
            }
        } catch (networkError) {
            console.error("Erro de rede ao criar novo agendamento (lista-pets modal):", networkError);
            alert("Erro de rede. Verifique sua conexão e tente novamente.");
        }
    });
    modalDashboard.appendChild(newAppointmentSection);
    document.body.appendChild(modalDashboard);
    console.log("Modal de detalhes do pet exibido.");
  }

  // Adicionar listener de clique a cada card de pet
  if (allPetCards.length > 0) {
    allPetCards.forEach((petCard) => {
      petCard.addEventListener("click", function() { // 'this' aqui é o petCard clicado
        showPetDetailsModal(this);
      });
    });
  }

  

  if (allPetCards.length > 0) {
    allPetCards.forEach((petCard) => {
      petCard.addEventListener("click", function() {
        showPetDetailsModal(this);
      });
    });
  }

  // LÓGICA PARA ABRIR MODAL DO PET DESTACADO VINDO DA AGENDA
  if (window.highlightedPetIdFromAgenda) {
    console.log("modalListaPet.js: Procurando pet destacado com ID:", window.highlightedPetIdFromAgenda);
    const targetPetCard = document.querySelector(`.pet-card[data-pet-id="${window.highlightedPetIdFromAgenda}"]`);
    if (targetPetCard) {
      console.log("modalListaPet.js: Pet card destacado encontrado:", targetPetCard);
      setTimeout(() => { showPetDetailsModal(targetPetCard); }, 100);
      delete window.highlightedPetIdFromAgenda; 
    } else {
      console.warn("modalListaPet.js: Pet card destacado com ID", window.highlightedPetIdFromAgenda, "não encontrado.");
    }
  } else {
    console.log("modalListaPet.js: Nenhum pet destacado vindo da agenda.");
  }
});
