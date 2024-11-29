// Importar módulos do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore, collection, getDocs, doc, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTGAw_uTl8K4R6g6Q0kzr8Pp32a7XWH3E",
  authDomain: "websmedu-clientes.firebaseapp.com",
  projectId: "websmedu-clientes",
  storageBucket: "websmedu-clientes.appspot.com",
  messagingSenderId: "99846671120",
  appId: "1:99846671120:web:07df21b232b4351523b395"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seleção de Clientes
const searchInput = document.getElementById('searchInput');
const optionsContainer = document.getElementById('optionsContainer');
const continueButton = document.getElementById('continueButton');
const infoForm = document.getElementById('infoForm');
let selectedClientId = null;

// Função para limpar tudo após o envio
function resetForm() {
  searchInput.value = '';
  searchInput.disabled = false;
  optionsContainer.innerHTML = '';
  optionsContainer.style.display = 'none';
  continueButton.disabled = true;
  infoForm.classList.add('hidden');
  infoForm.reset();
  document.querySelectorAll('.hospedagem-box').forEach((box) => {
    box.classList.remove('selected');
  });
  selectedClientId = null;
}

// Função para buscar clientes
searchInput.addEventListener('input', async () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm.length > 2) {
    const querySnapshot = await getDocs(collection(db, 'Clientes'));
    optionsContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name && data.name.toLowerCase().includes(searchTerm)) {
        const option = document.createElement('div');
        option.classList.add('option-item');
        option.innerHTML = `
          <div class="avatar">${data.name.match(/[A-Z]/g)?.slice(0, 2).join('') || ''}</div>
          <div class="option-details">
            <span class="option-name">${data.name}</span>
            <span class="option-email">${data.email}</span>
          </div>
        `;
        option.addEventListener('click', () => {
          selectedClientId = doc.id;
          searchInput.value = data.name;
          optionsContainer.innerHTML = '';
          continueButton.disabled = false;
        });
        optionsContainer.appendChild(option);
      }
    });
    optionsContainer.style.display = 'block';
  } else {
    optionsContainer.style.display = 'none';
  }
});

// Seleção de Hospedagem
document.querySelectorAll('.hospedagem-box').forEach((box) => {
  box.addEventListener('click', () => {
    document.querySelectorAll('.hospedagem-box').forEach((b) => b.classList.remove('selected'));
    box.classList.add('selected');
    document.getElementById('hospedagem').value = box.dataset.value;
  });
});

// Evento de clique no botão "Continuar"
continueButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evita o comportamento padrão
  infoForm.classList.remove('hidden'); // Mostra o formulário
  continueButton.disabled = true; // Desabilita o botão após clique
  searchInput.disabled = true; // Desabilita a pesquisa
});

// Envio do Formulário
infoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!selectedClientId) return alert('Selecione um cliente primeiro!');
  const tipoSite = document.getElementById('tipoSite').value;
  const hospedagem = document.getElementById('hospedagem').value;
  const observacoes = document.getElementById('observacoes').value;

  try {
    const clientRef = doc(db, 'Clientes', selectedClientId);
    await addDoc(collection(clientRef, 'relatório'), {
      tipoSite,
      hospedagem,
      observacoes,
      data: new Date().toISOString(),
    });

    alert('Informações enviadas com sucesso!');
    resetForm(); // Limpa tudo após o envio
  } catch (error) {
    console.error('Erro ao salvar informações:', error);
    alert('Erro ao enviar as informações.');
  }
});
