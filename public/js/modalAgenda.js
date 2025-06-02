// public/js/modalAgenda.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Carregado. Iniciando modalAgenda.js");

  // --- SELETORES GERAIS E PARA MODAL DE ADICIONAR ---
  const addProfilePetButton = document.querySelector(".add-pet");
  const modalAddProfilePet = document.querySelector(".modal-add-pet-profile");
  const mainContent = document.querySelector("main");
  const dateInputs = document.querySelectorAll("input[type=date]"); // Usado para data mínima
  const modalAddProfilePetCloseButton = document.querySelector(".modal-add-pet-profile .close");
  const formAddPet = document.getElementById("formAddPet");
  const especieImageElements = document.querySelectorAll(".especie"); // Imagens clicáveis das espécies
  const petRacaSelect = document.getElementById("petRaca");
  const telefoneInput = document.getElementById("telefone");
  let especieSelectedId = ""; // Para o modal de adicionar

  // --- SELETORES PARA MODAL DE DETALHES ---
  const appointmentDetailsModal = document.getElementById("appointmentDetailsModal");
  const closeAppointmentDetailsModalButton = document.getElementById("closeAppointmentDetailsModal");
  const appointmentCards = document.querySelectorAll(".appointment-card-clickable"); // Os cards de agendamento
  // Campos internos do modal de detalhes
  const modalPetImage = document.getElementById("modalPetImage");
  const modalPetNome = document.getElementById("modalPetNome");
  const modalTutorNome = document.getElementById("modalTutorNome");
  const modalTutorCpf = document.getElementById("modalTutorCpf");
  const modalPetIdade = document.getElementById("modalPetIdade");
  const modalPetSexo = document.getElementById("modalPetSexo");
  const modalPetPeso = document.getElementById("modalPetPeso");
  const modalPetRaca = document.getElementById("modalPetRaca");
  const modalTipoConsulta = document.getElementById("modalTipoConsulta");
  const modalDoutor = document.getElementById("modalDoutor");
  const modalDataConsulta = document.getElementById("modalDataConsulta");
  const modalHorario = document.getElementById("modalHorario");
  const editAppointmentBtnInDetailsModal = document.getElementById("editAppointmentBtnInModal"); // Botão "Editar" no modal de detalhes
  const modalCancelAppointmentBtn = document.getElementById("modalCancelAppointmentBtn"); // Botão "Cancelar Consulta" (Excluir)

  // --- SELETORES PARA MODAL DE EDIÇÃO ---
  const editAppointmentModal = document.getElementById("editAppointmentModal");
  const closeEditAppointmentModalButton = document.getElementById("closeEditAppointmentModal");
  const formEditAppointment = document.getElementById("formEditAppointment");
  const editingAppointmentIdInput = document.getElementById("editingAppointmentId"); // Hidden input
  const editAppointmentDateInput = document.getElementById("editAppointmentDate");
  const editAppointmentHorarioSelect = document.getElementById("editAppointmentHorario");
  const editAppointmentTipoConsultaSelect = document.getElementById("editAppointmentTipoConsulta");
  const editAppointmentDoutorInput = document.getElementById("editAppointmentDoutor");

  // --- LOGS INICIAIS PARA VERIFICAR SELETORES ---
  console.log("--- Verificação de Seletores Iniciais ---");
  console.log("Modal Adicionar (modalAddProfilePet):", !!modalAddProfilePet);
  console.log("Modal Detalhes (appointmentDetailsModal):", !!appointmentDetailsModal);
  console.log("Botão Fechar Modal Detalhes:", !!closeAppointmentDetailsModalButton);
  console.log("Cards de Agendamento Encontrados (appointmentCards):", appointmentCards.length);
  console.log("Botão Editar no Modal de Detalhes (editAppointmentBtnInDetailsModal):", !!editAppointmentBtnInDetailsModal);
  console.log("Botão Cancelar/Excluir no Modal de Detalhes (modalCancelAppointmentBtn):", !!modalCancelAppointmentBtn);
  console.log("Modal de Edição (editAppointmentModal):", !!editAppointmentModal);
  console.log("Botão Fechar Modal Edição:", !!closeEditAppointmentModalButton);
  console.log("Formulário de Edição (formEditAppointment):", !!formEditAppointment);
  console.log("--------------------------------------");

  // --- LÓGICA PARA ABRIR MODAL DE DETALHES AO CLICAR NO CARD ---
  if (appointmentCards && appointmentCards.length > 0 && appointmentDetailsModal) {
    console.log(`Adicionando listeners de clique aos ${appointmentCards.length} cards de agendamento.`);
    appointmentCards.forEach((card) => {
      card.addEventListener("click", function () { // 'this' aqui é o CARD clicado
        console.log("--- Card de Agendamento Clicado ---");
        console.log("Card HTML:", this);
        console.log("Dados (dataset) do card:", this.dataset);

        if (!modalPetImage || !modalPetNome || !modalTutorNome || !modalTutorCpf || !modalPetIdade || !modalPetSexo || !modalPetPeso || !modalPetRaca || !modalTipoConsulta || !modalDoutor || !modalDataConsulta || !modalHorario) {
          console.error("ERRO: Um ou mais elementos internos do modal de detalhes não foram encontrados no DOM!");
          return;
        }

        modalPetImage.src = `/assets/images/${this.dataset.petEspecieImg || 'default-pet.png'}`;
        modalPetNome.textContent = this.dataset.petNome || 'N/A';
        modalTutorNome.textContent = this.dataset.petTutorNome || 'N/A';
        modalTutorCpf.textContent = this.dataset.petTutorCpf || 'N/A';
        modalPetIdade.textContent = this.dataset.petIdade || 'N/A';
        modalPetSexo.textContent = this.dataset.petSexo || 'N/A';
        modalPetPeso.textContent = this.dataset.petPeso || 'N/A';
        modalPetRaca.textContent = this.dataset.petRaca || 'N/A';
        modalTipoConsulta.textContent = this.dataset.tipoConsulta || 'N/A';
        modalDoutor.textContent = this.dataset.doutor || 'N/A';
        modalDataConsulta.textContent = this.dataset.dataConsultaDisplay || this.dataset.dataConsulta || 'N/A';
        modalHorario.textContent = this.dataset.horario || 'N/A';

        const cardAppointmentId = this.dataset.appointmentId; // ID do agendamento vindo do card

        // Definir atributos data-* para os botões DENTRO do modal de detalhes
        if (editAppointmentBtnInDetailsModal) {
          editAppointmentBtnInDetailsModal.setAttribute('data-appointment-id', cardAppointmentId);
          editAppointmentBtnInDetailsModal.setAttribute('data-current-date', this.dataset.dataConsultaIso || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-horario', this.dataset.horario || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-tipo', this.dataset.tipoConsulta || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-doutor', this.dataset.doutor || '');
          console.log("Atributos data-* definidos no botão Editar. ID:", cardAppointmentId);
        } else {
          console.warn("Botão Editar (#editAppointmentBtnInDetailsModal) não encontrado para definir atributos data-*.");
        }
       
        if (modalCancelAppointmentBtn) {
          if (cardAppointmentId) {
            modalCancelAppointmentBtn.setAttribute('data-appointment-id', cardAppointmentId);
            console.log("ID do agendamento DEFINIDO no botão Cancelar/Excluir:", cardAppointmentId);
          } else {
            console.warn("AVISO: cardAppointmentId do card está indefinido. Não foi possível definir data-attribute no botão Cancelar/Excluir.");
            modalCancelAppointmentBtn.removeAttribute('data-appointment-id');
          }
        } else {
          console.warn("Botão Cancelar/Excluir (#modalCancelAppointmentBtn) não encontrado para definir data-attribute.");
        }
        
        console.log("Exibindo modal de detalhes...");
        appointmentDetailsModal.style.display = "flex";
        if (mainContent) mainContent.classList.add("invisible");
      });
    });
  } else {
    if (!appointmentCards || appointmentCards.length === 0) console.warn("AVISO: Nenhum card de agendamento clicável (.appointment-card-clickable) foi encontrado.");
    if (!appointmentDetailsModal) console.warn("AVISO: O modal de detalhes (#appointmentDetailsModal) não foi encontrado.");
  }

  // --- LÓGICA PARA FECHAR MODAL DE DETALHES ---
  if (closeAppointmentDetailsModalButton && appointmentDetailsModal) {
    closeAppointmentDetailsModalButton.addEventListener("click", () => {
      console.log("Botão de fechar modal de detalhes clicado.");
      appointmentDetailsModal.style.display = "none";
      if (mainContent) mainContent.classList.remove("invisible");
    });
  } else {
    if (!closeAppointmentDetailsModalButton) console.warn("AVISO: Botão de fechar modal de detalhes (#closeAppointmentDetailsModal) não encontrado.");
  }

if (appointmentCards && appointmentCards.length > 0 && appointmentDetailsModal) {
    appointmentCards.forEach((card) => {
      card.addEventListener("click", function () {
        console.log("--- Card de Agendamento Clicado (Perfil Pet Debug v3) ---");
        const cardPetId = this.dataset.petId; // ID do Pet vindo do card
        console.log("ID do Pet lido do card (this.dataset.petId):", `"${cardPetId}"`); // Log com aspas para ver se é string vazia

        // Populando campos do modal de detalhes
        if(modalPetImage) modalPetImage.src = `/assets/images/${this.dataset.petEspecieImg || 'default-pet.png'}`;
        if(modalPetNome) modalPetNome.textContent = this.dataset.petNome || 'N/A';
        if(modalTutorNome) modalTutorNome.textContent = this.dataset.petTutorNome || 'N/A';
        if(modalTutorCpf) modalTutorCpf.textContent = this.dataset.petTutorCpf || 'N/A';
        if(modalPetIdade) modalPetIdade.textContent = this.dataset.petIdade || 'N/A';
        if(modalPetSexo) modalPetSexo.textContent = this.dataset.petSexo || 'N/A';
        if(modalPetPeso) modalPetPeso.textContent = this.dataset.petPeso || 'N/A';
        if(modalPetRaca) modalPetRaca.textContent = this.dataset.petRaca || 'N/A';
        if(modalTipoConsulta) modalTipoConsulta.textContent = this.dataset.tipoConsulta || 'N/A';
        if(modalDoutor) modalDoutor.textContent = this.dataset.doutor || 'N/A';
        if(modalDataConsulta) modalDataConsulta.textContent = this.dataset.dataConsultaDisplay || this.dataset.dataConsulta || 'N/A';
        if(modalHorario) modalHorario.textContent = this.dataset.horario || 'N/A';
        
        const cardAppointmentId = this.dataset.appointmentId;

        if (editAppointmentBtnInDetailsModal) {
          editAppointmentBtnInDetailsModal.setAttribute('data-appointment-id', cardAppointmentId);
          editAppointmentBtnInDetailsModal.setAttribute('data-current-date', this.dataset.dataConsultaIso || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-horario', this.dataset.horario || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-tipo', this.dataset.tipoConsulta || '');
          editAppointmentBtnInDetailsModal.setAttribute('data-current-doutor', this.dataset.doutor || '');
        }
        
        if (modalCancelAppointmentBtn) {
          if (cardAppointmentId) modalCancelAppointmentBtn.setAttribute('data-appointment-id', cardAppointmentId);
          else modalCancelAppointmentBtn.removeAttribute('data-appointment-id');
        }
        
        if (modalPetPerfilBtn) {
            // Sempre define o atributo, mesmo que cardPetId seja uma string vazia.
            // A lógica de clique no botão lidará com o valor.
            modalPetPerfilBtn.setAttribute('data-pet-id', cardPetId || ""); // Garante que seja string vazia se undefined/null
            console.log("Atributo 'data-pet-id' DEFINIDO no botão 'Perfil do Pet' com valor:", `"${cardPetId || ""}"`);

            // Opcional: Desabilitar o botão visualmente se não houver petId válido
            if (!cardPetId || cardPetId.trim() === '' || cardPetId === 'N/A') {
                modalPetPerfilBtn.disabled = true;
                modalPetPerfilBtn.style.opacity = 0.5; // Exemplo de feedback visual
                console.log("Botão 'Perfil do Pet' DESABILITADO pois não há petId válido.");
            } else {
                modalPetPerfilBtn.disabled = false;
                modalPetPerfilBtn.style.opacity = 1;
                console.log("Botão 'Perfil do Pet' HABILITADO.");
            }
        } else {
            console.error("ERRO CRÍTICO: Botão 'Perfil do Pet' (#modalPetPerfilBtn) não foi encontrado no DOM quando o card foi clicado.");
        }
        
        appointmentDetailsModal.style.display = "flex";
        if (mainContent) mainContent.classList.add("invisible");
      });
    });
  }

 if (modalPetPerfilBtn) {
    console.log("Adicionando listener de clique ao botão 'Perfil do Pet' (Elemento encontrado):", modalPetPerfilBtn);
    modalPetPerfilBtn.addEventListener("click", function() {
        console.log("--- Botão 'Perfil do Pet' CLICADO ---");
        const petId = this.getAttribute('data-pet-id');
        console.log("ID do Pet lido do atributo 'data-pet-id' do botão:", `"${petId}"`);

        // A verificação aqui é crucial
        if (petId && petId.trim() !== '' && petId !== 'N/A' && petId !== 'undefined' && petId !== 'null') {
            console.log("Redirecionando para:", `/lista-pets?highlightPetId=${petId}`);
            window.location.href = `/lista-pets?highlightPetId=${petId}`;
        } else {
            alert("Não há perfil de pet associado a este agendamento ou o ID do pet é inválido.");
            console.error("Falha ao obter petId válido do botão 'Perfil do Pet'. Valor lido:", `"${petId}"`);
        }
    });
  } else {
      console.error("ERRO CRÍTICO: Botão 'Perfil do Pet' (#modalPetPerfilBtn) NÃO foi encontrado no DOM para adicionar o listener.");
  }






  // --- LÓGICA PARA BOTÃO "EDITAR" DENTRO DO MODAL DE DETALHES (ABRIR MODAL DE EDIÇÃO) ---
  if (editAppointmentBtnInDetailsModal && editAppointmentModal && appointmentDetailsModal) {
    console.log("Adicionando listener de clique ao botão Editar do modal de detalhes (ID: editAppointmentBtnInDetailsModal).");
    editAppointmentBtnInDetailsModal.addEventListener("click", function() { // 'this' aqui é o BOTÃO EDITAR
      console.log("--- Botão Editar (no modal de detalhes) CLICADO ---");
      const appointmentId = this.getAttribute('data-appointment-id');
      const currentDate = this.getAttribute('data-current-date');
      const currentHorario = this.getAttribute('data-current-horario');
      const currentTipo = this.getAttribute('data-current-tipo');
      const currentDoutor = this.getAttribute('data-current-doutor');

      console.log("ID do Agendamento para editar:", appointmentId);
      console.log("Dados atuais para popular form de edição:", { currentDate, currentHorario, currentTipo, currentDoutor });

      if (!editingAppointmentIdInput || !editAppointmentDateInput || !editAppointmentHorarioSelect || !editAppointmentTipoConsultaSelect || !editAppointmentDoutorInput) {
        console.error("ERRO: Um ou mais campos do formulário de edição não foram encontrados no DOM!");
        return;
      }

      editingAppointmentIdInput.value = appointmentId || '';
      editAppointmentDateInput.value = currentDate || '';
      editAppointmentHorarioSelect.value = currentHorario || '';
      editAppointmentTipoConsultaSelect.value = currentTipo || '';
      editAppointmentDoutorInput.value = currentDoutor || '';
      
      console.log("Formulário de edição populado.");
      
      appointmentDetailsModal.style.display = "none"; 
      console.log("Modal de detalhes escondido.");
      
      editAppointmentModal.style.display = "block"; // Ou 'flex'
      console.log("Modal de edição exibido. Estilo display:", editAppointmentModal.style.display);
    });
  } else {
    if (!editAppointmentBtnInDetailsModal) console.warn("AVISO: Botão Editar (#editAppointmentBtnInDetailsModal) do modal de detalhes NÃO encontrado.");
    if (!editAppointmentModal) console.warn("AVISO: Modal de Edição (#editAppointmentModal) NÃO encontrado.");
  }

  // --- LÓGICA PARA BOTÃO "CANCELAR CONSULTA" (EXCLUIR) DENTRO DO MODAL DE DETALHES ---
  if (modalCancelAppointmentBtn) {
    console.log("Adicionando listener de clique ao botão Cancelar Consulta (Excluir). Elemento:", modalCancelAppointmentBtn);
    modalCancelAppointmentBtn.addEventListener("click", async function() { // 'this' aqui é o BOTÃO CANCELAR/EXCLUIR
        console.log("--- Botão Cancelar Consulta (Excluir) CLICADO ---");
        console.log("Elemento do botão clicado:", this);
        console.log("Atributos do botão:", this.attributes);
        const appointmentId = this.getAttribute('data-appointment-id');
        console.log("ID do Agendamento para excluir (lido do atributo):", appointmentId);

        if (!appointmentId || appointmentId === "undefined" || appointmentId === "null") {
            alert("Não foi possível identificar o agendamento para exclusão. O ID não está definido no botão.");
            console.error("Falha ao obter appointmentId do botão Cancelar/Excluir. Valor:", appointmentId);
            return;
        }

        if (confirm("Tem certeza que deseja cancelar (excluir) este agendamento? Esta ação não pode ser desfeita.")) {
            console.log(`Tentando excluir agendamento ID: ${appointmentId}`);
            try {
                const response = await fetch(`/agendamentos/delete/${appointmentId}`, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    alert('Agendamento excluído com sucesso!');
                    if (appointmentDetailsModal) appointmentDetailsModal.style.display = "none";
                    if (mainContent) mainContent.classList.remove("invisible");
                    location.reload(); 
                } else {
                    let errorMessage = `Erro ao excluir o agendamento (Status: ${response.status})`;
                    try { const errorResult = await response.json(); errorMessage = errorResult.message || errorResult.error || errorMessage; } 
                    catch (e) { errorMessage = response.statusText || errorMessage; }
                    console.error("Erro ao excluir agendamento:", response.status, errorMessage);
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erro de rede ao tentar excluir o agendamento:', error);
                alert('Erro de rede ao tentar excluir o agendamento. Verifique sua conexão.');
            }
        } else {
            console.log("Exclusão cancelada pelo usuário.");
        }
    });
  } else {
      console.warn("AVISO: Botão Cancelar Consulta (#modalCancelAppointmentBtn) NÃO encontrado no DOM.");
  }

  // --- LÓGICA PARA FECHAR MODAL DE EDIÇÃO ---
  if (closeEditAppointmentModalButton && editAppointmentModal) {
    closeEditAppointmentModalButton.addEventListener("click", () => {
      console.log("Botão fechar do modal de edição clicado.");
      editAppointmentModal.style.display = "none";
      if (mainContent) mainContent.classList.remove("invisible");
    });
  } else {
    if (!closeEditAppointmentModalButton) console.warn("AVISO: Botão de fechar modal de edição (#closeEditAppointmentModal) não encontrado.");
  }

  // --- LÓGICA PARA SUBMETER FORMULÁRIO DE EDIÇÃO ---
  if (formEditAppointment) {
    formEditAppointment.addEventListener("submit", async function(e) {
      e.preventDefault();
      const appointmentId = editingAppointmentIdInput.value;
      const updatedData = {
        dataConsulta: editAppointmentDateInput.value,
        horario: editAppointmentHorarioSelect.value,
        tipoConsulta: editAppointmentTipoConsultaSelect.value,
        doutor: editAppointmentDoutorInput.value,
      };

      console.log(`Submetendo edições para o agendamento ID: ${appointmentId}`, updatedData);

      if (!updatedData.dataConsulta || !updatedData.horario || !updatedData.tipoConsulta || !updatedData.doutor) {
        alert("Por favor, preencha todos os campos para editar o agendamento.");
        return;
      }

      try {
        const response = await fetch(`/agendamentos/edit/${appointmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert('Agendamento atualizado com sucesso!');
          if (editAppointmentModal) editAppointmentModal.style.display = "none";
          if (mainContent) mainContent.classList.remove("invisible");
          location.reload();
        } else {
          const errorResult = await response.json();
          console.error("Erro ao atualizar agendamento:", response.status, errorResult);
          alert(`Erro ao atualizar o agendamento: ${errorResult.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Erro de rede ao enviar edição:', error);
        alert('Erro de rede ao tentar editar o agendamento. Verifique sua conexão.');
      }
    });
  } else {
    console.warn("AVISO: Formulário de edição (#formEditAppointment) não encontrado.");
  }

  // --- LÓGICA PARA MODAL DE ADICIONAR PET/AGENDAMENTO (Mantida) ---
  const especiesGato = {0:"Selecione a Raça",1:"Persa",/*...*/10:"Sem raça definida"};
  const especiesCachorro = {0:"Selecione a Raça",1:"Labrador",/*...*/18:"Sem raça definida"};
  const especiesPassaro = {0:"Selecione a Raça",1:"Papagaio",/*...*/10:"Arara"};
  const especiesHamster = {0:"Selecione a Raça",1:"Porquinho-da-índia",/*...*/7:"Camundongo"};

  const dataAtual = new Date();
  let diaAtual = dataAtual.getDate();
  let mesAtual = dataAtual.getMonth() + 1;
  let anoAtual = dataAtual.getFullYear();
  mesAtual = mesAtual < 10 ? `0${mesAtual}` : mesAtual;
  diaAtual = diaAtual < 10 ? `0${diaAtual}` : diaAtual;
  const dataMinima = `${anoAtual}-${mesAtual}-${diaAtual}`;

  if (dateInputs) { // Aplica a todos os inputs de data, incluindo o de edição se tiver a classe.
    dateInputs.forEach((item) => {
      item.setAttribute("min", dataMinima);
    });
  }
  // Específico para o input de data do modal de edição, caso não seja pego pelo querySelectorAll acima.
  if (editAppointmentDateInput) { 
      editAppointmentDateInput.setAttribute("min", dataMinima);
  }

  if (addProfilePetButton && modalAddProfilePet && mainContent) {
    addProfilePetButton.addEventListener("click", () => {
      console.log("Botão Adicionar Pet clicado.");
      modalAddProfilePet.style.display = "block";
      if (formAddPet) formAddPet.reset();
      if (especieImageElements) especieImageElements.forEach((especieImg) => especieImg.classList.remove("selected"));
      if (petRacaSelect) {
        petRacaSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
        petRacaSelect.setAttribute("disabled", "true");
      }
      especieSelectedId = "";
      mainContent.classList.add("invisible");
    });
  }

  if (modalAddProfilePetCloseButton && modalAddProfilePet && mainContent) {
    modalAddProfilePetCloseButton.addEventListener("click", () => {
      modalAddProfilePet.style.display = "none";
      mainContent.classList.remove("invisible");
    });
  }

  if (especieImageElements && petRacaSelect) {
    especieImageElements.forEach((especieImgElement) => {
      especieImgElement.addEventListener("click", () => {
        especieImageElements.forEach((esp) => esp.classList.remove("selected"));
        especieImgElement.classList.add("selected");
        especieSelectedId = especieImgElement.id;
        
        petRacaSelect.removeAttribute("disabled");
        petRacaSelect.innerHTML = "";
        let optionsSource;
        if (especieSelectedId === "especieGato") optionsSource = especiesGato;
        else if (especieSelectedId === "especieCachorro") optionsSource = especiesCachorro;
        else if (especieSelectedId === "especiePassaro") optionsSource = especiesPassaro;
        else if (especieSelectedId === "especieHamster") optionsSource = especiesHamster;

        if (optionsSource) {
          for (const key in optionsSource) {
            if (optionsSource.hasOwnProperty(key)) {
              const optionElement = document.createElement("option");
              optionElement.value = optionsSource[key];
              optionElement.textContent = optionsSource[key];
              if (key === "0") optionElement.value = "";
              petRacaSelect.appendChild(optionElement);
            }
          }
        } else {
            petRacaSelect.innerHTML = '<option value="">Selecione uma espécie válida</option>';
            petRacaSelect.setAttribute("disabled", "true");
        }
      });
    });
  }
  
  let controlTel = 1;
  if (telefoneInput) {
    telefoneInput.addEventListener("input", () => { 
        if (controlTel == 1) {
            let value = telefoneInput.value.replace(/\D/g, "");
            if (value.length > 11) value = value.substring(0, 11);
            if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            if (value.length > 9) value = `${value.substring(0, 9)}-${value.substring(9)}`;
            telefoneInput.value = value;
        }
    });
    telefoneInput.addEventListener("keydown", function (event) { 
        controlTel = (event.key === "Backspace") ? 2 : 1;
    });
  }

  if (formAddPet) {
    formAddPet.addEventListener("submit", async function (e) {
      e.preventDefault();
      let nomeEspecieBackend = "";
      if (especieSelectedId === "especieGato") nomeEspecieBackend = "Gato";
      else if (especieSelectedId === "especieCachorro") nomeEspecieBackend = "Cachorro";
      else if (especieSelectedId === "especiePassaro") nomeEspecieBackend = "Pássaro";
      else if (especieSelectedId === "especieHamster") nomeEspecieBackend = "Hamster";

      const dataToSend = {
        petNome: document.getElementById("petNome")?.value,
        especie: nomeEspecieBackend,
        petRaca: document.getElementById("petRaca")?.value,
        sexo: document.getElementById("sexo")?.value,
        petAnoNascimento: document.getElementById("petAnoNascimento")?.value,
        petPeso: document.getElementById("petPeso")?.value,
        alergiasPet: document.getElementById("alergiasPet")?.value,
        petVacinas: document.getElementById("petVacinas")?.value,
        tutorNome: document.getElementById("tutorNome")?.value,
        cpf: document.getElementById("cpf")?.value,
        telefone: document.getElementById("telefone")?.value.replace(/\D/g, ""),
        endereco: document.getElementById("endereco")?.value,
        tipoConsulta: document.getElementById("tipoConsulta")?.value,
        dataConsulta: document.getElementById("dataConsulta")?.value,
        horario: document.getElementById("horario")?.value,
        doutor: document.getElementById("doutor")?.value,
      };
      
      // Sua lógica de validação aqui (toggleError, etc.)
      // Exemplo simples:
      let allValidationErrors = 0;
      if (!dataToSend.petNome || !dataToSend.especie || !dataToSend.tutorNome || !dataToSend.dataConsulta || !dataToSend.horario) {
          alert("Por favor, preencha todos os campos obrigatórios do pet, tutor e agendamento.");
          allValidationErrors++;
      }
      if (allValidationErrors > 0) {
          console.log("Formulário de adicionar com erros de validação.");
          return;
      }


      try {
        const response = await fetch("/agenda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (response.ok) {
            location.reload();
        } else {
          const errorData = await response.text();
          console.error("Erro ao adicionar pet/agendamento:", response.status, errorData);
          alert("Erro ao adicionar: " + errorData);
        }
      } catch (networkError) {
          console.error("Erro de rede:", networkError);
          alert("Erro de rede. Verifique sua conexão.");
      }
    });
  } else {
      console.warn("AVISO: Formulário de adicionar pet (#formAddPet) não encontrado.");
  }
});
