const contactForm = document.getElementById('contact-form');
const contactsList = document.getElementById('contacts-list');
const contactsCount = document.getElementById('contacts-count');
const notification = document.getElementById('notification');

// Carregar contatos do localStorage
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Função para mostrar notificação
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.className = 'notification';
    if (isError) {
        notification.classList.add('error');
    }
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Atualizar a lista de contatos
function updateContactsList() {
    contactsList.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<li class="empty-message">Nenhum contato cadastrado. Adicione seu primeiro contato!</li>';
    } else {
        contacts.forEach((contact, index) => {
            const li = document.createElement('li');
            li.className = 'contact-item';
            
            // Criar lista de linguagens como tags
            const languagesHTML = contact.languages && contact.languages.length > 0 
                ? contact.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')
                : '<span>Nenhuma selecionada</span>';
            
            li.innerHTML = `
                <div class="contact-header">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-actions">
                        <button class="btn-danger" data-index="${index}">Excluir</button>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="contact-field">
                        <div class="field-label">Telefone</div>
                        <div class="field-value">${contact.phone}</div>
                    </div>
                    <div class="contact-field">
                        <div class="field-label">Endereço</div>
                        <div class="field-value">${contact.address}</div>
                    </div>
                    <div class="contact-field">
                        <div class="field-label">Tipo de Moradia</div>
                        <div class="field-value"><span class="housing-tag">${contact.housing}</span></div>
                    </div>
                    <div class="contact-field">
                        <div class="field-label">Linguagens</div>
                        <div class="languages-list">${languagesHTML}</div>
                    </div>
                </div>
                ${contact.description ? `
                <div class="description">
                    <div class="field-label">Descrição</div>
                    <div class="field-value">${contact.description}</div>
                </div>
                ` : ''}
            `;
            contactsList.appendChild(li);
        });
        
        // Adicionar event listeners aos botões de excluir
        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeContact(index);
            });
        });
    }
    
    // Atualizar contador
    contactsCount.textContent = `${contacts.length} contato${contacts.length !== 1 ? 's' : ''}`;
}

// Adicionar novo contato
function addContact(name, phone, address, housing, languages, description) {
    contacts.push({ 
        name, 
        phone, 
        address, 
        housing, 
        languages, 
        description 
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    updateContactsList();
    showNotification('Contato adicionado com sucesso!');
}

// Remover contato
function removeContact(index) {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        const removedContact = contacts[index];
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        updateContactsList();
        showNotification(`Contato "${removedContact.name}" removido.`);
    }
}

// Event listener para o formulário
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const descricaoInput = document.getElementById('descricao');
    
    // Obter tipo de moradia selecionado
    const housingRadios = document.querySelectorAll('input[name="moradia"]');
    let housing = '';
    for (const radio of housingRadios) {
        if (radio.checked) {
            housing = radio.value;
            break;
        }
    }
    
    // Obter linguagens selecionadas
    const languageCheckboxes = document.querySelectorAll('input[name="linguagens"]:checked');
    const languages = Array.from(languageCheckboxes).map(cb => cb.value);
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const description = descricaoInput.value.trim();
    
    if (name && phone && address && housing) {
        addContact(name, phone, address, housing, languages, description);
        
        // Limpar formulário
        contactForm.reset();
        nameInput.focus();
    } else {
        showNotification('Por favor, preencha todos os campos obrigatórios!', true);
    }
});

// Inicializar a lista de contatos
updateContactsList();